import { useNavigate, useLocation } from "react-router-dom";
import { Coffee, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { T } from "../styles/theme";
import { useAppContext } from "../AppContext";
import { fmtTime } from "./BrewTimer";
import { useViewport } from "./ui";

export function BrewPill() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDesktop } = useViewport();
  const {
    activeBrewSession, toggleBrewPause, recipe,
    musicPlaying, musicMuted, toggleMusicMute, currentTrack,
  } = useAppContext();

  if (!activeBrewSession || location.pathname === "/brew") return null;

  const { elapsed, totalTime, phase, paused } = activeBrewSession;
  const progress = Math.min(elapsed / totalTime, 1);
  const circumference = 2 * Math.PI * 9;

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
        border: `1px solid ${paused ? T.creamDim : T.accent}`,
        borderRadius: 999,
        padding: "5px 8px 5px 8px",
        display: "flex",
        alignItems: "center",
        gap: 8,
        cursor: "pointer",
        boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
        minWidth: 190,
        maxWidth: 310,
        userSelect: "none",
      }}
    >
      {/* Circular progress ring — compact */}
      <div style={{ position: "relative", width: 24, height: 24, flexShrink: 0 }}>
        <svg width="24" height="24" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" fill="none" stroke={T.bg3} strokeWidth="1.5" />
          <circle
            cx="12" cy="12" r="9"
            fill="none"
            stroke={paused ? T.creamDim : T.accent}
            strokeWidth="1.5"
            strokeDasharray={`${circumference}`}
            strokeDashoffset={`${circumference * (1 - progress)}`}
            strokeLinecap="round"
            transform="rotate(-90 12 12)"
            style={{ transition: "stroke-dashoffset 0.8s linear" }}
          />
        </svg>
        <Coffee
          size={9}
          color={T.accent}
          style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}
        />
      </div>

      {/* Text — two lines max, music info replaces timer subtitle when playing */}
      <div style={{ flex: 1, overflow: "hidden", minWidth: 0 }}>
        <div style={{
          fontSize: 12, fontWeight: 400, color: T.cream,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {recipe?.title ?? "Brewing…"}
        </div>
        <div style={{
          fontSize: 10, color: T.creamDim, letterSpacing: "0.06em", marginTop: 1,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {musicPlaying && currentTrack
            ? `♫ ${currentTrack.title} · ${phase === "done" ? "done" : fmtTime(totalTime - elapsed)}`
            : phase === "done"
            ? "DONE — tap to save"
            : paused
            ? `PAUSED · ${fmtTime(totalTime - elapsed)} left`
            : `${fmtTime(totalTime - elapsed)} remaining`}
        </div>
      </div>

      {/* Mute — shown whenever music is playing, sits left of pause */}
      {musicPlaying && (
        <button
          onClick={(e) => { e.stopPropagation(); toggleMusicMute(); }}
          style={{
            background: "transparent",
            border: `1px solid ${T.line}`,
            borderRadius: 999,
            width: 24, height: 24,
            display: "grid", placeItems: "center",
            cursor: "pointer", flexShrink: 0,
          }}
          aria-label={musicMuted ? "Unmute music" : "Mute music"}
        >
          {musicMuted
            ? <VolumeX size={10} color={T.creamDim} />
            : <Volume2 size={10} color={T.accent} />}
        </button>
      )}

      {/* Pause / resume — only while brew is running */}
      {phase === "brewing" && (
        <button
          onClick={(e) => { e.stopPropagation(); toggleBrewPause(); }}
          style={{
            background: "transparent",
            border: `1px solid ${T.line}`,
            borderRadius: 999,
            width: 24, height: 24,
            display: "grid", placeItems: "center",
            cursor: "pointer", flexShrink: 0,
          }}
          aria-label={paused ? "Resume brew" : "Pause brew"}
        >
          {paused
            ? <Play  size={10} color={T.cream} />
            : <Pause size={10} color={T.cream} />}
        </button>
      )}
    </div>
  );
}
