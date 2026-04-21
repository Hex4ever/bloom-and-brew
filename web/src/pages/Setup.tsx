import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Camera, PenLine, Plus } from "lucide-react";
import { T } from "../styles/theme";
import { useViewport, primaryBtn, inputStyle } from "../components/ui";
import { Header } from "../components/Header";
import { useAppContext } from "../AppContext";

export function Setup() {
  const navigate = useNavigate();
  const { grinder, setGrinder, bean, setBean, beanLog, availableGrinders, addGrinder } = useAppContext();
  const { isDesktop } = useViewport();
  const [stage, setStage] = useState<"beans" | "grinder">("beans");

  // Grinder sub-state
  const [showPicker, setShowPicker] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customType, setCustomType] = useState<"Hand" | "Electric">("Hand");
  const [customMicrons, setCustomMicrons] = useState("");
  const [addingGrinder, setAddingGrinder] = useState(false);

  const handleAddGrinder = async () => {
    if (!customName.trim()) return;
    setAddingGrinder(true);
    const micronsPerClick = customMicrons ? parseFloat(customMicrons) : undefined;
    const saved = await addGrinder({ name: customName.trim(), type: customType, micronsPerClick });
    setGrinder(saved);
    setAddingGrinder(false);
    setShowAddForm(false);
    setShowPicker(false);
    setCustomName("");
    setCustomMicrons("");
  };

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
              We'll convert recipe grind sizes to clicks for your specific model.
            </div>

            {/* ── Currently selected grinder — always shown prominently ── */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, letterSpacing: "0.2em", color: T.creamDim, marginBottom: 10 }}>YOUR GRINDER</div>
              <div style={{
                padding: "18px 20px", background: T.cream, color: T.bg,
                borderRadius: 14, display: "flex", alignItems: "center", gap: 12,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 400 }}>{grinder.name}</div>
                  <div style={{ fontSize: 10, opacity: 0.5, letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 3 }}>{grinder.type}</div>
                </div>
                <Check size={16} />
              </div>
            </div>

            {/* ── Change grinder toggle ── */}
            {!showPicker ? (
              <button
                onClick={() => setShowPicker(true)}
                style={{ background: "none", border: "none", color: T.creamDim, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", padding: "2px 0", marginBottom: 28 }}
              >
                Use a different grinder →
              </button>
            ) : (
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 10, letterSpacing: "0.2em", color: T.creamDim, marginBottom: 10 }}>CHOOSE ANOTHER</div>
                <div style={{ display: "grid", gap: 8 }}>
                  {availableGrinders.map((g) => {
                    const sel = grinder.id === g.id;
                    return (
                      <button key={g.id} onClick={() => { setGrinder(g); setShowPicker(false); setShowAddForm(false); }} style={{
                        display: "flex", alignItems: "center", padding: "14px 18px",
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

                  {/* ── Add your grinder ── */}
                  {!showAddForm ? (
                    <button onClick={() => setShowAddForm(true)} style={{
                      padding: "16px 18px", border: `1px dashed ${T.line}`, background: T.bg2,
                      color: T.cream, borderRadius: 14, display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
                    }}>
                      <Plus size={16} color={T.accent} />
                      <div style={{ textAlign: "left" }}>
                        <div style={{ fontSize: 14 }}>Add your grinder</div>
                        <div style={{ fontSize: 11, color: T.creamDim, marginTop: 2 }}>Not on the list? Save it to your profile</div>
                      </div>
                    </button>
                  ) : (
                    <div style={{ background: T.bg2, border: `1px solid ${T.accent}`, borderRadius: 14, padding: 18 }}>
                      <div style={{ fontSize: 10, letterSpacing: "0.2em", color: T.creamDim, marginBottom: 14 }}>ADD YOUR GRINDER</div>
                      <input
                        autoFocus
                        placeholder="e.g. Weber EG-1, Niche Zero, DF64…"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        style={{ ...inputStyle, marginBottom: 12 }}
                      />
                      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                        {(["Hand", "Electric"] as const).map((t) => (
                          <button key={t} onClick={() => setCustomType(t)} style={{
                            flex: 1, padding: "10px 0",
                            background: customType === t ? T.cream : T.bg3,
                            color: customType === t ? T.bg : T.creamDim,
                            border: `1px solid ${customType === t ? T.cream : T.line}`,
                            borderRadius: 10, fontSize: 13, cursor: "pointer",
                          }}>{t}</button>
                        ))}
                      </div>
                      <div style={{ fontSize: 10, letterSpacing: "0.15em", color: T.creamDim, marginBottom: 6 }}>
                        MICRONS PER CLICK <span style={{ opacity: 0.5 }}>— OPTIONAL</span>
                      </div>
                      <input
                        type="number"
                        min="1"
                        max="200"
                        placeholder={customType === "Hand" ? "Default ~30 (e.g. Comandante)" : "Default ~40 (e.g. Encore)"}
                        value={customMicrons}
                        onChange={(e) => setCustomMicrons(e.target.value)}
                        style={{ ...inputStyle, marginBottom: 10 }}
                      />
                      <div style={{ fontSize: 10, color: T.creamDim, marginBottom: 16, lineHeight: 1.6 }}>
                        {customMicrons && !isNaN(parseFloat(customMicrons)) && parseFloat(customMicrons) > 0
                          ? `Each click = ${parseFloat(customMicrons)} µm · click counts will be accurate for your grinder.`
                          : `Usually in your grinder's spec sheet or reviews. Leave blank and we'll use a sensible default.`}
                      </div>
                      <button
                        onClick={() => void handleAddGrinder()}
                        disabled={!customName.trim() || addingGrinder}
                        style={{ ...primaryBtn, width: "100%", opacity: customName.trim() ? 1 : 0.4 }}
                      >
                        {addingGrinder ? "Saving…" : "Save grinder"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            <button onClick={() => navigate("/methods")} style={{ ...primaryBtn, width: "100%" }}>
              Choose a method
            </button>
          </>
        )}

      </div>
    </div>
  );
}
