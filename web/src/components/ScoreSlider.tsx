import { T } from "../styles/theme";
import type { ScoreAxisConfig } from "../data/content";

interface Props {
  axis: ScoreAxisConfig;
  value: number;   // 1-10
  onChange: (v: number) => void;
}

export function ScoreSlider({ axis, value, onChange }: Props) {
  return (
    <div style={{
      background: T.bg2, border: `1px solid ${T.line}`, borderRadius: 12, padding: 14,
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10,
      }}>
        <div style={{ fontSize: 13, color: T.cream }}>{axis.label}</div>
        <div style={{ fontSize: 16, fontWeight: 300, color: T.accent }}>
          {value}
          <span style={{ color: T.creamDim, fontSize: 11 }}>/10</span>
        </div>
      </div>

      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: T.accent }}
      />

      <div style={{
        display: "flex", justifyContent: "space-between",
        fontSize: 10, color: T.creamDim, marginTop: 4, letterSpacing: "0.1em",
      }}>
        <span>{axis.lo.toUpperCase()}</span>
        <span>{axis.hi.toUpperCase()}</span>
      </div>
    </div>
  );
}
