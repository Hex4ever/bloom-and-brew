import { T } from "../styles/theme";
import { SCORE_AXES } from "../data/content";
import type { RatingAxes } from "../types";

interface Props {
  scores: RatingAxes;
}

/**
 * Read-only horizontal bar visualization of all five rating axes.
 * Used in JournalEntry cards to show a brew's flavor profile at a glance.
 */
export function RatingBars({ scores }: Props) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      {SCORE_AXES.map((a) => (
        <div key={a.key} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 11 }}>
          <div style={{ width: 70, color: T.creamDim }}>{a.label}</div>
          <div style={{ flex: 1, height: 4, background: T.bg3, borderRadius: 2, overflow: "hidden" }}>
            <div style={{
              width: `${scores[a.key] * 10}%`,
              height: "100%",
              background: T.accent,
            }} />
          </div>
          <div style={{ width: 18, textAlign: "right", color: T.cream }}>
            {scores[a.key]}
          </div>
        </div>
      ))}
    </div>
  );
}
