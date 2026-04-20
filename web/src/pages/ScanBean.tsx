import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, PenLine } from "lucide-react";
import { T } from "../styles/theme";
import { primaryBtn, ghostBtn, inputStyle } from "../components/ui";
import { Header } from "../components/Header";
import { useAppContext } from "../AppContext";
import { useAuth } from "../AuthContext";

interface DraftFields { name: string; roaster: string; origin: string; roast: string; notes: string; }

const EMPTY_DRAFT: DraftFields = { name: "", roaster: "", origin: "", roast: "Medium", notes: "" };

const FIELDS: [string, keyof DraftFields, string][] = [
  ["Bean name",      "name",    "e.g. Attikan Estate"],
  ["Roaster",        "roaster", "e.g. Blue Tokai"],
  ["Origin",         "origin",  "e.g. Coorg, India"],
  ["Roast level",    "roast",   "Light / Medium / Dark"],
  ["Tasting notes",  "notes",   "e.g. Blackcurrant, caramel, cedar"],
];

type Mode = "pick" | "scanning" | "form";

export function ScanBean() {
  const navigate = useNavigate();
  const { addBean, setBean } = useAppContext();
  const { session } = useAuth();

  const [mode, setMode] = useState<Mode>("pick");
  const [draft, setDraft] = useState<DraftFields>(EMPTY_DRAFT);
  const [scanError, setScanError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const openManual = () => {
    setDraft(EMPTY_DRAFT);
    setScanError(null);
    setMode("form");
  };

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanError(null);
    setMode("scanning");

    try {
      const base64 = await fileToBase64(file);
      const mediaType = file.type || "image/jpeg";

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/scan-bean`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session!.access_token}`,
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
          },
          body: JSON.stringify({ image: base64, mediaType }),
        },
      );

      const data = await res.json() as { name?: string; roaster?: string; origin?: string; roast?: string; notes?: string; error?: string };

      if (!res.ok || data.error) {
        setScanError(data.error ?? "Scan failed — fill in the details below");
        setDraft(EMPTY_DRAFT);
      } else {
        setDraft({
          name:    data.name    ?? "",
          roaster: data.roaster ?? "",
          origin:  data.origin  ?? "",
          roast:   data.roast   ?? "Medium",
          notes:   data.notes   ?? "",
        });
      }
    } catch {
      setScanError("Network error — fill in the details below");
      setDraft(EMPTY_DRAFT);
    }

    setMode("form");
    // Reset file input so the same file can be re-picked
    if (inputRef.current) inputRef.current.value = "";
  };

  const save = async () => {
    setSaving(true);
    const saved = await addBean({ source: "scan", ...draft });
    setBean(saved);
    navigate(-1);
  };

  return (
    <div>
      <Header title="Add Beans" onBack={() => navigate(-1)} />
      <div style={{ padding: "30px 22px", maxWidth: 600, margin: "0 auto" }}>

        {/* ── Pick mode ────────────────────────────────────────────────────── */}
        {mode === "pick" && (
          <div style={{ display: "grid", gap: 14 }}>
            {/* Scan option */}
            <button
              onClick={() => inputRef.current?.click()}
              style={{ background: T.bg2, border: `1px solid ${T.line}`, borderRadius: 20, padding: "32px 24px", textAlign: "center", cursor: "pointer", width: "100%" }}
            >
              <div style={{ width: 64, height: 64, margin: "0 auto 16px", borderRadius: "50%", border: `1px solid ${T.line}`, display: "grid", placeItems: "center" }}>
                <Camera size={24} color={T.accent} />
              </div>
              <div style={{ fontSize: 16, color: T.cream, marginBottom: 6 }}>Scan the bag</div>
              <div style={{ fontSize: 12, color: T.creamDim }}>
                Point your camera at the label — AI reads the details
              </div>
            </button>

            {/* Manual option */}
            <button
              onClick={openManual}
              style={{ background: T.bg2, border: `1px solid ${T.line}`, borderRadius: 20, padding: "32px 24px", textAlign: "center", cursor: "pointer", width: "100%" }}
            >
              <div style={{ width: 64, height: 64, margin: "0 auto 16px", borderRadius: "50%", border: `1px solid ${T.line}`, display: "grid", placeItems: "center" }}>
                <PenLine size={24} color={T.accent} />
              </div>
              <div style={{ fontSize: 16, color: T.cream, marginBottom: 6 }}>Enter manually</div>
              <div style={{ fontSize: 12, color: T.creamDim }}>
                Type in the bean name, roaster, and tasting notes
              </div>
            </button>

            <input ref={inputRef} type="file" accept="image/*" onChange={(e) => void onPick(e)} style={{ display: "none" }} />
          </div>
        )}

        {/* ── Scanning mode ────────────────────────────────────────────────── */}
        {mode === "scanning" && (
          <div style={{ border: `1px solid ${T.line}`, borderRadius: 20, padding: "60px 24px", textAlign: "center", background: T.bg2, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: T.accent, animation: "drip 1.5s linear infinite" }} />
            <div style={{ width: 90, height: 90, margin: "0 auto 24px", borderRadius: "50%", border: `1px solid ${T.line}`, display: "grid", placeItems: "center", position: "relative" }}>
              <div style={{ position: "absolute", inset: -4, borderRadius: "50%", border: `2px solid ${T.accent}`, animation: "pulse-ring 1.5s ease-out infinite" }} />
              <Camera size={28} color={T.accent} />
            </div>
            <div style={{ fontSize: 18, marginBottom: 6 }}>Reading label…</div>
            <div style={{ fontSize: 12, color: T.creamDim }}>Extracting roaster, origin, roast level, tasting notes</div>
          </div>
        )}

        {/* ── Form mode ────────────────────────────────────────────────────── */}
        {mode === "form" && (
          <>
            {scanError ? (
              <div style={{ background: "#3a1a1a", border: "1px solid #7a3333", borderRadius: 10, padding: "12px 16px", marginBottom: 18, fontSize: 12, color: "#f4a0a0" }}>
                {scanError}
              </div>
            ) : (
              <div style={{ fontSize: 12, color: T.accent, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 18 }}>
                ✓ Details extracted — review and save
              </div>
            )}

            <div style={{ display: "grid", gap: 14 }}>
              {FIELDS.map(([label, key, placeholder]) => (
                <div key={key}>
                  <div style={{ fontSize: 10, letterSpacing: "0.2em", color: T.creamDim, marginBottom: 6 }}>
                    {label.toUpperCase()}
                  </div>
                  <input
                    value={draft[key]}
                    onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                    placeholder={placeholder}
                    style={inputStyle}
                  />
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 26 }}>
              <button onClick={() => setMode("pick")} style={{ ...ghostBtn, flex: 1 }}>
                Back
              </button>
              <button
                onClick={() => void save()}
                disabled={saving || !draft.name.trim()}
                style={{ ...primaryBtn, flex: 2, opacity: saving || !draft.name.trim() ? 0.5 : 1 }}
              >
                {saving ? "Saving…" : "Save bean"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip the data URL prefix (e.g. "data:image/jpeg;base64,")
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
