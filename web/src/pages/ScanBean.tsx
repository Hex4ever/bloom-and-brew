import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Check } from "lucide-react";
import { T } from "../styles/theme";
import { primaryBtn, inputStyle } from "../components/ui";
import { Header } from "../components/Header";
import { useAppContext } from "../AppContext";

interface DraftFields { name: string; roaster: string; roast: string; notes: string; date: string; }

const FIELDS: [string, keyof DraftFields][] = [
  ["Bean", "name"],
  ["Roaster", "roaster"],
  ["Roast", "roast"],
  ["Tasting notes", "notes"],
];

export function ScanBean() {
  const navigate = useNavigate();
  const { addBean, setBean } = useAppContext();

  const [scanning, setScanning] = useState(false);
  const [done, setDone] = useState(false);
  const [draft, setDraft] = useState<DraftFields>({
    name: "",
    roaster: "",
    roast: "Medium",
    notes: "",
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setScanning(true);
    setTimeout(() => {
      setDraft({
        name: "Sidamo Natural",
        roaster: "Subko Coffee",
        roast: "Light-Medium",
        notes: "Strawberry, cocoa, rose",
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      });
      setScanning(false);
      setDone(true);
    }, 2200);
  };

  const save = async () => {
    const saved = await addBean({ source: "scan", ...draft });
    setBean(saved);
    navigate(-1);
  };

  return (
    <div>
      <Header title="Scan Beans" onBack={() => navigate(-1)} />
      <div style={{ padding: "30px 22px", maxWidth: 600, margin: "0 auto" }}>
        {!done && (
          <div
            style={{
              border: `1px solid ${T.line}`,
              borderRadius: 20,
              padding: "60px 24px",
              textAlign: "center",
              background: T.bg2,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {scanning && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  background: T.accent,
                  animation: "drip 1.5s linear infinite",
                }}
              />
            )}
            <div
              style={{
                width: 90,
                height: 90,
                margin: "0 auto 24px",
                borderRadius: "50%",
                border: `1px solid ${T.line}`,
                display: "grid",
                placeItems: "center",
                position: "relative",
              }}
            >
              {scanning && (
                <div
                  style={{
                    position: "absolute",
                    inset: -4,
                    borderRadius: "50%",
                    border: `2px solid ${T.accent}`,
                    animation: "pulse-ring 1.5s ease-out infinite",
                  }}
                />
              )}
              <Camera size={28} color={T.accent} />
            </div>
            <div style={{ fontSize: 18, marginBottom: 6 }}>
              {scanning ? "Reading label..." : "Capture the bag"}
            </div>
            <div style={{ fontSize: 12, color: T.creamDim, marginBottom: 24 }}>
              {scanning
                ? "Extracting roaster, origin, roast date"
                : "Point at the front label"}
            </div>
            {!scanning && (
              <>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  onChange={onPick}
                  style={{ display: "none" }}
                />
                <button onClick={() => inputRef.current?.click()} style={primaryBtn}>
                  Open camera
                </button>
              </>
            )}
          </div>
        )}

        {done && (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: T.accent,
                marginBottom: 18,
              }}
            >
              <Check size={16} />
              <span style={{ fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                Detected
              </span>
            </div>

            <div style={{ display: "grid", gap: 14 }}>
              {FIELDS.map(([label, key]) => (
                <div key={key}>
                  <div
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.2em",
                      color: T.creamDim,
                      marginBottom: 6,
                    }}
                  >
                    {label.toUpperCase()}
                  </div>
                  <input
                    value={draft[key]}
                    onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              ))}
            </div>

            <button
              onClick={() => void save()}
              style={{ ...primaryBtn, width: "100%", marginTop: 26 }}
            >
              Save bean
            </button>
          </>
        )}
      </div>
    </div>
  );
}
