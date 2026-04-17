import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Book, Sparkles } from "lucide-react";
import { T, FONT } from "../styles/theme";
import { useViewport, primaryBtn } from "../components/ui";
import { Header } from "../components/Header";
import { Pill } from "../components/Pill";
import { RatingBars } from "../components";
import { useAppContext } from "../AppContext";
import type { JournalEntry } from "../types";

// ─── JournalEntryCard ─────────────────────────────────────────────────────────

function JournalEntryCard({ entry, idx }: { entry: JournalEntry; idx: number }) {
  const navigate = useNavigate();
  const { setPendingBrew, setPendingTweak } = useAppContext();

  const upgradeToFull = () => {
    setPendingBrew({
      recipeId:    entry.recipeId,
      recipeTitle: entry.recipeTitle,
      method:      entry.method,
      bean:        entry.bean,
      grinder:     entry.grinder,
      dose:        entry.dose,
      water:       entry.water,
      temp:        entry.temp,
      clicks:      entry.clicks,
      existingId:  entry.id,
    });
    navigate("/rating");
  };

  return (
    <div className="fade-up" style={{ background: T.bg2, border: `1px solid ${T.line}`, borderRadius: 16, padding: 20, animationDelay: `${idx * 40}ms` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
        <div style={{ fontSize: 15, color: T.cream }}>{entry.recipeTitle}</div>
        <Pill dim>{entry.date}</Pill>
      </div>
      <div style={{ fontSize: 11, color: T.creamDim, marginBottom: 14 }}>
        {entry.bean} · {entry.grinder}
        {entry.quickLogged && <span style={{ color: T.accent, marginLeft: 8 }}>· Quick log</span>}
      </div>

      {entry.quickLogged ? (
        <div style={{ background: T.bg3, border: `1px dashed ${T.line}`, borderRadius: 10, padding: 14, marginBottom: 14, textAlign: "center" }}>
          <div style={{ fontSize: 12, color: T.creamDim, marginBottom: 8 }}>
            You rated this {entry.scores.overall}/10 overall.
          </div>
          <button onClick={upgradeToFull} style={{ background: "transparent", border: `1px solid ${T.line}`, color: T.accent, padding: "8px 16px", borderRadius: 999, fontSize: 11, fontFamily: FONT, cursor: "pointer" }}>
            Add detailed rating →
          </button>
        </div>
      ) : (
        <div style={{ marginBottom: 14 }}>
          <RatingBars scores={entry.scores} />
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: `1px solid ${T.line}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.2em", color: T.creamDim }}>OVERALL</div>
          <div style={{ fontSize: 18, fontWeight: 300, color: T.accent }}>{entry.scores.overall}/10</div>
        </div>
        {!entry.quickLogged && (
          <button onClick={() => { setPendingTweak(entry); navigate("/tweak"); }}
            style={{ background: T.cream, color: T.bg, border: "none", padding: "8px 16px", borderRadius: 999, fontSize: 11, fontFamily: FONT, letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
            <Sparkles size={11} color={T.bg} /> Tweak
          </button>
        )}
      </div>

      {entry.notes && (
        <div style={{ marginTop: 12, fontSize: 12, color: T.creamDim, fontStyle: "italic", lineHeight: 1.5 }}>
          "{entry.notes}"
        </div>
      )}
    </div>
  );
}

// ─── Journal page ─────────────────────────────────────────────────────────────

export function Journal() {
  const navigate = useNavigate();
  const { brewLog } = useAppContext();
  const { isDesktop } = useViewport();

  const avgOverall = brewLog.length
    ? (brewLog.reduce((s, e) => s + e.scores.overall, 0) / brewLog.length).toFixed(1)
    : "—";

  const methodCounts = useMemo(() => {
    const c: Record<string, number> = {};
    brewLog.forEach((e) => { c[e.method] = (c[e.method] ?? 0) + 1; });
    return Object.entries(c).sort((a, b) => b[1] - a[1]);
  }, [brewLog]);

  return (
    <div>
      <Header title="Brew Journal" onBack={() => navigate(-1)} />
      <div style={{ padding: "26px 22px", maxWidth: isDesktop ? 1000 : "none", margin: "0 auto" }}>
        <div style={{ fontSize: 28, fontWeight: 200, marginBottom: 6, letterSpacing: "-0.02em" }}>Your brews</div>
        <div style={{ fontSize: 12, color: T.creamDim, marginBottom: 22 }}>
          {brewLog.length} logged · Avg overall {avgOverall}/10
        </div>

        {methodCounts.length > 0 && (
          <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
            {methodCounts.map(([m, n]) => (
              <Pill key={m} dim>{m.toUpperCase()} · {n}</Pill>
            ))}
          </div>
        )}

        {brewLog.length === 0 ? (
          <div style={{ padding: "60px 30px", textAlign: "center", background: T.bg2, border: `1px dashed ${T.line}`, borderRadius: 16 }}>
            <Book size={28} color={T.creamDim} />
            <div style={{ fontSize: 16, marginTop: 14 }}>No brews logged yet</div>
            <div style={{ fontSize: 12, color: T.creamDim, marginTop: 8, marginBottom: 22 }}>
              Brew a recipe and tap "Log brew" when finished.
            </div>
            <button onClick={() => navigate("/methods")} style={primaryBtn}>Start a brew</button>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 14, gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr" }}>
            {brewLog.map((e, i) => <JournalEntryCard key={e.id} entry={e} idx={i} />)}
          </div>
        )}
      </div>
    </div>
  );
}
