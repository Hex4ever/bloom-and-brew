import { useNavigate } from "react-router-dom";
import { Camera, PenLine, X, Check } from "lucide-react";
import { T, FONT } from "../styles/theme";
import { useViewport } from "../components/ui";
import { Header } from "../components/Header";
import { Pill } from "../components/Pill";
import { useAppContext } from "../AppContext";

export function BeanLog() {
  const navigate = useNavigate();
  const { beanLog, deleteBean } = useAppContext();
  const { isDesktop } = useViewport();

  return (
    <div>
      <Header title="Bean Log" onBack={() => navigate(-1)} />
      <div style={{ padding: "26px 22px", maxWidth: isDesktop ? 1000 : "none", margin: "0 auto" }}>
        <div style={{ fontSize: 28, fontWeight: 200, marginBottom: 6, letterSpacing: "-0.02em" }}>Your beans</div>
        <div style={{ fontSize: 12, color: T.creamDim, marginBottom: 22 }}>{beanLog.length} in rotation</div>

        {/* Add bean options */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 26 }}>
          <button
            onClick={() => navigate("/scan", { state: { mode: "scan" } })}
            style={{ background: T.bg2, border: `1px solid ${T.line}`, borderRadius: 14, padding: "18px 16px", textAlign: "center", cursor: "pointer" }}
          >
            <Camera size={20} color={T.accent} style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 13, color: T.cream, marginBottom: 4 }}>Scan packaging</div>
            <div style={{ fontSize: 11, color: T.creamDim }}>AI reads the label</div>
          </button>
          <button
            onClick={() => navigate("/scan", { state: { mode: "manual" } })}
            style={{ background: T.bg2, border: `1px solid ${T.line}`, borderRadius: 14, padding: "18px 16px", textAlign: "center", cursor: "pointer" }}
          >
            <PenLine size={20} color={T.accent} style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 13, color: T.cream, marginBottom: 4 }}>Enter manually</div>
            <div style={{ fontSize: 11, color: T.creamDim }}>Type the details in</div>
          </button>
        </div>

        {beanLog.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: T.creamDim, fontSize: 13 }}>
            No beans yet — scan a bag or enter one manually above.
          </div>
        )}

        <div style={{ display: "grid", gap: 12, gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr" }}>
          {beanLog.map((b, i) => (
            <div key={b.id ?? i} style={{ padding: 18, background: T.bg2, border: `1px solid ${T.line}`, borderRadius: 14, position: "relative" }}>
              <button
                onClick={() => void deleteBean(b.id)}
                style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", color: T.creamDim, cursor: "pointer", padding: 4 }}
                title="Remove bean"
              >
                <X size={14} color={T.creamDim} />
              </button>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <div style={{ fontSize: 16, paddingRight: 28 }}>{b.name}</div>
                <Pill dim>{b.date}</Pill>
              </div>
              <div style={{ fontSize: 12, color: T.creamDim, marginBottom: 10 }}>{b.roaster} · {b.roast}</div>
              {b.notes && <div style={{ fontSize: 12, color: T.cream, fontStyle: "italic" }}>"{b.notes}"</div>}
              {b.source === "scan" && (
                <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}>
                  <Check size={10} color={T.accent} />
                  <span style={{ fontSize: 10, color: T.accent, letterSpacing: "0.15em", fontFamily: FONT }}>SCANNED</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
