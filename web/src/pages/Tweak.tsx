import { useCallback, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { T } from "../styles/theme";
import { useViewport, primaryBtn, inputStyle } from "../components/ui";
import { Header } from "../components/Header";
import { Pill } from "../components/Pill";
import { useAppContext } from "../AppContext";
import { useAuth } from "../AuthContext";
import { generateTweaks } from "../lib/tweakEngine";
import { SCORE_AXES } from "../data";
import type { JournalEntry, RatingAxes } from "../types";

// ─── Rules-based fallback helpers (matches reference) ────────────────────────

function weakest(s: RatingAxes) {
  return SCORE_AXES.map((a) => ({ label: a.label, value: s[a.key] }))
    .sort((a, b) => a.value - b.value)[0];
}

function answerQuestionLocally(q: string, entry: JournalEntry): string {
  const Q = q.toLowerCase();
  const s = entry.scores;

  if (Q.includes("bitter") || Q.includes("burnt")) {
    return s.bitterness >= 6
      ? `Your bitterness scored ${s.bitterness}/10 — over-extraction. Three levers: grind 1–2 clicks coarser, drop water temp by 2°C, or pour faster to reduce contact time. Try one change at a time.`
      : `Your bitterness was moderate (${s.bitterness}/10). If it tasted bitter anyway, it might be the bean's roast profile rather than your method. Try a lighter roast.`;
  }
  if (Q.includes("sour") || Q.includes("acid")) {
    return s.acidity >= 7 && s.sweetness <= 5
      ? `Bright acidity (${s.acidity}/10) without sweetness (${s.sweetness}/10) reads sour — under-extraction. Grind finer, raise temp to 95–96°C, or extend brew time. Very fresh beans (<7 days off-roast) often taste sharp.`
      : `Your acidity at ${s.acidity}/10 isn't extreme. If it tasted sour, the issue is likely lack of sweetness — try grinding finer.`;
  }
  if (Q.includes("body") || Q.includes("thin") || Q.includes("watery")) {
    return s.body <= 4
      ? `Body of ${s.body}/10 is thin. Three fixes: (1) Stronger ratio — try 1:15 instead of 1:16. (2) Skip late agitation. (3) Try a natural-process bean — more body than washed.`
      : `Body at ${s.body}/10 is decent. To push further, try a coarser grind — it slows drawdown and lets more soluble compounds through.`;
  }
  if (Q.includes("sweet")) {
    return `Sweetness comes from longer extraction of sugars. You scored ${s.sweetness}/10. Extend bloom to 45s, grind slightly finer, and ensure water is 94–96°C. Sweetness peaks 10–21 days post-roast.`;
  }
  if (Q.includes("temp") || Q.includes("temperature") || Q.includes("hot")) {
    return `You brewed at ${entry.temp ?? 93}°C. Light roasts want 94–96°C, medium 91–94°C, dark 88–92°C. Bitter? Drop 2°C. Sour or thin? Raise 2°C.`;
  }
  if (Q.includes("grind") || Q.includes("coarse") || Q.includes("fine")) {
    return `You used ${entry.clicks ?? "?"} clicks on ${entry.grinder}. Bitter? Coarser by 1–2 clicks. Sour or weak? Finer by 1–2. Always change ONE click at a time.`;
  }
  if (Q.includes("better") || Q.includes("improve")) {
    const w = weakest(s);
    return `Your overall was ${s.overall}/10. The biggest lift usually comes from your weakest score — yours is ${w.label} (${w.value}/10). Focus there first.`;
  }
  return `Based on your brew (overall ${s.overall}/10), check the suggestions above for specific tweaks tailored to your scores.`;
}

// ─── SSE streaming call to Edge Function ─────────────────────────────────────

async function streamTweakCoach(
  journalEntryId: string,
  userMessage: string,
  accessToken: string,
  onChunk: (text: string) => void,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/tweak-coach`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
        },
        body: JSON.stringify({ journal_entry_id: journalEntryId, user_message: userMessage }),
      },
    );

    if (!res.ok || !res.body) {
      if (res.status === 429) {
        const body = await res.json().catch(() => ({})) as { message?: string };
        return { ok: false, error: body.message ?? "Daily limit reached. Try again tomorrow." };
      }
      return { ok: false, error: `Coach unavailable (${res.status})` };
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        try {
          const data = JSON.parse(line.slice(6)) as {
            text?: string;
            done?: boolean;
            error?: string;
          };
          if (data.error) return { ok: false, error: data.error };
          if (data.text) onChunk(data.text);
        } catch {
          // ignore malformed SSE line
        }
      }
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "Network error — coach unavailable" };
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChatMessage {
  q: string;
  a: string;
  ai: boolean;  // true = Claude response, false = local fallback
}

// ─── Tweak page ───────────────────────────────────────────────────────────────

export function Tweak() {
  const navigate = useNavigate();
  const { pendingTweak } = useAppContext();
  const { session } = useAuth();
  const { isDesktop } = useViewport();

  const [question, setQuestion] = useState("");
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  const [streamingText, setStreamingText] = useState<string | null>(null); // null = idle
  const [isLoading, setIsLoading] = useState(false);
  const [rateLimitMsg, setRateLimitMsg] = useState<string | null>(null);
  const streamRef = useRef("");

  const entry = pendingTweak;

  const { diagnoses, suggestions } = useMemo(
    () => (entry ? generateTweaks(entry) : { diagnoses: [], suggestions: [] }),
    [entry],
  );

  // Entry must have a real DB id (not a temp- id) for the Edge Function
  const canUseAI = !!session && !!entry?.id && !entry?.id.startsWith("temp-");

  const ask = useCallback(async () => {
    if (!question.trim() || isLoading) return;
    const q = question.trim();
    setQuestion("");
    setRateLimitMsg(null);
    setIsLoading(true);
    streamRef.current = "";
    setStreamingText("");

    if (canUseAI) {
      const result = await streamTweakCoach(
        entry.id,
        q,
        session!.access_token,
        (chunk) => {
          streamRef.current += chunk;
          setStreamingText(streamRef.current);
        },
      );

      if (result.ok) {
        setChatLog((prev) => [...prev, { q, a: streamRef.current, ai: true }]);
        setStreamingText(null);
        setIsLoading(false);
        return;
      }

      // Rate limit gets its own banner; other errors fall back silently
      if (result.error?.includes("limit")) {
        setRateLimitMsg(result.error);
        setStreamingText(null);
        setIsLoading(false);
        return;
      }
    }

    // Local fallback (no session, temp id, or Edge Function error)
    const a = entry ? answerQuestionLocally(q, entry) : "No brew entry loaded.";
    setChatLog((prev) => [...prev, { q, a, ai: false }]);
    setStreamingText(null);
    setIsLoading(false);
  }, [question, isLoading, canUseAI, entry, session]);

  if (!entry) {
    return (
      <div>
        <Header title="Tweak Recipe" onBack={() => navigate(-1)} />
        <div style={{ padding: 40, textAlign: "center", color: T.creamDim }}>
          No brew selected. Open a journal entry first.
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Tweak This Recipe" onBack={() => navigate(-1)} />
      <div style={{ padding: "26px 22px", maxWidth: isDesktop ? 800 : "none", margin: "0 auto" }}>

        {/* Source brew summary */}
        <div style={{ background: T.bg2, border: `1px solid ${T.line}`, borderRadius: 16, padding: 20, marginBottom: 22 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.2em", color: T.creamDim, marginBottom: 6 }}>BASED ON</div>
          <div style={{ fontSize: 18, fontWeight: 300, marginBottom: 8 }}>{entry.recipeTitle}</div>
          <div style={{ fontSize: 11, color: T.creamDim, marginBottom: 12 }}>{entry.bean} · {entry.date}</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {SCORE_AXES.map((a) => (
              <Pill key={a.key} dim>{a.label}: {entry.scores[a.key]}</Pill>
            ))}
            <Pill>Overall: {entry.scores.overall}/10</Pill>
          </div>
        </div>

        {/* Diagnosis — rules-based, always shown */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <Sparkles size={14} color={T.accent} />
            <div style={{ fontSize: 10, letterSpacing: "0.25em", color: T.creamDim }}>WHAT WE'RE READING</div>
          </div>
          {diagnoses.map((d, i) => (
            <div key={i} style={{ fontSize: 14, color: T.cream, lineHeight: 1.55, marginBottom: 8 }}>{d}</div>
          ))}
        </div>

        {/* Suggestions — rules-based, always shown */}
        <div style={{ marginBottom: 26 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.25em", color: T.creamDim, marginBottom: 14 }}>TRY NEXT TIME</div>
          <div style={{ display: "grid", gap: 10 }}>
            {suggestions.map((sug, i) => (
              <div
                key={i}
                className="fade-up"
                style={{
                  background: T.bg2,
                  border: `1px solid ${T.line}`,
                  borderRadius: 12,
                  padding: 16,
                  animationDelay: `${i * 60}ms`,
                  display: "flex",
                  gap: 14,
                  alignItems: "flex-start",
                }}
              >
                <div style={{ width: 44, flexShrink: 0 }}>
                  <div style={{ fontSize: 9, letterSpacing: "0.2em", color: T.creamDim, marginBottom: 2 }}>
                    {sug.axis.toUpperCase()}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: T.accent, marginBottom: 4 }}>{sug.change}</div>
                  <div style={{ fontSize: 12, color: T.creamDim, lineHeight: 1.5 }}>{sug.why}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Q&A — Claude-powered */}
        <div style={{ borderTop: `1px solid ${T.line}`, paddingTop: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <div style={{ fontSize: 10, letterSpacing: "0.25em", color: T.creamDim }}>ASK THE COACH</div>
            {canUseAI && (
              <div style={{ fontSize: 9, color: T.accent, letterSpacing: "0.1em" }}>AI</div>
            )}
          </div>

          {/* Rate limit banner */}
          {rateLimitMsg && (
            <div style={{
              background: "#3a1a1a",
              border: `1px solid #7a3333`,
              borderRadius: 10,
              padding: "10px 14px",
              fontSize: 12,
              color: "#f4a0a0",
              marginBottom: 14,
            }}>
              {rateLimitMsg}
            </div>
          )}

          {/* Chat history */}
          {chatLog.length > 0 && (
            <div style={{ display: "grid", gap: 12, marginBottom: 16 }}>
              {chatLog.map((m, i) => (
                <div key={i}>
                  <div style={{ fontSize: 12, color: T.creamDim, marginBottom: 6, fontStyle: "italic" }}>
                    "{m.q}"
                  </div>
                  <div style={{
                    background: T.bg2,
                    border: `1px solid ${T.line}`,
                    borderRadius: 12,
                    padding: 14,
                    fontSize: 13,
                    color: T.cream,
                    lineHeight: 1.55,
                  }}>
                    {m.a}
                    {!m.ai && (
                      <span style={{ fontSize: 10, color: T.creamDim, marginLeft: 8 }}>(local)</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Streaming in-progress bubble */}
          {streamingText !== null && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: T.creamDim, marginBottom: 6, fontStyle: "italic" }}>
                "{question || chatLog.length > 0 ? "" : question}"
              </div>
              <div style={{
                background: T.bg2,
                border: `1px solid ${T.accent}44`,
                borderRadius: 12,
                padding: 14,
                fontSize: 13,
                color: T.cream,
                lineHeight: 1.55,
                minHeight: 40,
              }}>
                {streamingText || (
                  <span style={{ color: T.creamDim }}>Thinking…</span>
                )}
                {streamingText && <span style={{ opacity: 0.4 }}>▍</span>}
              </div>
            </div>
          )}

          {/* Input row */}
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && void ask()}
              placeholder="Why was it sour? How do I get more body?"
              disabled={isLoading}
              style={{ ...inputStyle, flex: 1, opacity: isLoading ? 0.6 : 1 }}
            />
            <button
              onClick={() => void ask()}
              disabled={isLoading || !question.trim()}
              style={{ ...primaryBtn, padding: "14px 22px", opacity: isLoading || !question.trim() ? 0.5 : 1 }}
            >
              {isLoading ? "…" : "Ask"}
            </button>
          </div>

          <div style={{ fontSize: 10, color: T.creamDim, marginTop: 10, lineHeight: 1.5 }}>
            Try: "why is it bitter", "how do I get more sweetness", "should I change beans"
          </div>
        </div>
      </div>
    </div>
  );
}
