/**
 * send-push — internal Edge Function called by other functions to dispatch a
 * Web Push notification to all subscriptions for a given user.
 *
 * Body: { userId: string; title: string; body: string; url?: string }
 *
 * Required Supabase secrets:
 *   VAPID_PUBLIC_KEY   — base64url-encoded P-256 uncompressed public key
 *   VAPID_PRIVATE_KEY  — base64url-encoded P-256 raw private key
 *   VAPID_SUBJECT      — mailto: or https: contact URI (e.g. mailto:admin@yourdomain.com)
 */
import { createClient } from "npm:@supabase/supabase-js@2";
import webpush from "npm:web-push@3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

webpush.setVapidDetails(
  Deno.env.get("VAPID_SUBJECT") ?? "mailto:admin@beyondpours.app",
  Deno.env.get("VAPID_PUBLIC_KEY")!,
  Deno.env.get("VAPID_PRIVATE_KEY")!,
);

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const { userId, title, body, url } = await req.json() as {
    userId: string;
    title: string;
    body: string;
    url?: string;
  };

  if (!userId || !title || !body) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { data: subs, error } = await supabase
    .from("push_subscriptions")
    .select("endpoint, p256dh, auth")
    .eq("user_id", userId);

  if (error || !subs?.length) {
    return new Response(JSON.stringify({ sent: 0 }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const payload = JSON.stringify({ title, body, url: url ?? "/" });

  const results = await Promise.allSettled(
    subs.map((sub) =>
      webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        payload,
      )
    ),
  );

  // Clean up expired / invalid subscriptions (status 410 Gone)
  const expired = subs.filter((_, i) => {
    const r = results[i];
    return r.status === "rejected" && (r as PromiseRejectedResult).reason?.statusCode === 410;
  });

  if (expired.length) {
    await supabase
      .from("push_subscriptions")
      .delete()
      .in("endpoint", expired.map((s) => s.endpoint));
  }

  const sent = results.filter((r) => r.status === "fulfilled").length;
  return new Response(JSON.stringify({ sent }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
