import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Plus, X, Check } from "lucide-react";
import { T, FONT } from "../styles/theme";
import { useViewport, iconBtn, primaryBtn, ghostBtn, inputStyle } from "../components/ui";
import { Header } from "../components/Header";
import { Pill } from "../components/Pill";
import { useAppContext } from "../AppContext";

interface AddBeanDraft {
  name: string;
  roaster: string;
  roast: string;
  notes: string;
  origin: string;
}

const DRAFT_EMPTY: AddBeanDraft = { name: "", roaster: "", roast: "Medium", notes: "", origin: "" };

export function BeanLog() {
  const navigate = useNavigate();
  const { beanLog, addBean, deleteBean } = useAppContext();
  const { isDesktop } = useViewport();

  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<AddBeanDraft>(DRAFT_EMPTY);
  const [saving, setSaving] = useState(false);

  const saveBean = async () => {
    if (!draft.name.trim()) return;
    setSaving(true);
    await addBean({ name: draft.name, roaster: draft.roaster, roast: draft.roast, notes: draft.notes, origin: draft.origin || undefined, source: "manual" });
    setSaving(false);
    setDraft(DRAFT_EMPTY);
    setAdding(false);
  };

  return (
    <div>
      <Header
        title="Bean Log"
        onBack={() => navigate(-1)}
        right={
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => navigate("/scan")} style={iconBtn}>
              <Camera size={16} color={T.cream} />
            </button>
            <button onClick={() => setAdding(true)} style={iconBtn}>
              <Plus size={16} color={T.cream} />
            </button>
          </div>
        }
      />
      <div style={{ padding: "26px 22px", maxWidth: isDesktop ? 1000 : "none", margin: "0 auto" }}>
        <div style={{ fontSize: 28, fontWeight: 200, marginBottom: 6, letterSpacing: "-0.02em" }}>Your beans</div>
        <div style={{ fontSize: 12, color: T.creamDim, marginBottom: 26 }}>{beanLog.length} in rotation</div>

        {/* Add bean form */}
        {adding && (
          <div style={{ background: T.bg2, border: `1px solid ${T.line}`, borderRadius: 16, padding: 20, marginBottom: 18 }}>
            <div style={{ fontSize: 14, marginBottom: 16 }}>Add a bean manually</div>
            <div style={{ display: "grid", gap: 12 }}>
              {(
                [["Bean name", "name"], ["Roaster", "roaster"], ["Origin", "origin"], ["Roast level", "roast"], ["Tasting notes", "notes"]] as [string, keyof AddBeanDraft][]
              ).map(([label, key]) => (
                <div key={key}>
                  <div style={{ fontSize: 10, letterSpacing: "0.2em", color: T.creamDim, marginBottom: 6 }}>{label.toUpperCase()}</div>
                  <input value={draft[key]} onChange={e => setDraft({ ...draft, [key]: e.target.value })} style={inputStyle} />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button onClick={() => { setAdding(false); setDraft(DRAFT_EMPTY); }} style={{ ...ghostBtn, flex: 1 }}>Cancel</button>
              <button onClick={saveBean} disabled={!draft.name.trim() || saving} style={{ ...primaryBtn, flex: 1, opacity: draft.name.trim() ? 1 : 0.4 }}>
                {saving ? "Saving…" : "Save bean"}
              </button>
            </div>
          </div>
        )}

        {beanLog.length === 0 && !adding && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 16, color: T.creamDim, marginBottom: 16 }}>No beans yet.</div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button onClick={() => navigate("/scan")} style={primaryBtn}>Scan a bag</button>
              <button onClick={() => setAdding(true)} style={{ ...primaryBtn, background: "transparent", border: `1px solid ${T.line}`, color: T.cream }}>
                Add manually
              </button>
            </div>
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
