import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lightbulb } from "lucide-react";
import { T } from "../styles/theme";
import { useViewport, inputStyle } from "../components/ui";
import { Header } from "../components/Header";
import { GLOSSARY, TIPS } from "../data";

const randomTip = TIPS[Math.floor(Math.random() * TIPS.length)];

export function Glossary() {
  const navigate = useNavigate();
  const { isDesktop } = useViewport();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() =>
    GLOSSARY.filter((g) =>
      g.term.toLowerCase().includes(search.toLowerCase()) ||
      g.def.toLowerCase().includes(search.toLowerCase()),
    ),
  [search]);

  const tip = randomTip;

  return (
    <div>
      <Header title="Glossary" onBack={() => navigate(-1)} />
      <div style={{ padding: "26px 22px", maxWidth: isDesktop ? 900 : "none", margin: "0 auto" }}>
        <div style={{ fontSize: 28, fontWeight: 200, marginBottom: 6, letterSpacing: "-0.02em" }}>Coffee dictionary</div>
        <div style={{ fontSize: 12, color: T.creamDim, marginBottom: 22 }}>The terms baristas throw around, demystified.</div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search terms..."
          style={{ ...inputStyle, marginBottom: 22 }}
        />

        <div style={{ display: "grid", gap: 12, gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr" }}>
          {filtered.map((g, i) => (
            <div key={g.term} className="fade-up" style={{ background: T.bg2, border: `1px solid ${T.line}`, borderRadius: 14, padding: 18, animationDelay: `${i * 30}ms` }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 8 }}>
                <div style={{ fontSize: 16, color: T.cream }}>{g.term}</div>
                <div style={{ flex: 1, height: 1, background: T.line }} />
              </div>
              <div style={{ fontSize: 13, color: T.creamDim, lineHeight: 1.55 }}>{g.def}</div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 60, color: T.creamDim, fontSize: 13 }}>
            No matches. Try another term.
          </div>
        )}

        <div style={{ marginTop: 30, padding: 22, background: T.bg2, border: `1px solid ${T.line}`, borderRadius: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Lightbulb size={14} color={T.accent} />
            <div style={{ fontSize: 10, letterSpacing: "0.25em", color: T.creamDim }}>QUICK TIP</div>
          </div>
          <div style={{ fontSize: 13, color: T.cream, lineHeight: 1.55 }}>{tip}</div>
        </div>
      </div>
    </div>
  );
}
