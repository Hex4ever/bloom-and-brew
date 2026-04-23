import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Shuffle, ChevronRight, Plus, X, Users } from "lucide-react";
import { T, FONT } from "../styles/theme";
import { useViewport, primaryBtn, inputStyle } from "../components/ui";
import { Header } from "../components/Header";
import { Pill } from "../components/Pill";
import { useAppContext } from "../AppContext";
import { RECIPES, METHODS } from "../data";
import { flavorMatch, parseFlavorText } from "../lib/flavorMatch";
import { supabase } from "../lib/supabase";
import { formatWeight, formatTemp } from "../lib/units";
import type { MethodId } from "../types";

interface CommunityRecipe {
  id: string;
  title: string;
  method: string;
  dose_g: number | null;
  water_g: number | null;
  temp_c: number | null;
  notes: string | null;
}

const SUGGESTIONS = [
  "bright and fruity",
  "bold and chocolatey",
  "smooth with low acidity",
  "floral and delicate",
  "creamy and sweet",
];

export function RecipeList() {
  const navigate = useNavigate();
  const { method, bean, grinder, settings, setRecipe, setMethod } = useAppContext();
  const { isDesktop } = useViewport();

  const [flavorOpen, setFlavorOpen] = useState(false);
  const [flavorText, setFlavorText] = useState("");
  const [flavorResults, setFlavorResults] = useState<ReturnType<typeof flavorMatch> | null>(null);
  const [flavorMatched, setFlavorMatched] = useState<string[]>([]);
  const [communityRecipes, setCommunityRecipes] = useState<CommunityRecipe[]>([]);

  useEffect(() => {
    supabase
      .from("recipe_submissions")
      .select("id, title, method, dose_g, water_g, temp_c, notes")
      .eq("status", "approved")
      .then(({ data }) => { if (data) setCommunityRecipes(data); });
  }, []);

  useEffect(() => {
    if (!method) navigate("/methods", { replace: true });
  }, [method, navigate]);

  if (!method) return null;

  const list = (RECIPES as Record<string, typeof RECIPES[MethodId]>)[method.id] ?? [];

  const pickRandom = () => {
    if (!list.length) return;
    const r = list[Math.floor(Math.random() * list.length)];
    setRecipe(r); navigate("/brew");
  };

  const pickAuto = () => {
    if (!list.length) return;
    const sorted = [...list].sort((a, b) => b.rating - a.rating);
    setRecipe(sorted[0]); navigate("/brew");
  };

  const findByFlavor = () => {
    if (!flavorText.trim()) return;
    const parsed = parseFlavorText(flavorText);
    const results = flavorMatch(flavorText, RECIPES as Record<MethodId, typeof list>, method.id as MethodId);
    setFlavorResults(results);
    setFlavorMatched(parsed.matched);
  };

  return (
    <div>
      <Header
        title={`Top Recipes — ${method.name}`}
        onBack={() => navigate(-1)}
        right={
          <button onClick={() => navigate("/submit")} style={{
            width: 34, height: 34, border: `1px solid ${T.line}`,
            background: "transparent", borderRadius: 999,
            display: "grid", placeItems: "center", color: T.cream, cursor: "pointer",
          }}>
            <Plus size={16} color={T.cream} />
          </button>
        }
      />
      <div style={{ padding: "26px 22px", maxWidth: isDesktop ? 1000 : "none", margin: "0 auto" }}>
        <div style={{ fontSize: 11, color: T.creamDim, marginBottom: 20, letterSpacing: "0.1em" }}>
          {bean?.name} · {grinder?.name}
        </div>

        {/* Flavour Finder */}
        <div style={{
          background: `linear-gradient(135deg, ${T.bg3}, ${T.bg2})`,
          border: `1px solid ${flavorOpen ? T.accent : T.line}`,
          borderRadius: 16, padding: flavorOpen ? 22 : 18, marginBottom: 14,
          transition: "all 0.3s ease",
        }}>
          {!flavorOpen ? (
            <button onClick={() => setFlavorOpen(true)} style={{
              width: "100%", background: "none", border: "none", color: T.cream,
              display: "flex", alignItems: "center", gap: 14, textAlign: "left",
              padding: 0, cursor: "pointer",
            }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: T.bg3, border: `1px solid ${T.line}`, display: "grid", placeItems: "center", color: T.accent, flexShrink: 0 }}>
                <Sparkles size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, marginBottom: 3 }}>What flavour are you after?</div>
                <div style={{ fontSize: 11, color: T.creamDim }}>Describe it — we'll match a recipe</div>
              </div>
              <ChevronRight size={16} color={T.creamDim} />
            </button>
          ) : (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Sparkles size={14} color={T.accent} />
                  <div style={{ fontSize: 10, letterSpacing: "0.25em", color: T.creamDim }}>FLAVOUR FINDER</div>
                </div>
                <button onClick={() => { setFlavorOpen(false); setFlavorResults(null); setFlavorText(""); }}
                  style={{ background: "none", border: "none", color: T.creamDim, cursor: "pointer" }}>
                  <X size={16} color={T.creamDim} />
                </button>
              </div>
              <div style={{ fontSize: 17, fontWeight: 300, marginBottom: 14, color: T.cream, lineHeight: 1.4 }}>
                Describe your ideal cup
              </div>
              <textarea
                value={flavorText}
                onChange={(e) => setFlavorText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); findByFlavor(); } }}
                placeholder="e.g. bright, fruity, with berry notes and low bitterness"
                style={{ ...inputStyle, minHeight: 70, resize: "none", marginBottom: 12 }}
              />
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => setFlavorText(s)} style={{
                    padding: "6px 12px", background: T.bg3, border: `1px solid ${T.line}`,
                    borderRadius: 999, color: T.creamDim, fontSize: 11, fontFamily: FONT, cursor: "pointer",
                  }}>{s}</button>
                ))}
              </div>
              <button onClick={findByFlavor} disabled={!flavorText.trim()} style={{ ...primaryBtn, width: "100%", opacity: flavorText.trim() ? 1 : 0.4 }}>
                Find matching recipes
              </button>

              {flavorResults && (
                <div style={{ marginTop: 20, paddingTop: 20, borderTop: `1px solid ${T.line}` }}>
                  {flavorMatched.length > 0 ? (
                    <>
                      <div style={{ fontSize: 10, letterSpacing: "0.2em", color: T.creamDim, marginBottom: 8 }}>READING</div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                        {flavorMatched.map((m) => <Pill key={m}>{m}</Pill>)}
                      </div>
                    </>
                  ) : (
                    <div style={{ fontSize: 12, color: T.creamDim, marginBottom: 14, fontStyle: "italic" }}>
                      Couldn't pick out specific flavour words. Showing our best guesses.
                    </div>
                  )}
                  <div style={{ fontSize: 10, letterSpacing: "0.2em", color: T.creamDim, marginBottom: 10 }}>BEST MATCHES</div>
                  <div style={{ display: "grid", gap: 10 }}>
                    {flavorResults.map((match, i) => {
                      const r = match.recipe;
                      const m = METHODS.find((x) => x.id === match.methodId);
                      if (!m) return null;
                      return (
                        <button key={r.id} onClick={() => { setMethod(m); setRecipe(r); navigate("/brew"); }}
                          style={{ padding: "14px 16px", background: T.bg2, border: `1px solid ${i === 0 ? T.accent : T.line}`, borderRadius: 12, color: T.cream, textAlign: "left", display: "flex", gap: 12, alignItems: "center", cursor: "pointer" }}>
                          <div style={{ width: 30, height: 30, borderRadius: 8, background: T.bg3, display: "grid", placeItems: "center", fontSize: 11, color: T.accent, flexShrink: 0 }}>0{i + 1}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13 }}>{r.title}</div>
                            <div style={{ fontSize: 10, color: T.creamDim, marginTop: 2 }}>{m.name} · {r.author}</div>
                          </div>
                          {i === 0 && <Pill>Best</Pill>}
                          <ChevronRight size={14} color={T.creamDim} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick pick buttons */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 22 }}>
          <button onClick={pickRandom} style={{ padding: "16px 18px", background: T.bg2, border: `1px solid ${T.line}`, borderRadius: 14, color: T.cream, display: "flex", alignItems: "center", gap: 12, textAlign: "left", cursor: "pointer" }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: T.bg3, display: "grid", placeItems: "center", color: T.accent, flexShrink: 0 }}><Shuffle size={15} /></div>
            <div>
              <div style={{ fontSize: 13 }}>Surprise me</div>
              <div style={{ fontSize: 10, color: T.creamDim, marginTop: 2 }}>Random recipe</div>
            </div>
          </button>
          <button onClick={pickAuto} style={{ padding: "16px 18px", background: T.bg2, border: `1px solid ${T.line}`, borderRadius: 14, color: T.cream, display: "flex", alignItems: "center", gap: 12, textAlign: "left", cursor: "pointer" }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: T.bg3, display: "grid", placeItems: "center", color: T.accent, flexShrink: 0 }}><Sparkles size={15} /></div>
            <div>
              <div style={{ fontSize: 13 }}>Auto-choose</div>
              <div style={{ fontSize: 10, color: T.creamDim, marginTop: 2 }}>Best for your beans</div>
            </div>
          </button>
        </div>

        {/* Curated recipe cards */}
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr" }}>
          {list.map((r, i) => (
            <button key={r.id} onClick={() => { setRecipe(r); navigate("/brew"); }}
              className="fade-up" style={{ padding: "20px 20px", background: T.bg2, border: `1px solid ${T.line}`, borderRadius: 16, color: T.cream, textAlign: "left", display: "flex", gap: 16, animationDelay: `${i * 40}ms`, cursor: "pointer" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: T.bg3, display: "grid", placeItems: "center", fontSize: 12, color: T.accent, flexShrink: 0 }}>0{i + 1}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, marginBottom: 4 }}>{r.title}</div>
                <div style={{ fontSize: 11, color: T.creamDim, marginBottom: 10 }}>{r.author}</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <Pill>{formatWeight(r.dose, settings.units)}</Pill>
                  <Pill>{formatWeight(r.water, settings.units)} water</Pill>
                  <Pill>{formatTemp(r.temp, settings.tempUnit)}</Pill>
                  <Pill dim>★ {r.rating}</Pill>
                  {r.hasMilk && <Pill>+ Milk</Pill>}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Community-submitted approved recipes */}
        {communityRecipes.length > 0 && (
          <div style={{ marginTop: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <Users size={13} color={T.creamDim} />
              <div style={{ fontSize: 10, letterSpacing: "0.2em", color: T.creamDim }}>FROM THE COMMUNITY</div>
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {communityRecipes.map((r) => (
                <div key={r.id} style={{ padding: "16px 18px", background: T.bg2, border: `1px solid ${T.line}`, borderRadius: 14, color: T.cream }}>
                  <div style={{ fontSize: 14, marginBottom: 6 }}>{r.title}</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {r.dose_g && <Pill>{formatWeight(r.dose_g, settings.units)}</Pill>}
                    {r.water_g && <Pill>{formatWeight(r.water_g, settings.units)} water</Pill>}
                    {r.temp_c && <Pill>{formatTemp(r.temp_c, settings.tempUnit)}</Pill>}
                    <Pill dim>{r.method.toUpperCase()}</Pill>
                  </div>
                  {r.notes && <div style={{ fontSize: 11, color: T.creamDim, marginTop: 8, fontStyle: "italic" }}>{r.notes}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
