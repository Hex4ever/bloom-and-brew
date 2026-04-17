/**
 * Shared style constants and the useViewport hook.
 * Re-exported from components/index.ts.
 */
import { useState, useEffect } from "react";
import { T, FONT } from "../styles/theme";

// ─── useViewport ──────────────────────────────────────────────────────────────
export function useViewport() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return { width: w, isDesktop: w >= 900 };
}

// ─── Inline style presets ─────────────────────────────────────────────────────
export const iconBtn: React.CSSProperties = {
  width: 34, height: 34,
  border: `1px solid ${T.line}`,
  background: "transparent",
  borderRadius: 999,
  display: "grid",
  placeItems: "center",
  color: T.cream,
  cursor: "pointer",
};

export const primaryBtn: React.CSSProperties = {
  background: T.cream, color: T.bg, border: "none",
  padding: "14px 28px", borderRadius: 999,
  fontSize: 13, fontWeight: 500,
  letterSpacing: "0.1em", textTransform: "uppercase",
  cursor: "pointer",
  fontFamily: FONT,
};

export const ghostBtn: React.CSSProperties = {
  background: "transparent", color: T.cream,
  border: `1px solid ${T.line}`,
  padding: "14px 28px", borderRadius: 999,
  fontSize: 13,
  letterSpacing: "0.1em", textTransform: "uppercase",
  cursor: "pointer",
  fontFamily: FONT,
};

export const inputStyle: React.CSSProperties = {
  width: "100%", background: T.bg2,
  border: `1px solid ${T.line}`,
  color: T.cream,
  padding: "14px 16px", borderRadius: 12,
  fontSize: 14, fontFamily: FONT, outline: "none",
};
