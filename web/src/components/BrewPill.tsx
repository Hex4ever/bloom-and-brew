import { useNavigate, useLocation } from "react-router-dom";
import { Coffee, Pause, Play } from "lucide-react";
import { T } from "../styles/theme";
import { useAppContext } from "../AppContext";
import { fmtTime } from "./BrewTimer";
import { useViewport } from "./ui";

export function BrewPill() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDesktop } = useViewport();
  const { activeBrewSession, toggleBrewPause, recipe } = useAppContext();

  if (!activeBrewSession || location.pathname === "/brew") return null;

  const { elapsed, totalTime, phase, paused } = activeBrewSession;
  const progress = Math.min(elapsed / totalTime, 1);
  const circumference = 2 * Math.PI * 11;

  // Center the pill in the content area (offset by half the sidebar on desktop)
  const leftOffset = isDesktop ? "calc(120px + 50%)" : "50%";

  return (
    <div
      onClick={() => navigate("/brew")}
      style={{
        position: "fixed",
        top: 12,
        left: leftOffset,
        transform: "translateX(-50%)",
        zIndex: 1000,
        background: T.brownDeep,
        border: `1px solid ${phase === "done" ? T.accent : paused ? T.creamDim : T.accent}`,
        borderRadius: 999,
        padding: "7px 14px 7px 10px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        cursor: "pointer",
        boxShadow: "0 4px 24px rgba(0,0,0,0.6)",
        minWidth: 210,
        maxWidth: 320,
        userSelect: "none",
      }}
    >
      {/* Circular progress ring */}
      <div style={{ position: "relative", width: 30, height: 30, flexShrink: 0 }}>
        <svg width="30" height="30" viewBox="0 0 30 30">
          <circle cx="15" cy="15" r="11" fill="none" stroke={T.bg3} strokeWidth="2" />
          <circle
            cx="15" cy="15" r="11"
            fill="none"
            stroke={phase === "done" ? T.accent : paused ? T.creamDim : T.accent}
            strokeWidth="2"
            strokeDasharray={`${circumference}`}
            strokeDashoffset={`${circumference * (1 - progress)}`}
            strokeLinecap="round"
            transform="rotate(-90 15 15)"
            style={{ transition: "stroke-dashoffset 0.8s linear" }}
          />
        </svg>
        <Coffee
          size={11}
          color={T.accent}
          style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}
        />
      </div>

      {/* Text */}
      <div style={{ flex: 1, overflow: "hidden", minWidth: 0 }}>
        <div style={{
          fontSize: 12, fontWeight: 400, color: T.cream,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {recipe?.title ?? "Brewing…"}
        </div>
        <div style={{ fontSize: 10, color: T.creamDim, letterSpacing: "0.08em", marginTop: 1 }}>
          {phase === "done"
            ? "DONE — tap to save"
            : paused
            ? `PAUSED · ${fmtTime(totalTime - elapsed)} left`
            : `${fmtTime(totalTime - elapsed)} remaining`}
        </div>
      </div>

      {/* Pause / resume — only while brew is running */}
      {phase === "brewing" && (
        <button
          onClick={(e) => { e.stopPropagation(); toggleBrewPause(); }}
          style={{
            background: "transparent",
            border: `1px solid ${T.line}`,
            borderRadius: 999,
            width: 28, height: 28,
            display: "grid", placeItems: "center",
            cursor: "pointer", flexShrink: 0,
          }}
          aria-label={paused ? "Resume brew" : "Pause brew"}
        >
          {paused
            ? <Play  size={11} color={T.cream} />
            : <Pause size={11} color={T.cream} />}
        </button>
      )}
    </div>
  );
}
