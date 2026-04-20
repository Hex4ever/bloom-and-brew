import Anthropic from "npm:@anthropic-ai/sdk@0.39.0";
import { createClient } from "npm:@supabase/supabase-js@2";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const EXTRACT_PROMPT = `Extract coffee bag details from this image. Return ONLY a valid JSON object with these exact keys — no other text, no markdown:
{
  "name": "bean or blend name",
  "roaster": "roaster or company name",
  "origin": "country or region of origin",
  "roast": "one of: Light, Light-Medium, Medium, Medium-Dark, Dark",
  "notes": "tasting notes as a short comma-separated list"
}
If a field is not visible or unclear, use an empty string.`;

type MediaType = "image/jpeg" | "image/png" | "image/gif" | "image/webp";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: CORS_HEADERS });
  }

  // ── Auth ────────────────────────────────────────────────────────────────────
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return new Response("Unauthorized", { status: 401, headers: CORS_HEADERS });

  const userClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );

  const { data: { user }, error: authErr } = await userClient.auth.getUser();
  if (authErr || !user) return new Response("Unauthorized", { status: 401, headers: CORS_HEADERS });

  // ── Parse body ──────────────────────────────────────────────────────────────
  let body: { image?: string; mediaType?: string };
  try {
    body = await req.json();
  } catch {
    return new Response("Bad request — invalid JSON", { status: 400, headers: CORS_HEADERS });
  }

  const { image, mediaType } = body;
  if (!image || !mediaType) {
    return new Response(
      JSON.stringify({ error: "Missing image or mediaType" }),
      { status: 400, headers: { "Content-Type": "application/json", ...CORS_HEADERS } },
    );
  }

  // ── Call Claude Vision ──────────────────────────────────────────────────────
  const anthropic = new Anthropic({ apiKey: Deno.env.get("ANTHROPIC_API_KEY")! });

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 200,
      messages: [{
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: mediaType as MediaType, data: image },
          },
          { type: "text", text: EXTRACT_PROMPT },
        ],
      }],
    });

    const raw = response.content[0].type === "text" ? response.content[0].text.trim() : "";

    // Strip markdown code fences if Claude wrapped the JSON
    const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();

    let parsed: { name: string; roaster: string; origin: string; roast: string; notes: string };
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return new Response(
        JSON.stringify({ error: "Could not parse label — try a clearer photo" }),
        { status: 422, headers: { "Content-Type": "application/json", ...CORS_HEADERS } },
      );
    }

    return new Response(JSON.stringify(parsed), {
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { "Content-Type": "application/json", ...CORS_HEADERS } },
    );
  }
});
