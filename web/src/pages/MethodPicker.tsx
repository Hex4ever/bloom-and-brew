import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { T } from "../styles/theme";
import { useViewport } from "../components/ui";
import { Header } from "../components/Header";
import { useAppContext } from "../AppContext";
import { METHODS } from "../data";
import type { BrewingMethodCategory } from "../types";

const CATEGORY_LABELS: Record<BrewingMethodCategory, string> = {
  filter:    "Filter",
  pressure:  "Pressure",
  immersion: "Immersion",
  milk:      "Milk drinks",
};

export function MethodPicker() {
  const navigate = useNavigate();
  const { setMethod } = useAppContext();
  const { isDesktop } = useViewport();

  const grouped = useMemo(() => {
    const g: Partial<Record<BrewingMethodCategory, typeof METHODS>> = {};
    for (const m of METHODS) {
      if (!g[m.category]) g[m.category] = [];
      g[m.category]!.push(m);
    }
    return g;
  }, []);

  const categoryOrder: BrewingMethodCategory[] = ["filter", "pressure", "immersion", "milk"];

  return (
    <div>
      <Header title="Brewing Method" onBack={() => navigate(-1)} />
      <div style={{ padding: "30px 22px 20px", maxWidth: isDesktop ? 900 : "none", margin: "0 auto" }}>
        <div style={{ fontSize: 30, fontWeight: 200, marginBottom: 6, letterSpacing: "-0.02em" }}>Choose a method</div>
        <div style={{ fontSize: 13, color: T.creamDim, marginBottom: 30 }}>Nine paths. One perfect cup.</div>

        {categoryOrder.map((cat) => {
          const methods = grouped[cat];
          if (!methods?.length) return null;
          return (
            <div key={cat} style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 10, letterSpacing: "0.25em", color: T.creamDim, marginBottom: 12 }}>
                {CATEGORY_LABELS[cat].toUpperCase()}
              </div>
              <div style={{ display: "grid", gap: 12, gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr" }}>
                {methods.map((m, i) => (
                  <button
                    key={m.id}
                    onClick={() => { setMethod(m); navigate("/recipes"); }}
                    className="fade-up"
                    style={{
                      display: "flex", alignItems: "center", gap: 18,
                      padding: "20px 22px", background: T.bg2,
                      border: `1px solid ${T.line}`, borderRadius: 16,
                      color: T.cream, textAlign: "left",
                      animationDelay: `${i * 50}ms`,
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ width: 50, height: 50, borderRadius: 12, background: T.bg3, display: "grid", placeItems: "center", fontSize: 24, color: T.accent }}>
                      {m.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 16, fontWeight: 400, marginBottom: 4 }}>{m.name}</div>
                      <div style={{ fontSize: 11, color: T.creamDim, display: "flex", gap: 12 }}>
                        <span>{m.time}</span><span>·</span><span>{m.ratio}</span><span>·</span><span>{m.difficulty}</span>
                      </div>
                    </div>
                    <ChevronRight size={16} color={T.creamDim} />
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
