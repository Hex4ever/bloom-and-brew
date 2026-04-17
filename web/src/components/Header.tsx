import { ChevronLeft } from "lucide-react";
import { T } from "../styles/theme";
import { iconBtn } from "./ui";

interface Props {
  title: string;
  onBack?: () => void;
  right?: React.ReactNode;
}

export function Header({ title, onBack, right }: Props) {
  return (
    <div style={{
      display: "flex", alignItems: "center",
      padding: "20px 22px 14px",
      borderBottom: `1px solid ${T.line}`,
      gap: 14,
    }}>
      {onBack && (
        <button onClick={onBack} style={iconBtn}>
          <ChevronLeft size={18} color={T.cream} />
        </button>
      )}
      <div style={{
        fontSize: 13, letterSpacing: "0.18em",
        textTransform: "uppercase", color: T.creamDim, flex: 1,
      }}>
        {title}
      </div>
      {right}
    </div>
  );
}
