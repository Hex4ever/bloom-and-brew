import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Camera, PenLine } from "lucide-react";
import { T } from "../styles/theme";
import { useViewport, primaryBtn } from "../components/ui";
import { Header } from "../components/Header";
import { useAppContext } from "../AppContext";

export function Setup() {
  const navigate = useNavigate();
  const { grinder, setGrinder, bean, setBean, beanLog, availableGrinders } = useAppContext();
  const { isDesktop } = useViewport();
  const [stage, setStage] = useState<"beans" | "grinder">("beans");

  return (
    <div>
      <Header
        title={stage === "beans" ? "Your beans — 1/2" : "Your grinder — 2/2"}
        onBack={() => stage === "grinder" ? setStage("beans") : navigate(-1)}
      />
      <div style={{ padding: "30px 22px", maxWidth: isDesktop ? 700 : "none", margin: "0 auto" }}>

        {stage === "beans" && (
          <>
            <div style={{ fontSize: 28, fontWeight: 200, marginBottom: 6, letterSpacing: "-0.02em" }}>Your beans</div>
            <div style={{ fontSize: 12, color: T.creamDim, marginBottom: 26 }}>Pick from your log or scan a new bag.</div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
              <button onClick={() => navigate("/scan", { state: { mode: "scan" } })} style={{
                padding: "18px 16px", border: `1px dashed ${T.line}`, background: T.bg2,
                color: T.cream, borderRadius: 14, display: "flex", flexDirection: "column",
                alignItems: "center", gap: 8, cursor: "pointer",
              }}>
                <Camera size={18} color={T.accent} />
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 13 }}>Scan packaging</div>
                  <div style={{ fontSize: 11, color: T.creamDim, marginTop: 2 }}>Auto-fill from photo</div>
                </div>
              </button>
              <button onClick={() => navigate("/scan", { state: { mode: "manual" } })} style={{
                padding: "18px 16px", border: `1px dashed ${T.line}`, background: T.bg2,
                color: T.cream, borderRadius: 14, display: "flex", flexDirection: "column",
                alignItems: "center", gap: 8, cursor: "pointer",
              }}>
                <PenLine size={18} color={T.accent} />
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 13 }}>Enter manually</div>
                  <div style={{ fontSize: 11, color: T.creamDim, marginTop: 2 }}>Type in the details</div>
                </div>
              </button>
            </div>

            <div style={{ fontSize: 10, letterSpacing: "0.2em", color: T.creamDim, marginBottom: 12 }}>FROM YOUR LOG</div>
            <div style={{ display: "grid", gap: 10, marginBottom: 30 }}>
              {beanLog.map((b, i) => {
                const sel = bean?.id === b.id;
                return (
                  <button key={i} onClick={() => setBean(b)} style={{
                    padding: "16px 18px",
                    background: sel ? T.cream : T.bg2,
                    color: sel ? T.bg : T.cream,
                    border: `1px solid ${sel ? T.cream : T.line}`,
                    borderRadius: 14, textAlign: "left", cursor: "pointer",
                  }}>
                    <div style={{ fontSize: 14 }}>{b.name}</div>
                    <div style={{ fontSize: 11, opacity: 0.6, marginTop: 4 }}>
                      {b.roaster} · {b.roast} · {b.notes}
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setStage("grinder")}
              disabled={!bean}
              style={{ ...primaryBtn, width: "100%", opacity: bean ? 1 : 0.4 }}
            >
              Continue
            </button>
          </>
        )}

        {stage === "grinder" && (
          <>
            <div style={{ fontSize: 28, fontWeight: 200, marginBottom: 6, letterSpacing: "-0.02em" }}>Your grinder</div>
            <div style={{ fontSize: 12, color: T.creamDim, marginBottom: 26 }}>
              We'll convert recipe grind sizes into clicks for your specific model.
            </div>
            <div style={{ display: "grid", gap: 10, marginBottom: 30 }}>
              {availableGrinders.map((g) => {
                const sel = grinder?.id === g.id;
                return (
                  <button key={g.id} onClick={() => setGrinder(g)} style={{
                    display: "flex", alignItems: "center", padding: "16px 18px",
                    background: sel ? T.cream : T.bg2,
                    color: sel ? T.bg : T.cream,
                    border: `1px solid ${sel ? T.cream : T.line}`,
                    borderRadius: 14, gap: 12, cursor: "pointer",
                  }}>
                    <div style={{ flex: 1, textAlign: "left" }}>
                      <div style={{ fontSize: 14 }}>{g.name}</div>
                      <div style={{ fontSize: 10, opacity: 0.6, letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 3 }}>{g.type}</div>
                    </div>
                    {sel && <Check size={16} />}
                  </button>
                );
              })}
            </div>
            <button onClick={() => navigate("/methods")} style={{ ...primaryBtn, width: "100%" }}>
              Choose a method
            </button>
          </>
        )}

      </div>
    </div>
  );
}
