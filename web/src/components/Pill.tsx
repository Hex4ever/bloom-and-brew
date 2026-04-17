import { T } from "../styles/theme";

interface Props {
  children: React.ReactNode;
  dim?: boolean;
}

export function Pill({ children, dim }: Props) {
  return (
    <span style={{
      fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase",
      padding: "4px 9px", border: `1px solid ${T.line}`, borderRadius: 999,
      color: dim ? T.creamDim : T.cream,
      whiteSpace: "nowrap",
    }}>
      {children}
    </span>
  );
}
