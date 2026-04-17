import { useState } from "react";
import { Check, Lightbulb, ChevronRight } from "lucide-react";
import { T } from "../styles/theme";
import { PRE_BREW, DEFAULT_PRE_BREW } from "../data";
import type { MethodId } from "../types";

interface Props {
  methodId: MethodId | string;
}

export function PrepChecklist({ methodId }: Props) {
  const data = (PRE_BREW as Record<string, typeof DEFAULT_PRE_BREW>)[methodId] ?? DEFAULT_PRE_BREW;
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [expanded, setExpanded] = useState(true);

  const completedCount = Object.values(checked).filter(Boolean).length;
  const allDone = completedCount === data.steps.length;

  function toggle(i: number) {
    setChecked((prev) => ({ ...prev, [i]: !prev[i] }));
  }

  return (
    <div style={{
      background: T.bg2,
      border: `1px solid ${allDone ? T.accent : T.line}`,
      borderRadius: 14, marginBottom: 18, overflow: "hidden",
      transition: "border-color 0.3s",
    }}>
      {/* Header toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%", padding: "18px 22px", background: "none", border: "none",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          color: T.cream, textAlign: "left",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8, flexShrink: 0,
            background: allDone ? T.accent : T.bg3,
            color: allDone ? T.bg : T.accent,
            display: "grid", placeItems: "center",
          }}>
            {allDone
              ? <Check size={14} color={T.bg} />
              : <Lightbulb size={14} />
            }
          </div>
          <div>
            <div style={{ fontSize: 10, letterSpacing: "0.2em", color: T.creamDim, marginBottom: 3 }}>
              PREP CHECKLIST
            </div>
            <div style={{ fontSize: 14 }}>{data.title}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: 11, color: T.creamDim }}>
            {completedCount}/{data.steps.length}
          </div>
          <div style={{ transform: expanded ? "rotate(90deg)" : "none", transition: "transform 0.2s" }}>
            <ChevronRight size={14} color={T.creamDim} />
          </div>
        </div>
      </button>

      {/* Step list */}
      {expanded && (
        <div style={{ padding: "0 22px 20px", borderTop: `1px solid ${T.line}` }}>
          <div style={{
            fontSize: 12, color: T.creamDim, fontStyle: "italic",
            padding: "14px 0 16px", lineHeight: 1.5,
          }}>
            {data.note}
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            {data.steps.map((s, i) => {
              const isChecked = !!checked[i];
              return (
                <button
                  key={i}
                  onClick={() => toggle(i)}
                  style={{
                    display: "flex", gap: 12, padding: "12px 14px",
                    background: isChecked ? T.bg3 : "transparent",
                    border: `1px solid ${isChecked ? T.accent : T.line}`,
                    borderRadius: 10, color: T.cream, textAlign: "left",
                    transition: "all 0.2s",
                  }}
                >
                  {/* Checkbox */}
                  <div style={{
                    width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
                    border: `1.5px solid ${isChecked ? T.accent : T.creamDim}`,
                    background: isChecked ? T.accent : "transparent",
                    display: "grid", placeItems: "center",
                  }}>
                    {isChecked && <Check size={11} color={T.bg} strokeWidth={3} />}
                  </div>
                  {/* Text */}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: 13, marginBottom: 3,
                      textDecoration: isChecked ? "line-through" : "none",
                      opacity: isChecked ? 0.5 : 1,
                    }}>
                      {i + 1}. {s.title}
                    </div>
                    <div style={{ fontSize: 11, color: T.creamDim, lineHeight: 1.5 }}>{s.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
