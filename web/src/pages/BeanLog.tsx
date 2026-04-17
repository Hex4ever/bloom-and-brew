import { useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";
import { T } from "../styles/theme";
import { useViewport, iconBtn } from "../components/ui";
import { Header } from "../components/Header";
import { Pill } from "../components/Pill";
import { useAppContext } from "../AppContext";

export function BeanLog() {
  const navigate = useNavigate();
  const { beanLog } = useAppContext();
  const { isDesktop } = useViewport();

  return (
    <div>
      <Header
        title="Bean Log"
        onBack={() => navigate(-1)}
        right={
          <button onClick={() => navigate("/scan")} style={iconBtn}>
            <Camera size={16} color={T.cream} />
          </button>
        }
      />
      <div style={{ padding: "26px 22px", maxWidth: isDesktop ? 1000 : "none", margin: "0 auto" }}>
        <div style={{ fontSize: 28, fontWeight: 200, marginBottom: 6, letterSpacing: "-0.02em" }}>Your beans</div>
        <div style={{ fontSize: 12, color: T.creamDim, marginBottom: 26 }}>{beanLog.length} in rotation</div>

        {beanLog.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: T.creamDim, fontSize: 13 }}>
            No beans yet. Scan a bag to get started.
          </div>
        )}

        <div style={{ display: "grid", gap: 12, gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr" }}>
          {beanLog.map((b, i) => (
            <div key={b.id ?? i} style={{ padding: 18, background: T.bg2, border: `1px solid ${T.line}`, borderRadius: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <div style={{ fontSize: 16 }}>{b.name}</div>
                <Pill dim>{b.date}</Pill>
              </div>
              <div style={{ fontSize: 12, color: T.creamDim, marginBottom: 10 }}>{b.roaster} · {b.roast}</div>
              <div style={{ fontSize: 12, color: T.cream, fontStyle: "italic" }}>"{b.notes}"</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
