import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ExternalLink } from "lucide-react";
import { T, FONT } from "../styles/theme";
import { useViewport } from "../components/ui";
import { Header } from "../components/Header";
import { Pill } from "../components/Pill";
import { INDIAN_BEANS } from "../data";

export function Discover() {
  const navigate = useNavigate();
  const { isDesktop } = useViewport();
  const [filter, setFilter] = useState<"all" | "online" | "offline">("all");

  const filtered = INDIAN_BEANS.filter((b) => {
    if (filter === "all") return true;
    if (filter === "online") return b.availability.includes("Online");
    return (
      b.availability.includes("Cafes") ||
      b.availability.includes("Bangalore") ||
      b.availability.includes("Mumbai") ||
      b.availability.includes("Delhi") ||
      b.availability.includes("Pop-ups")
    );
  });

  return (
    <div>
      <Header title="Discover Beans" onBack={() => navigate(-1)} />
      <div style={{ padding: "26px 22px", maxWidth: isDesktop ? 1000 : "none", margin: "0 auto" }}>
        <div style={{ fontSize: 28, fontWeight: 200, marginBottom: 6, letterSpacing: "-0.02em" }}>Indian specialty beans</div>
        <div style={{ fontSize: 12, color: T.creamDim, marginBottom: 22 }}>Curated picks from roasters worth knowing.</div>

        {/* Filter tabs */}
        <div className="scrollx" style={{ display: "flex", gap: 8, marginBottom: 22, overflowX: "auto" }}>
          {(["all", "online", "offline"] as const).map((v) => {
            const label = v === "all" ? "All" : v === "online" ? "Online" : "In stores";
            return (
              <button key={v} onClick={() => setFilter(v)} style={{
                padding: "8px 16px", borderRadius: 999,
                background: filter === v ? T.cream : T.bg2,
                color: filter === v ? T.bg : T.cream,
                border: `1px solid ${filter === v ? T.cream : T.line}`,
                fontSize: 12, fontFamily: FONT, whiteSpace: "nowrap", cursor: "pointer",
              }}>{label}</button>
            );
          })}
        </div>

        <div style={{ display: "grid", gap: 14, gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr" }}>
          {filtered.map((b, i) => (
            <div key={b.name} className="fade-up" style={{ background: T.bg2, border: `1px solid ${T.line}`, borderRadius: 16, overflow: "hidden", animationDelay: `${i * 40}ms` }}>
              <div style={{ height: 6, background: `linear-gradient(90deg, ${T.accent}, ${T.brown}, ${T.espresso})` }} />
              <div style={{ padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                  <div style={{ fontSize: 16, color: T.cream }}>{b.name}</div>
                  <Pill dim>{b.price}</Pill>
                </div>
                <div style={{ fontSize: 11, color: T.creamDim, marginBottom: 14 }}>{b.roaster} · {b.origin}</div>
                <div style={{ fontSize: 12, color: T.cream, fontStyle: "italic", marginBottom: 14, lineHeight: 1.5 }}>"{b.notes}"</div>
                <div style={{ fontSize: 12, color: T.creamDim, lineHeight: 1.5, marginBottom: 14 }}>{b.desc}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: `1px solid ${T.line}` }}>
                  <div style={{ fontSize: 10, letterSpacing: "0.15em", color: T.creamDim, textTransform: "uppercase" }}>{b.availability}</div>
                  <button onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(b.roaster + " " + b.name + " coffee buy")}`, "_blank")}
                    style={{ background: "transparent", border: `1px solid ${T.line}`, color: T.cream, padding: "6px 14px", borderRadius: 999, fontSize: 11, fontFamily: FONT, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                    Find <ExternalLink size={11} color={T.cream} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Fun fact */}
        <div style={{ marginTop: 26, padding: 22, background: `linear-gradient(135deg, ${T.bg3}, ${T.bg2})`, border: `1px solid ${T.line}`, borderRadius: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Sparkles size={14} color={T.accent} />
            <div style={{ fontSize: 10, letterSpacing: "0.25em", color: T.creamDim }}>DID YOU KNOW</div>
          </div>
          <div style={{ fontSize: 13, color: T.cream, lineHeight: 1.55, fontStyle: "italic" }}>
            India is the world's 7th largest coffee producer — most of it grown under shade in the Western Ghats. Karnataka alone accounts for ~70% of national production.
          </div>
        </div>

      </div>
    </div>
  );
}
