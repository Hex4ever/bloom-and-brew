import Anthropic from "npm:@anthropic-ai/sdk@0.39.0";
import { createClient } from "npm:@supabase/supabase-js@2";

const DAILY_LIMIT = 50;
const MAX_HISTORY_TURNS = 6; // 3 back-and-forth turns

// ─── System prompt — marked ephemeral for prompt caching ──────────────────────
const COFFEE_SYSTEM_PROMPT = `You are a professional coffee brewing coach with deep expertise in extraction science, grind theory, water chemistry, and sensory evaluation. You help home brewers diagnose their brews and improve their next cup.

When answering:
- Be specific: give grind clicks, temperatures in °C, times in seconds, ratios
- Recommend changing ONE variable at a time
- Reference the actual scores from the brew log in your response
- Keep responses under 120 words — concise and actionable
- No preamble or filler — get straight to the advice
- If the question is unclear, ask one clarifying question rather than guessing
- Never suggest more than 3 changes at once

Core extraction science:
- Over-extraction → bitter, dry, astringent. Fix: coarser grind, lower temp (−2°C), faster pour
- Under-extraction → sour, sharp, weak sweetness. Fix: finer grind, higher temp (+2°C), slower pour
- Thin body → low dissolved solids. Fix: stronger ratio (less water), skip late swirl, try natural-process beans
- Muddy/heavy → sediment + over-extraction. Fix: coarser grind, longer filter pre-rinse
- Low sweetness → extraction stopped before sugars dissolved. Fix: 45s bloom (vs 30s), 1 click finer
- Short aftertaste → stale beans or mineral-poor water. Fix: check roast date (<4 weeks), use filtered (not RO) water
- Temperature guide: light roasts 94–96°C, medium 91–94°C, dark 88–92°C
- Bloom: 2× dose in water, wait 30–45s for CO₂ off-gassing before main pour
- Ratio: 1:15 strong · 1:16 standard · 1:17 lighter`;

// ─── Brew context builder ─────────────────────────────────────────────────────
interface BrewRow {
  recipe_title: string | null;
  bean_name: string | null;
  grinder_name: string | null;
  method_id: string | null;
  dose_g_used: number | null;
  water_g_used: number | null;
  temp_c_used: number | null;
  clicks_used: number | null;
  sweetness: number | null;
  acidity: number | null;
  body: number | null;
  bitterness: number | null;
  aftertaste: number | null;
  overall: number | null;
  notes: string | null;
}

function buildBrewContext(row: BrewRow): string {
  const lines: string[] = [
    `Recipe: ${row.recipe_title ?? "unknown"}`,
    `Method: ${row.method_id ?? "unknown"}`,
    `Bean: ${row.bean_name ?? "unknown"}`,
    `Grinder: ${row.grinder_name ?? "unknown"}`,
  ];
  if (row.dose_g_used)  lines.push(`Dose: ${row.dose_g_used}g`);
  if (row.water_g_used) lines.push(`Water: ${row.water_g_used}g`);
  if (row.temp_c_used)  lines.push(`Temperature: ${row.temp_c_used}°C`);
  if (row.clicks_used)  lines.push(`Grind: ${row.clicks_used} clicks`);
  lines.push(
    `Scores (1–10): Sweetness ${row.sweetness} · Acidity ${row.acidity} · Body ${row.body} · Bitterness ${row.bitterness} · Aftertaste ${row.aftertaste} · Overall ${row.overall}`,
  );
  if (row.notes?.trim()) lines.push(`Tasting notes: ${row.notes.trim()}`);
  return lines.join("\n");
}

// ─── SSE helpers ──────────────────────────────────────────────────────────────
const enc = new TextEncoder();
function sseChunk(payload: Record<string, unknown>): Uint8Array {
  return enc.encode(`data: ${JSON.stringify(payload)}\n\n`);
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ─── Handler ──────────────────────────────────────────────────────────────────
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  // ── Auth ──────────────────────────────────────────────────────────────────
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return new Response("Unauthorized", { status: 401 });

  const userClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );

  const { data: { user }, error: authErr } = await userClient.auth.getUser();
  if (authErr || !user) return new Response("Unauthorized", { status: 401 });

  // Service-role client for all DB reads/writes inside the function
  const db = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // ── Parse body ────────────────────────────────────────────────────────────
  let body: { journal_entry_id?: string; user_message?: string };
  try {
    body = await req.json();
  } catch {
    return new Response("Bad request — invalid JSON", { status: 400 });
  }

  const { journal_entry_id, user_message } = body;
  if (!journal_entry_id || !user_message?.trim()) {
    return new Response(
      JSON.stringify({ error: "Missing journal_entry_id or user_message" }),
      { status: 400, headers: { "Content-Type": "application/json", ...CORS_HEADERS } },
    );
  }

  // ── Verify journal entry belongs to this user ─────────────────────────────
  const { data: brewRow, error: entryErr } = await db
    .from("journal_entries")
    .select(
      "id, user_id, recipe_title, bean_name, grinder_name, method_id, " +
      "dose_g_used, water_g_used, temp_c_used, clicks_used, " +
      "sweetness, acidity, body, bitterness, aftertaste, overall, notes",
    )
    .eq("id", journal_entry_id)
    .eq("user_id", user.id)
    .single();

  if (entryErr || !brewRow) {
    return new Response("Journal entry not found", { status: 404, headers: CORS_HEADERS });
  }

  // ── Rate limit — count today's user messages across all their threads ──────
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const { data: userEntries } = await db
    .from("journal_entries")
    .select("id")
    .eq("user_id", user.id);

  const entryIds = (userEntries ?? []).map((e: { id: string }) => e.id);

  if (entryIds.length > 0) {
    const { data: userThreads } = await db
      .from("tweak_threads")
      .select("id")
      .in("journal_entry_id", entryIds);

    const threadIds = (userThreads ?? []).map((t: { id: string }) => t.id);

    if (threadIds.length > 0) {
      const { count } = await db
        .from("tweak_messages")
        .select("id", { count: "exact", head: true })
        .eq("role", "user")
        .in("thread_id", threadIds)
        .gte("created_at", todayStart.toISOString());

      if ((count ?? 0) >= DAILY_LIMIT) {
        return new Response(
          JSON.stringify({
            error: "rate_limit",
            message: `Daily limit of ${DAILY_LIMIT} coach questions reached. Try again tomorrow.`,
          }),
          { status: 429, headers: { "Content-Type": "application/json", ...CORS_HEADERS } },
        );
      }
    }
  }

  // ── Find or create tweak thread ───────────────────────────────────────────
  let threadId: string;
  const { data: existing } = await db
    .from("tweak_threads")
    .select("id")
    .eq("journal_entry_id", journal_entry_id)
    .maybeSingle();

  if (existing) {
    threadId = existing.id;
  } else {
    const { data: created, error: createErr } = await db
      .from("tweak_threads")
      .insert({ journal_entry_id })
      .select("id")
      .single();

    if (createErr || !created) {
      return new Response("Failed to create thread", { status: 500, headers: CORS_HEADERS });
    }
    threadId = created.id;
  }

  // ── Load conversation history ─────────────────────────────────────────────
  const { data: history } = await db
    .from("tweak_messages")
    .select("role, content")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true })
    .limit(MAX_HISTORY_TURNS);

  // ── Persist user message ───────────────────────────────────────────────────
  await db.from("tweak_messages").insert({
    thread_id: threadId,
    role: "user",
    content: user_message.trim(),
  });

  // ── Build messages array for Claude ───────────────────────────────────────
  const brewContext = buildBrewContext(brewRow as BrewRow);
  const msgs: Array<{ role: "user" | "assistant"; content: string }> = [];

  if (!history || history.length === 0) {
    // First question — embed brew context
    msgs.push({
      role: "user",
      content: `Brew log:\n${brewContext}\n\nQuestion: ${user_message.trim()}`,
    });
  } else {
    // Restore history; prepend brew context to the first user message
    let firstUser = true;
    for (const msg of history) {
      if (msg.role === "user" && firstUser) {
        msgs.push({ role: "user", content: `Brew log:\n${brewContext}\n\nQuestion: ${msg.content as string}` });
        firstUser = false;
      } else {
        msgs.push({ role: msg.role as "user" | "assistant", content: msg.content as string });
      }
    }
    msgs.push({ role: "user", content: user_message.trim() });
  }

  // ── Stream Claude response ────────────────────────────────────────────────
  const anthropic = new Anthropic({
    apiKey: Deno.env.get("ANTHROPIC_API_KEY")!,
    defaultHeaders: { "anthropic-beta": "prompt-caching-2024-07-31" },
  });

  let fullResponse = "";

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const claudeStream = anthropic.messages.stream({
          model: "claude-sonnet-4-6",
          max_tokens: 300,
          system: [
            {
              type: "text",
              text: COFFEE_SYSTEM_PROMPT,
              // @ts-expect-error: cache_control is valid with the caching beta header
              cache_control: { type: "ephemeral" },
            },
          ],
          messages: msgs,
        });

        for await (const event of claudeStream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            const text = event.delta.text;
            fullResponse += text;
            controller.enqueue(sseChunk({ text }));
          }
        }

        controller.enqueue(sseChunk({ done: true }));
        controller.close();

        // Persist assistant message after stream completes
        await db.from("tweak_messages").insert({
          thread_id: threadId,
          role: "assistant",
          content: fullResponse,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        controller.enqueue(sseChunk({ error: message }));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      ...CORS_HEADERS,
    },
  });
});
