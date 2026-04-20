import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Award } from "lucide-react";
import { T, FONT } from "../styles/theme";
import { useViewport, primaryBtn, inputStyle } from "../components/ui";
import { Header } from "../components/Header";
import { useAppContext } from "../AppContext";
import { useAuth } from "../AuthContext";
import { supabase } from "../lib/supabase";
import { METHODS } from "../data";

export function SubmitRecipe() {
  const navigate = useNavigate();
  const { method } = useAppContext();
  const { user } = useAuth();
  const { isDesktop } = useViewport();

  const [f, setF] = useState({
    title: "",
    method: method?.id ?? "",
    dose: "",
    water: "",
    temp: "",
    notes: "",
  });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const valid = f.title.trim() && f.method;

  const submit = async () => {
    if (!user) return;
    setSubmitting(true);
    await supabase.from("recipe_submissions").insert({
      user_id: user.id,
      method:  f.method,
      title:   f.title,
      dose_g:  f.dose ? parseFloat(f.dose) : null,
      water_g: f.water ? parseFloat(f.water) : null,
      temp_c:  f.temp ? parseInt(f.temp, 10) : null,
      notes:   f.notes || null,
    });
    setSubmitting(false);
    setSent(true);
    setTimeout(() => navigate(-1), 1200);
  };

  return (
    <div>
      <Header title="Submit Recipe" onBack={() => navigate(-1)} />
      <div style={{ padding: "26px 22px", maxWidth: isDesktop ? 720 : "none", margin: "0 auto" }}>
        {sent ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <Award size={36} color={T.accent} />
            <div style={{ fontSize: 20, marginTop: 16 }}>Submitted</div>
            <div style={{ fontSize: 12, color: T.creamDim, marginTop: 6 }}>The community will love this.</div>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 28, fontWeight: 200, marginBottom: 6, letterSpacing: "-0.02em" }}>Share your recipe</div>
            <div style={{ fontSize: 12, color: T.creamDim, marginBottom: 26 }}>
              {method?.name ? `For ${method.name}` : "Pick a method below"}
            </div>

            {!method && (
              <div style={{ marginBottom: 22 }}>
                <div style={{ fontSize: 10, letterSpacing: "0.2em", color: T.creamDim, marginBottom: 10 }}>BREWING METHOD</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                  {METHODS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setF({ ...f, method: m.id })}
                      style={{
                        padding: "12px 8px",
                        background: f.method === m.id ? T.cream : T.bg2,
                        color: f.method === m.id ? T.bg : T.cream,
                        border: `1px solid ${f.method === m.id ? T.cream : T.line}`,
                        borderRadius: 12,
                        fontSize: 11,
                        fontFamily: FONT,
                        cursor: "pointer",
                      }}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: "grid", gap: 14, gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr" }}>
              {(
                [
                  ["Recipe title", "title", true],
                  ["Dose (g)", "dose", false],
                  ["Water (g)", "water", false],
                  ["Temp (°C)", "temp", false],
                  ["Notes & method", "notes", true],
                ] as [string, keyof typeof f, boolean][]
              ).map(([label, key, full]) => (
                <div key={key} style={{ gridColumn: full && isDesktop ? "span 2" : "auto" }}>
                  <div style={{ fontSize: 10, letterSpacing: "0.2em", color: T.creamDim, marginBottom: 6 }}>
                    {label.toUpperCase()}
                  </div>
                  {key === "notes" ? (
                    <textarea
                      value={f[key]}
                      onChange={(e) => setF({ ...f, [key]: e.target.value })}
                      style={{ ...inputStyle, minHeight: 120, resize: "none" }}
                    />
                  ) : (
                    <input
                      value={f[key]}
                      onChange={(e) => setF({ ...f, [key]: e.target.value })}
                      style={inputStyle}
                    />
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => void submit()}
              disabled={!valid || submitting}
              style={{ ...primaryBtn, width: "100%", marginTop: 26, opacity: valid ? 1 : 0.4 }}
            >
              {submitting ? "Submitting…" : "Submit"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// Suppress FONT unused
void FONT;
