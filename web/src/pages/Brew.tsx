import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Scale, Droplet, Flame, Disc3, Coffee, Minus, Plus, Music, Sparkles, Check } from "lucide-react";
import { T, FONT } from "../styles/theme";
import { useViewport, primaryBtn, ghostBtn } from "../components/ui";
import { Header } from "../components/Header";
import { Pill } from "../components/Pill";
import { BrewScene, BrewTimer, PulseDot, fmtTime, PrepChecklist } from "../components";
import { useAppContext } from "../AppContext";
import { scaleRecipe } from "../lib/recipeScaling";
import { computeGrindClicks } from "../lib/grinderMath";

// ─── Local sub-components ─────────────────────────────────────────────────────

function PrepCard({ icon, label, v, sub }: { icon: React.ReactNode; label: string; v: string; sub?: string }) {
  return (
    <div style={{ background: T.bg2, border: `1px solid ${T.line}`, borderRadius: 14, padding: 16 }}>
      <div style={{ color: T.accent, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 10, letterSpacing: "0.2em", color: T.creamDim }}>{label.toUpperCase()}</div>
      <div style={{ fontSize: 22, fontWeight: 300, marginTop: 4 }}>{v}</div>
      {sub && <div style={{ fontSize: 10, color: T.creamDim, marginTop: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sub}</div>}
    </div>
  );
}

function JazzWidget() {
  return (
    <div style={{ padding: "0 22px 20px" }}>
      <div style={{ background: T.bg2, border: `1px solid ${T.line}`, borderRadius: 14, padding: 14, display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 42, height: 42, borderRadius: "50%", background: `radial-gradient(circle, ${T.brownDeep}, ${T.bg})`, border: `1px solid ${T.line}`, animation: "spin-slow 4s linear infinite", display: "grid", placeItems: "center" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.cream }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13 }}>Smooth Brew Sessions</div>
          <div style={{ fontSize: 10, color: T.creamDim, letterSpacing: "0.1em" }}>FUNKY JAZZ · 3:42</div>
        </div>
        <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 24 }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ width: 3, background: T.accent, borderRadius: 2, animation: `bar 0.${6 + i}s ease-in-out infinite alternate` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── DoneScreen ───────────────────────────────────────────────────────────────

interface DoneScreenProps {
  scaledDose: number;
  scaledWater: number;
  scaledTemp: number;
  clicks: number;
  onReset: () => void;
}

function DoneScreen({ scaledDose, scaledWater, scaledTemp, clicks, onReset }: DoneScreenProps) {
  const navigate = useNavigate();
  const { recipe, method, bean, grinder, brewLog, setBrewLog, setPendingBrew } = useAppContext();
  const [overall, setOverall] = useState(7);
  const [saved, setSaved] = useState(false);

  if (!recipe || !method) return null;

  const quickSave = () => {
    const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
    setBrewLog([{
      id: Date.now().toString(),
      recipeId: recipe.id, recipeTitle: recipe.title, method: method.id,
      bean: bean?.name ?? "Unknown", grinder: grinder?.name ?? "Unknown",
      date: today,
      dose: scaledDose, water: scaledWater, temp: scaledTemp, clicks,
      scores: { sweetness: 5, acidity: 5, body: 5, bitterness: 5, aftertaste: 5, overall },
      notes: "",
      quickLogged: true,
    }, ...brewLog]);
    setSaved(true);
  };

  const detailedLog = () => {
    setPendingBrew({
      recipeId: recipe.id, recipeTitle: recipe.title, method: method.id,
      bean: bean?.name ?? "Unknown", grinder: grinder?.name ?? "Unknown",
      dose: scaledDose, water: scaledWater, temp: scaledTemp, clicks,
    });
    navigate("/rating");
  };

  if (saved) {
    return (
      <div style={{ padding: "20px 22px 30px", textAlign: "center" }}>
        <Check size={28} color={T.accent} />
        <div style={{ fontSize: 18, fontWeight: 200, marginBottom: 6, marginTop: 12 }}>Saved to your profile</div>
        <div style={{ fontSize: 12, color: T.creamDim, marginBottom: 22 }}>View it anytime in your Brew Journal.</div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => navigate("/journal")} style={{ ...ghostBtn, flex: 1 }}>View journal</button>
          <button onClick={onReset} style={{ ...primaryBtn, flex: 1 }}>Done</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "10px 22px 30px" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <Sparkles size={28} color={T.accent} />
        <div style={{ fontSize: 24, fontWeight: 200, marginBottom: 6, marginTop: 10 }}>Your cup is ready</div>
        <div style={{ fontSize: 12, color: T.creamDim }}>How was it?</div>
      </div>
      <div style={{ background: T.bg2, border: `1px solid ${T.line}`, borderRadius: 16, padding: 22, marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: "0.2em", color: T.creamDim, marginBottom: 4 }}>OVERALL RATING</div>
            <div style={{ fontSize: 12, color: T.creamDim }}>Quick score — 1 tap</div>
          </div>
          <div style={{ fontSize: 32, fontWeight: 200, color: T.accent }}>{overall}<span style={{ color: T.creamDim, fontSize: 16 }}>/10</span></div>
        </div>
        <input type="range" min="1" max="10" value={overall} onChange={(e) => setOverall(+e.target.value)}
          style={{ width: "100%", accentColor: T.accent }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: T.creamDim, marginTop: 4, letterSpacing: "0.15em" }}>
          <span>UNDRINKABLE</span><span>PERFECT</span>
        </div>
      </div>
      <div style={{ display: "grid", gap: 10 }}>
        <button onClick={quickSave} style={{ ...primaryBtn, width: "100%" }}>Save to profile</button>
        <button onClick={detailedLog} style={{ ...ghostBtn, width: "100%" }}>Rate in detail (5 axes + notes)</button>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => navigate("/community")} style={{ flex: 1, background: "transparent", border: "none", color: T.creamDim, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", padding: 12, cursor: "pointer", fontFamily: FONT }}>Share</button>
          <button onClick={onReset} style={{ flex: 1, background: "transparent", border: "none", color: T.creamDim, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", padding: 12, cursor: "pointer", fontFamily: FONT }}>Skip</button>
        </div>
      </div>
    </div>
  );
}

// ─── Brew page ────────────────────────────────────────────────────────────────

type Phase = "pre" | "brewing" | "done";

export function Brew() {
  const navigate = useNavigate();
  const { recipe, method, bean, grinder } = useAppContext();
  const { isDesktop } = useViewport();

  const [phase, setPhase] = useState<Phase>("pre");
  const [cups, setCups] = useState(1);
  const [elapsed, setElapsed] = useState(0);
  const [music, setMusic] = useState(false);

  useEffect(() => {
    if (!recipe || !method) navigate("/methods", { replace: true });
  }, [recipe, method, navigate]);

  // Scaling
  const { params, steps, totalTime } = useMemo(() => {
    if (!recipe) return { params: { dose: 0, water: 0, temp: 0, microns: 0 }, steps: [], totalTime: 210 };
    return scaleRecipe(recipe, cups);
  }, [recipe, cups]);

  // Grind clicks
  const { display: clicksDisplay } = useMemo(() => {
    if (!grinder || !params.microns) return { display: "—", clicks: 0, supportsHalf: false };
    return computeGrindClicks(grinder, params.microns);
  }, [grinder, params.microns]);

  const clicksNum = useMemo(() => {
    if (!grinder || !params.microns) return 0;
    return computeGrindClicks(grinder, params.microns).clicks;
  }, [grinder, params.microns]);

  // Timer
  useEffect(() => {
    if (phase !== "brewing") return;
    const id = setInterval(() => {
      setElapsed((x) => {
        if (x + 1 >= totalTime) { clearInterval(id); setPhase("done"); return totalTime; }
        return x + 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase, totalTime]);

  const currentIdx = steps.reduce((acc, s, i) => (elapsed >= s.t ? i : acc), 0);
  const current = steps[currentIdx];
  const next = steps[currentIdx + 1];

  const resetBrew = () => { setElapsed(0); setPhase("pre"); };

  if (!recipe || !method) return null;

  // ── Pre phase ──────────────────────────────────────────────────────────────
  if (phase === "pre") {
    return (
      <div>
        <Header title="Get Ready" onBack={() => navigate(-1)} />
        <div style={{ padding: "30px 22px", maxWidth: isDesktop ? 700 : "none", margin: "0 auto" }}>
          <div style={{ fontSize: 28, fontWeight: 200, marginBottom: 6, letterSpacing: "-0.02em" }}>{recipe.title}</div>
          <div style={{ fontSize: 12, color: T.creamDim, marginBottom: 22 }}>{recipe.author}</div>

          {/* Servings scroller */}
          <div style={{ background: T.bg2, border: `1px solid ${T.line}`, borderRadius: 16, padding: "18px 22px", marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.2em", color: T.creamDim, marginBottom: 4 }}>SERVINGS</div>
              <div style={{ fontSize: 22, fontWeight: 300 }}>{cups} cup{cups > 1 ? "s" : ""}</div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button onClick={() => setCups(Math.max(0.5, +(cups - 0.5).toFixed(1)))} style={{ width: 38, height: 38, borderRadius: 999, border: `1px solid ${T.line}`, background: T.bg3, color: T.cream, display: "grid", placeItems: "center", cursor: "pointer" }}><Minus size={14} color={T.cream} /></button>
              <button onClick={() => setCups(Math.min(8, +(cups + 0.5).toFixed(1)))} style={{ width: 38, height: 38, borderRadius: 999, border: `1px solid ${T.line}`, background: T.bg3, color: T.cream, display: "grid", placeItems: "center", cursor: "pointer" }}><Plus size={14} color={T.cream} /></button>
            </div>
          </div>

          {/* Prep cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <PrepCard icon={<Scale size={16} />}  label="Dose"  v={`${params.dose} g`}  sub={bean?.name} />
            <PrepCard icon={<Droplet size={16} />} label="Water" v={`${params.water} g`} sub={`Ratio 1:${Math.round(params.water / params.dose)}`} />
            <PrepCard icon={<Flame size={16} />}   label="Temp"  v={`${params.temp}°C`}  sub="Heat kettle now" />
            <PrepCard icon={<Disc3 size={16} />}   label="Grind" v={clicksDisplay}        sub={grinder?.name} />
            {recipe.hasMilk && params.milk != null && (
              <PrepCard icon={<Coffee size={16} />} label="Milk" v={`${params.milk} g`} sub="Steamed, ~60°C" />
            )}
          </div>

          {/* Schedule */}
          <div style={{ background: T.bg2, border: `1px solid ${T.line}`, borderRadius: 14, padding: 18, marginTop: 18, marginBottom: 18 }}>
            <div style={{ fontSize: 10, letterSpacing: "0.2em", color: T.creamDim, marginBottom: 12 }}>SCHEDULE</div>
            {steps.map((s, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < steps.length - 1 ? `1px solid ${T.line}` : "none" }}>
                <span style={{ fontSize: 13 }}>{s.label}</span>
                <span style={{ fontSize: 12, color: T.creamDim }}>{fmtTime(s.t)}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, marginTop: 6, borderTop: `1px solid ${T.line}`, fontSize: 11, color: T.accent }}>
              <span>Total</span><span>{fmtTime(totalTime)}</span>
            </div>
          </div>

          <PrepChecklist methodId={method.id} />

          <button onClick={() => setPhase("brewing")} style={{ ...primaryBtn, width: "100%", marginTop: 8 }}>
            Start brewing
          </button>
        </div>
      </div>
    );
  }

  // ── Brewing + done phases ──────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: `radial-gradient(ellipse at top, ${T.bg2}, ${T.bg})` }}>
      <Header
        title="Brewing"
        onBack={() => { resetBrew(); }}
        right={
          <button onClick={() => setMusic(!music)} style={{
            width: 34, height: 34, border: `1px solid ${music ? T.accent : T.line}`,
            background: music ? T.accent : "transparent", borderRadius: 999,
            display: "grid", placeItems: "center", cursor: "pointer",
          }}>
            <Music size={14} color={music ? T.bg : T.cream} />
          </button>
        }
      />
      <div style={{ maxWidth: isDesktop ? 700 : "none", margin: "0 auto" }}>
        {/* Scene */}
        <div style={{ padding: "30px 22px 10px", position: "relative" }}>
          <BrewScene method={method.id} phase={phase} stepLabel={current?.label} progress={Math.min(elapsed / totalTime, 1)} hasMilk={recipe.hasMilk} />
        </div>

        {/* Timer */}
        <BrewTimer elapsed={elapsed} total={totalTime} nextStep={next} brewing={phase === "brewing"} />

        {/* Current step */}
        <div style={{ padding: "10px 22px 20px" }}>
          <div style={{ background: T.bg2, border: `1px solid ${T.line}`, borderRadius: 18, padding: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <Pill>STEP {currentIdx + 1} / {steps.length}</Pill>
              {phase === "brewing" && <PulseDot />}
            </div>
            <div style={{ fontSize: 26, fontWeight: 300, letterSpacing: "-0.01em" }}>{current?.label}</div>
            <div style={{ fontSize: 14, color: T.creamDim, marginTop: 6 }}>{current?.desc}</div>
          </div>
        </div>

        {music && <JazzWidget />}

        {phase === "done" && (
          <DoneScreen
            scaledDose={params.dose}
            scaledWater={params.water}
            scaledTemp={params.temp}
            clicks={clicksNum}
            onReset={() => { resetBrew(); navigate(-1); }}
          />
        )}
      </div>
    </div>
  );
}
