import { T } from "../styles/theme";
import type { RecipeStep } from "../types";

// ─── Helpers ───────────────────────────────────────────────────────────────

/** Format seconds as M:SS */
export function fmtTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

/** Animated pulsing dot shown while brewing */
export function PulseDot() {
  return (
    <div style={{ position: "relative", width: 10, height: 10 }}>
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%", background: T.accent,
        animation: "pulse-ring 1.5s ease-out infinite",
      }} />
      <div style={{ position: "absolute", inset: 2, borderRadius: "50%", background: T.accent }} />
    </div>
  );
}

// ─── BrewTimer ─────────────────────────────────────────────────────────────

interface Props {
  /** Elapsed seconds since brew started */
  elapsed: number;
  /** Total expected brew time in seconds */
  total: number;
  /** The next step in the schedule (undefined when on the last step) */
  nextStep?: RecipeStep;
  /** Whether the brew is actively running */
  brewing: boolean;
}

/**
 * Displays elapsed time, a progress bar, and a countdown to the next step.
 * Pure display component — the parent drives the clock via setInterval.
 */
export function BrewTimer({ elapsed, total, nextStep, brewing }: Props) {
  const progress = Math.min(elapsed / total, 1);
  const hasNext = !!nextStep && brewing;

  return (
    <>
      {/* Elapsed / next-step countdown */}
      <div style={{ padding: "20px 22px 8px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: hasNext ? "1fr 1px 1fr" : "1fr",
          gap: 20, alignItems: "center",
        }}>
          {/* Elapsed */}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 9, color: T.creamDim, letterSpacing: "0.3em", marginBottom: 6 }}>
              ELAPSED
            </div>
            <div style={{
              fontSize: hasNext ? 48 : 64, fontWeight: 100,
              letterSpacing: "-0.04em", color: T.cream,
              lineHeight: 1, fontVariantNumeric: "tabular-nums",
            }}>
              {fmtTime(elapsed)}
            </div>
            <div style={{ fontSize: 10, color: T.creamDim, letterSpacing: "0.2em", marginTop: 6 }}>
              OF {fmtTime(total)}
            </div>
          </div>

          {/* Divider */}
          {hasNext && (
            <div style={{ width: 1, height: 80, background: T.line, justifySelf: "center" }} />
          )}

          {/* Next step countdown */}
          {hasNext && nextStep && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 9, color: T.accent, letterSpacing: "0.3em", marginBottom: 6 }}>
                NEXT IN
              </div>
              <div style={{
                fontSize: 48, fontWeight: 100, letterSpacing: "-0.04em",
                color: T.accent, lineHeight: 1, fontVariantNumeric: "tabular-nums",
              }}>
                {fmtTime(Math.max(0, nextStep.t - elapsed))}
              </div>
              <div style={{
                fontSize: 10, color: T.creamDim, letterSpacing: "0.15em",
                marginTop: 6, textTransform: "uppercase",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {nextStep.label}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ padding: "20px 22px" }}>
        <div style={{ height: 2, background: T.line, borderRadius: 2, overflow: "hidden" }}>
          <div style={{
            width: `${progress * 100}%`, height: "100%",
            background: T.accent, transition: "width 0.5s linear",
          }} />
        </div>
      </div>
    </>
  );
}
