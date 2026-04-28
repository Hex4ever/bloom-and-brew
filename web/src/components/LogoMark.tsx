import { T } from "../styles/theme";

interface Props {
  size?: number;
  bg?: string;
  color?: string;
  border?: string;
}

export function LogoMark({ size = 28, bg = T.cream, color = T.bg, border }: Props) {
  const svgSize = Math.round(size * 0.62);
  return (
    <div style={{
      width: size, height: size,
      background: bg,
      borderRadius: Math.round(size * 0.28),
      border,
      display: "grid",
      placeItems: "center",
      color,
      flexShrink: 0,
    }}>
      <svg width={svgSize} height={svgSize} viewBox="0 0 16 16" fill="none" aria-hidden="true">
        {/* Steam */}
        <path d="M5 5.5C4.5 4.5 5.5 3.5 5 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M9 5.5C8.5 4.5 9.5 3.5 9 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        {/* Rim */}
        <rect x="1.5" y="6" width="10" height="1.5" rx="0.75" fill="currentColor"/>
        {/* Body */}
        <rect x="2" y="7.5" width="9" height="7" rx="1.5" fill="currentColor"/>
        {/* Handle */}
        <path d="M11 9C14 9 14 13 11 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    </div>
  );
}
