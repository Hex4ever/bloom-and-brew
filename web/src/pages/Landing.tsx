import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Home, Coffee, Book, Compass, BookOpen, Users, MapPin,
  ChevronRight, Lightbulb, Sparkles, Settings,
} from "lucide-react";
import { useAuth } from "../AuthContext";
import { T, FONT } from "../styles/theme";

const FEATURES = [
  {
    icon: "⚗️",
    title: "9 Brewing Methods",
    desc: "Guided flows for V60, AeroPress, French Press, Chemex, Moka Pot and more — with method-specific animations.",
  },
  {
    icon: "📓",
    title: "Brew Journal",
    desc: "Log every cup with flavour ratings: sweetness, acidity, body, and overall score. Watch yourself improve.",
  },
  {
    icon: "✦",
    title: "AI Recipe Coach",
    desc: "Describe what you tasted. Get precise grind, dose, and ratio tweaks to perfect your next brew.",
  },
  {
    icon: "🫘",
    title: "Indian Specialty Beans",
    desc: "Curated beans from 8 top Indian roasters. Filter by origin, process, and roast profile.",
  },
  {
    icon: "📍",
    title: "Cafe Finder",
    desc: "Locate specialty cafes near you. Discover hidden gems and your new daily ritual.",
  },
  {
    icon: "◆",
    title: "Community",
    desc: "Share recipes, swap tasting notes, and grow alongside fellow home brewers.",
  },
];

const SIDEBAR_ITEMS = [
  { icon: Home,     label: "Home",           active: true  },
  { icon: Coffee,   label: "Brew"                          },
  { icon: Book,     label: "Brew Journal"                  },
  { icon: Compass,  label: "Discover Beans"               },
  { icon: BookOpen, label: "My Bean Log"                   },
  { icon: Users,    label: "Community"                     },
  { icon: MapPin,   label: "Cafes Near Me"                 },
  { icon: Book,     label: "Glossary"                      },
];

const DASH_CARDS = [
  { Icon: Book,    label: "Brew journal",   sub: "14 logged"       },
  { Icon: Compass, label: "Discover beans", sub: "Indian roasters" },
  { Icon: MapPin,  label: "Cafes near me",  sub: "Find a spot"     },
  { Icon: Users,   label: "Community",      sub: "142 members"     },
];

function AppMockup({ compact }: { compact: boolean }) {
  if (compact) {
    return (
      <div style={{ position: "relative", width: "100%", maxWidth: 360, margin: "0 auto" }}>
        <div style={{
          position: "absolute", inset: -30,
          background: "radial-gradient(ellipse at 50% 55%, rgba(139,90,43,0.2) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />
        {/* Phone frame */}
        <div style={{
          position: "relative", zIndex: 1,
          background: T.bg2,
          borderRadius: 32, border: `2px solid ${T.line}`,
          overflow: "hidden",
          boxShadow: "0 24px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)",
          padding: "14px 0 0",
        }}>
          {/* Dynamic island */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <div style={{ width: 72, height: 6, borderRadius: 3, background: T.line }} />
          </div>
          <div style={{ padding: "0 18px 20px", background: T.bg }}>
            {/* Logo row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 22, height: 22, background: T.cream, borderRadius: 6,
                  display: "grid", placeItems: "center", color: T.bg, fontSize: 10,
                }}>✿</div>
                <span style={{ fontSize: 9, letterSpacing: "0.18em", color: T.creamDim }}>BEYONDPOURS</span>
              </div>
              <Settings size={13} color={T.cream} strokeWidth={1.5} />
            </div>
            {/* Greeting */}
            <div style={{ fontSize: 9, color: T.creamDim, letterSpacing: "0.1em", marginBottom: 8 }}>Good morning.</div>
            <div style={{ fontSize: 26, fontWeight: 200, lineHeight: 1.05, letterSpacing: "-0.02em", color: T.cream, marginBottom: 20 }}>
              What are we<br />brewing today?
            </div>
            {/* New brew button */}
            <div style={{
              background: T.cream, color: T.bg, borderRadius: 16,
              padding: "16px 20px", marginBottom: 16,
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <div style={{ fontSize: 8, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.55, marginBottom: 4 }}>Start</div>
                <div style={{ fontSize: 18, fontWeight: 300 }}>New brew</div>
              </div>
              <ChevronRight size={18} color={T.bg} strokeWidth={1.5} />
            </div>
            {/* Cards 2×2 */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {DASH_CARDS.map(({ Icon, label, sub }) => (
                <div key={label} style={{
                  background: T.bg2, borderRadius: 16,
                  border: `1px solid ${T.line}`, padding: "14px 13px",
                }}>
                  <div style={{ color: T.accent, marginBottom: 10 }}>
                    <Icon size={14} strokeWidth={1.5} />
                  </div>
                  <div style={{ fontSize: 11, color: T.cream, marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: 9.5, color: T.creamDim }}>{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 900, margin: "0 auto" }}>
      {/* Background glow */}
      <div style={{
        position: "absolute", inset: -60,
        background: "radial-gradient(ellipse at 50% 60%, rgba(139,90,43,0.15) 0%, transparent 60%)",
        pointerEvents: "none",
      }} />

      {/* Browser frame */}
      <div style={{
        position: "relative", zIndex: 1,
        background: T.bg,
        borderRadius: 14, border: `1px solid ${T.line}`,
        overflow: "hidden",
        boxShadow: "0 4px 6px rgba(0,0,0,0.25), 0 16px 32px rgba(0,0,0,0.4), 0 52px 100px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.03)",
        transform: "perspective(1400px) rotateX(1.5deg)",
        transformOrigin: "top center",
      }}>
        {/* Browser chrome */}
        <div style={{
          background: "#111009", borderBottom: `1px solid ${T.line}`,
          padding: "10px 14px", display: "flex", alignItems: "center", gap: 8,
        }}>
          {[["#ff5f57", 0.65], ["#ffbd2e", 0.65], ["#28c840", 0.65]].map(([c, o]) => (
            <div key={c as string} style={{
              width: 10, height: 10, borderRadius: "50%",
              background: c as string, opacity: o as number,
            }} />
          ))}
          <div style={{
            flex: 1, marginLeft: 12, background: T.bg3, borderRadius: 6,
            padding: "4px 12px", fontSize: 11, color: T.creamDim,
            display: "flex", alignItems: "center", gap: 5,
          }}>
            <svg width="8" height="10" viewBox="0 0 8 10" fill="none" style={{ opacity: 0.45 }}>
              <rect x="1" y="4" width="6" height="6" rx="1" stroke={T.creamDim} strokeWidth="1"/>
              <path d="M2 4V3a2 2 0 014 0v1" stroke={T.creamDim} strokeWidth="1"/>
            </svg>
            beyondpours.app
          </div>
        </div>

        {/* App shell — sidebar + main + right */}
        <div style={{ display: "flex", height: 430, fontFamily: FONT, color: T.cream }}>

          {/* ── Sidebar (matches Sidebar.tsx exactly) ── */}
          <div style={{
            width: 210, background: T.bg2,
            borderRight: `1px solid ${T.line}`,
            padding: "22px 14px",
            display: "flex", flexDirection: "column",
            flexShrink: 0,
          }}>
            {/* Logo */}
            <div style={{ padding: "0 10px 26px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 24, height: 24, background: T.cream,
                  borderRadius: 7, display: "grid", placeItems: "center",
                  color: T.bg, fontSize: 12, fontWeight: 600,
                }}>✿</div>
                <span style={{ fontSize: 12, letterSpacing: "0.05em", color: T.cream, fontWeight: 300 }}>
                  BeyondPours
                </span>
              </div>
            </div>
            {/* Nav items */}
            <div style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
              {SIDEBAR_ITEMS.map(({ icon: Icon, label, active }) => (
                <div key={label} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px", borderRadius: 9,
                  background: active ? T.bg3 : "transparent",
                  color: active ? T.cream : T.creamDim,
                  fontSize: 12, letterSpacing: "0.04em",
                }}>
                  <Icon size={14} strokeWidth={1.5} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
            {/* Settings */}
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", borderRadius: 9,
              color: T.creamDim, fontSize: 12,
            }}>
              <Settings size={14} strokeWidth={1.5} />
              <span>Settings</span>
            </div>
          </div>

          {/* ── Main content (matches Dashboard.tsx desktop layout) ── */}
          <div style={{
            flex: 1, padding: "28px 32px",
            overflow: "hidden", minWidth: 0,
            display: "flex", flexDirection: "column", gap: 16,
          }}>
            {/* Logo row (Dashboard renders this above greeting) */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <div style={{
                width: 20, height: 20, background: T.cream,
                borderRadius: 5, display: "grid", placeItems: "center",
                color: T.bg, fontSize: 10,
              }}>✿</div>
              <span style={{ fontSize: 9.5, letterSpacing: "0.2em", color: T.creamDim }}>BEYONDPOURS</span>
            </div>
            {/* Greeting */}
            <div style={{ marginBottom: 2 }}>
              <div style={{ fontSize: 10, color: T.creamDim, letterSpacing: "0.1em", marginBottom: 8 }}>
                Good morning, Alex.
              </div>
              <div style={{ fontSize: 28, fontWeight: 200, lineHeight: 1.05, letterSpacing: "-0.02em" }}>
                What are we brewing today?
              </div>
            </div>
            {/* New brew — wide cream banner (matches real button) */}
            <div style={{
              background: T.cream, color: T.bg,
              borderRadius: 16, padding: "16px 20px",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <div style={{ fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.55, marginBottom: 3 }}>
                  Start
                </div>
                <div style={{ fontSize: 20, fontWeight: 300 }}>New brew</div>
                <div style={{ fontSize: 9, opacity: 0.5, marginTop: 3 }}>Nine methods · Including milk drinks</div>
              </div>
              <ChevronRight size={20} color={T.bg} strokeWidth={1.5} />
            </div>
            {/* DashCards 2×2 grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {DASH_CARDS.map(({ Icon, label, sub }) => (
                <div key={label} style={{
                  background: T.bg2, border: `1px solid ${T.line}`,
                  borderRadius: 15, padding: "14px 16px",
                }}>
                  <div style={{ color: T.accent, marginBottom: 12 }}>
                    <Icon size={14} strokeWidth={1.5} />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 400, marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: 9.5, color: T.creamDim }}>{sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right panel — WeekStats + Tip + Fact ── */}
          <div style={{
            width: 196, background: T.bg2,
            borderLeft: `1px solid ${T.line}`,
            padding: "22px 16px",
            flexShrink: 0,
            display: "flex", flexDirection: "column", gap: 12,
            overflow: "hidden",
          }}>
            {/* WeekStats card */}
            <div style={{
              border: `1px solid ${T.line}`, borderRadius: 15,
              padding: "14px 14px 10px", background: T.bg2,
            }}>
              <div style={{ fontSize: 8, letterSpacing: "0.24em", color: T.creamDim, marginBottom: 12 }}>
                THIS WEEK
              </div>
              {/* 3-stat row */}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                {[{ n: "4", l: "brews" }, { n: "7.8", l: "avg score" }, { n: "2", l: "methods" }].map(s => (
                  <div key={s.l}>
                    <div style={{ fontSize: 18, fontWeight: 200 }}>{s.n}</div>
                    <div style={{ fontSize: 7, color: T.creamDim, letterSpacing: "0.14em", textTransform: "uppercase" }}>{s.l}</div>
                  </div>
                ))}
              </div>
              {/* Bar chart */}
              <div style={{ display: "flex", gap: 3, height: 42, alignItems: "flex-end" }}>
                {[0, 0, 0, 4, 0, 0, 0].map((c, i) => {
                  const maxVal = 4;
                  const h = Math.max((c / maxVal) * 100, 8);
                  return (
                    <div key={i} style={{
                      flex: 1, borderRadius: "2px 2px 0 0",
                      height: `${h}%`,
                      background: i === 3 ? T.accent : T.brownDeep,
                      opacity: c === 0 ? 0.3 : 1,
                    }} />
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: 3, marginTop: 6 }}>
                {"MTWTFSS".split("").map((d, i) => (
                  <div key={i} style={{
                    flex: 1, fontSize: 7.5, textAlign: "center",
                    color: i === 3 ? T.accent : T.creamDim,
                  }}>{d}</div>
                ))}
              </div>
            </div>

            {/* TipCard */}
            <div style={{
              background: T.bg2, border: `1px solid ${T.line}`,
              borderRadius: 15, padding: "12px 13px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                <Lightbulb size={11} color={T.accent} strokeWidth={1.5} />
                <span style={{ fontSize: 7.5, letterSpacing: "0.22em", color: T.creamDim }}>TIP OF THE DAY</span>
              </div>
              <div style={{ fontSize: 10.5, lineHeight: 1.55, color: T.cream }}>
                Use water at 94°C for a cleaner, brighter cup.
              </div>
            </div>

            {/* FactCard */}
            <div style={{
              background: `linear-gradient(135deg, ${T.bg3}, ${T.bg2})`,
              border: `1px solid ${T.line}`,
              borderRadius: 15, padding: "12px 13px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                <Sparkles size={11} color={T.accent} strokeWidth={1.5} />
                <span style={{ fontSize: 7.5, letterSpacing: "0.22em", color: T.creamDim }}>FUN FACT</span>
              </div>
              <div style={{ fontSize: 10.5, lineHeight: 1.55, color: T.cream, fontStyle: "italic" }}>
                "Ethiopia is the birthplace of Arabica coffee."
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 60,
          background: `linear-gradient(to bottom, transparent, ${T.bg})`,
          pointerEvents: "none", zIndex: 2,
        }} />
      </div>
    </div>
  );
}

export function Landing() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!loading && user) navigate("/home", { replace: true });
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", background: T.bg,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: FONT, color: T.creamDim, fontSize: 13,
      }}>
        Loading…
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: T.bg,
      fontFamily: FONT,
      color: T.cream,
      letterSpacing: "0.01em",
      overflowX: "hidden",
    }}>

      {/* ── Navbar ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: `${T.bg}ee`,
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: `1px solid ${T.line}`,
        padding: "0 clamp(16px, 4vw, 32px)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 56,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: T.bg3, border: `1px solid ${T.line}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, color: T.cream,
          }}>✿</div>
          <span style={{
            fontSize: 11, letterSpacing: "0.22em",
            color: T.accent, textTransform: "uppercase",
          }}>
            BeyondPours
          </span>
        </div>
        <Link to="/signin" style={{
          padding: "8px 18px",
          background: "transparent",
          border: `1px solid ${T.line}`,
          borderRadius: 10,
          color: T.cream,
          fontFamily: FONT,
          fontSize: 13,
          textDecoration: "none",
          letterSpacing: "0.02em",
        }}>
          Sign In
        </Link>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        padding: `clamp(56px, 10vw, 96px) clamp(16px, 5vw, 32px) clamp(48px, 8vw, 72px)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        position: "relative",
      }}>
        {/* Ambient glow */}
        <div style={{
          position: "absolute",
          top: "5%", left: "50%",
          transform: "translateX(-50%)",
          width: "min(700px, 100vw)",
          height: 500,
          background: "radial-gradient(ellipse, rgba(139,90,43,0.10) 0%, transparent 68%)",
          pointerEvents: "none",
          zIndex: 0,
        }} />

        <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "5px 14px",
            background: T.bg2,
            border: `1px solid ${T.line}`,
            borderRadius: 20,
            fontSize: 11, color: T.creamDim,
            letterSpacing: "0.08em",
            marginBottom: 32,
          }}>
            <span style={{ color: T.accent, fontSize: 9 }}>✦</span>
            For specialty coffee enthusiasts
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: "clamp(38px, 7.5vw, 76px)",
            fontWeight: 200,
            letterSpacing: "-0.025em",
            lineHeight: 1.08,
            margin: "0 0 22px",
            color: T.cream,
          }}>
            Craft your perfect cup,
            <br />
            <span style={{ color: T.accent }}>every single time.</span>
          </h1>

          {/* Subheading */}
          <p style={{
            fontSize: "clamp(14px, 2vw, 17px)",
            color: T.creamDim,
            fontWeight: 300,
            lineHeight: 1.65,
            maxWidth: 500,
            margin: "0 auto 44px",
          }}>
            BeyondPours is your intelligent brewing companion — track every brew, fine-tune recipes with AI, and discover the best of Indian specialty coffee.
          </p>

          {/* CTAs */}
          <div style={{
            display: "flex", gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: 72,
          }}>
            <Link to="/signin" style={{
              padding: "14px 32px",
              background: T.accent,
              color: T.bg,
              borderRadius: 12,
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: "0.03em",
              fontFamily: FONT,
              whiteSpace: "nowrap",
            }}>
              Start brewing free
            </Link>
            <Link to="/signin" style={{
              padding: "14px 28px",
              background: T.bg2,
              color: T.cream,
              border: `1px solid ${T.line}`,
              borderRadius: 12,
              textDecoration: "none",
              fontSize: 14,
              fontFamily: FONT,
              whiteSpace: "nowrap",
            }}>
              Sign In
            </Link>
          </div>

          {/* App mockup */}
          <AppMockup compact={isMobile} />
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{
        padding: `clamp(64px, 10vw, 100px) clamp(16px, 5vw, 32px)`,
        maxWidth: 1040,
        margin: "0 auto",
      }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{
            fontSize: 10, letterSpacing: "0.22em",
            color: T.accent, textTransform: "uppercase",
            marginBottom: 14,
          }}>
            Everything you need
          </div>
          <h2 style={{
            fontSize: "clamp(26px, 4.5vw, 44px)",
            fontWeight: 200,
            letterSpacing: "-0.02em",
            margin: 0,
            color: T.cream,
          }}>
            Brewed for coffee lovers
          </h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(auto-fit, minmax(${isMobile ? "280px" : "300px"}, 1fr))`,
          gap: 14,
        }}>
          {FEATURES.map(f => (
            <div key={f.title} style={{
              background: T.bg2,
              border: `1px solid ${T.line}`,
              borderRadius: 18,
              padding: "24px 22px",
              transition: "border-color 0.2s",
            }}>
              <div style={{ fontSize: 22, marginBottom: 14 }}>{f.icon}</div>
              <div style={{
                fontSize: 14.5, color: T.cream,
                fontWeight: 500, marginBottom: 9,
                letterSpacing: "0.01em",
              }}>
                {f.title}
              </div>
              <div style={{
                fontSize: 13, color: T.creamDim,
                lineHeight: 1.65, fontWeight: 300,
              }}>
                {f.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Quote ── */}
      <section style={{
        padding: `clamp(52px, 8vw, 80px) clamp(24px, 8vw, 80px)`,
        textAlign: "center",
        borderTop: `1px solid ${T.line}`,
        borderBottom: `1px solid ${T.line}`,
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 50%, rgba(212,165,116,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          fontSize: "clamp(48px, 10vw, 80px)",
          lineHeight: 0.6,
          color: T.brown,
          marginBottom: 24,
          fontWeight: 200,
          opacity: 0.5,
        }}>"</div>
        <p style={{
          fontSize: "clamp(18px, 3vw, 26px)",
          fontWeight: 200,
          color: T.cream,
          lineHeight: 1.5,
          margin: "0 auto 20px",
          maxWidth: 560,
          letterSpacing: "-0.01em",
          fontStyle: "italic",
        }}>
          Coffee is a language in itself.
        </p>
        <div style={{
          fontSize: 10, color: T.creamDim,
          letterSpacing: "0.22em", textTransform: "uppercase",
        }}>
          — Jackie Chan
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section style={{
        padding: `clamp(72px, 12vw, 110px) clamp(16px, 5vw, 32px)`,
        textAlign: "center",
        position: "relative",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 40%, rgba(139,90,43,0.09) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            fontSize: 10, letterSpacing: "0.22em",
            color: T.accent, textTransform: "uppercase",
            marginBottom: 16,
          }}>
            Ready to brew?
          </div>
          <h2 style={{
            fontSize: "clamp(30px, 5.5vw, 56px)",
            fontWeight: 200,
            letterSpacing: "-0.025em",
            margin: "0 0 20px",
            color: T.cream,
          }}>
            Start your journey today.
          </h2>
          <p style={{
            color: T.creamDim, fontSize: 14,
            margin: "0 auto 44px",
            lineHeight: 1.65,
            maxWidth: 380,
            fontWeight: 300,
          }}>
            Join brewers tracking every cup, refining every recipe, one pour at a time.
          </p>
          <div style={{
            display: "flex", gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}>
            <Link to="/signin" style={{
              padding: "15px 36px",
              background: T.accent,
              color: T.bg,
              borderRadius: 12,
              textDecoration: "none",
              fontSize: 14, fontWeight: 600,
              fontFamily: FONT,
              letterSpacing: "0.03em",
              whiteSpace: "nowrap",
            }}>
              Create free account
            </Link>
            <Link to="/signin" style={{
              padding: "15px 28px",
              background: T.bg2,
              color: T.cream,
              border: `1px solid ${T.line}`,
              borderRadius: 12,
              textDecoration: "none",
              fontSize: 14,
              fontFamily: FONT,
              whiteSpace: "nowrap",
            }}>
              Sign In →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        padding: "22px clamp(16px, 5vw, 32px)",
        borderTop: `1px solid ${T.line}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 22, height: 22, borderRadius: 6,
            background: T.bg3, border: `1px solid ${T.line}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11,
          }}>✿</div>
          <span style={{ fontSize: 10, letterSpacing: "0.2em", color: T.accent, textTransform: "uppercase" }}>
            BeyondPours
          </span>
        </div>
        <span style={{ fontSize: 12, color: T.creamDim }}>
          For the love of great coffee.
        </span>
      </footer>
    </div>
  );
}
