import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Home, Coffee, Book, Compass, BookOpen, Users, MapPin,
  ChevronRight, Lightbulb, Sparkles, Settings,
} from "lucide-react";
import { useAuth } from "../AuthContext";
import { T, FONT } from "../styles/theme";

const SIDEBAR_ITEMS = [
  { icon: Home,     label: "Home",          active: true },
  { icon: Coffee,   label: "Brew"                        },
  { icon: Book,     label: "Brew Journal"                },
  { icon: Compass,  label: "Discover Beans"              },
  { icon: BookOpen, label: "My Bean Log"                 },
  { icon: Users,    label: "Community"                   },
  { icon: MapPin,   label: "Cafes Near Me"               },
  { icon: Book,     label: "Glossary"                    },
];

const DASH_CARDS = [
  { Icon: Book,    label: "Brew journal",   sub: "14 logged"       },
  { Icon: Compass, label: "Discover beans", sub: "Indian roasters" },
  { Icon: MapPin,  label: "Cafes near me",  sub: "Find a spot"     },
  { Icon: Users,   label: "Community",      sub: "142 members"     },
];

// Full-size desktop app UI — rendered at 1× then CSS-scaled down
function DesktopAppContent() {
  return (
    <div style={{ display: "flex", height: "100%", fontFamily: FONT, color: T.cream, background: T.bg }}>
      {/* Sidebar */}
      <div style={{
        width: 240, background: T.bg2, borderRight: `1px solid ${T.line}`,
        padding: "30px 18px", display: "flex", flexDirection: "column", flexShrink: 0,
      }}>
        <div style={{ padding: "0 12px 36px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 28, height: 28, background: T.cream, borderRadius: 8,
              display: "grid", placeItems: "center", color: T.bg, fontSize: 14, fontWeight: 600,
            }}>✿</div>
            <span style={{ fontSize: 14, letterSpacing: "0.05em", color: T.cream, fontWeight: 300 }}>BeyondPours</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          {SIDEBAR_ITEMS.map(({ icon: Icon, label, active }) => (
            <div key={label} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "11px 14px", borderRadius: 10,
              background: active ? T.bg3 : "transparent",
              color: active ? T.cream : T.creamDim,
              fontSize: 13, letterSpacing: "0.05em",
            }}>
              <Icon size={16} strokeWidth={1.5} />
              <span>{label}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", color: T.creamDim, fontSize: 13 }}>
          <Settings size={16} strokeWidth={1.5} />
          <span>Settings</span>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: "40px 52px", minWidth: 0, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40 }}>
          <div style={{ width: 24, height: 24, background: T.cream, borderRadius: 7, display: "grid", placeItems: "center", color: T.bg, fontSize: 12 }}>✿</div>
          <span style={{ fontSize: 12, letterSpacing: "0.2em", color: T.creamDim }}>BEYONDPOURS</span>
        </div>
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 13, color: T.creamDim, marginBottom: 12, letterSpacing: "0.1em" }}>Good morning, Alex.</div>
          <div style={{ fontSize: 56, fontWeight: 200, lineHeight: 1.05, letterSpacing: "-0.02em" }}>
            What are we<br />brewing today?
          </div>
        </div>
        <div style={{
          background: T.cream, color: T.bg, borderRadius: 22,
          padding: "26px 30px", display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 18,
        }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.6, marginBottom: 6 }}>Start</div>
            <div style={{ fontSize: 30, fontWeight: 300 }}>New brew</div>
            <div style={{ fontSize: 12, opacity: 0.55, marginTop: 5 }}>Nine methods · Including milk drinks</div>
          </div>
          <ChevronRight size={26} color={T.bg} strokeWidth={1.5} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {DASH_CARDS.map(({ Icon, label, sub }) => (
            <div key={label} style={{ background: T.bg2, border: `1px solid ${T.line}`, borderRadius: 18, padding: "18px 20px" }}>
              <div style={{ color: T.accent, marginBottom: 16 }}><Icon size={18} strokeWidth={1.5} /></div>
              <div style={{ fontSize: 14, fontWeight: 400, marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: 11, color: T.creamDim }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right stats */}
      <div style={{
        width: 240, background: T.bg2, borderLeft: `1px solid ${T.line}`,
        padding: "40px 20px", flexShrink: 0, display: "flex", flexDirection: "column", gap: 18, overflow: "hidden",
      }}>
        <div style={{ border: `1px solid ${T.line}`, borderRadius: 18, padding: 20 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.25em", color: T.creamDim, marginBottom: 16 }}>THIS WEEK</div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            {[{ n: "4", l: "brews" }, { n: "7.8", l: "avg score" }, { n: "2", l: "methods" }].map(s => (
              <div key={s.l}>
                <div style={{ fontSize: 24, fontWeight: 200 }}>{s.n}</div>
                <div style={{ fontSize: 9, color: T.creamDim, letterSpacing: "0.12em", textTransform: "uppercase" }}>{s.l}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 4, height: 46, alignItems: "flex-end" }}>
            {[0, 0, 0, 4, 0, 0, 0].map((c, i) => (
              <div key={i} style={{
                flex: 1, background: i === 3 ? T.accent : T.brownDeep,
                height: `${Math.max((c / 4) * 100, 8)}%`, borderRadius: 2, opacity: c === 0 ? 0.3 : 1,
              }} />
            ))}
          </div>
          <div style={{ display: "flex", gap: 4, marginTop: 7 }}>
            {"MTWTFSS".split("").map((d, i) => (
              <div key={i} style={{ flex: 1, fontSize: 9, color: i === 3 ? T.accent : T.creamDim, textAlign: "center" }}>{d}</div>
            ))}
          </div>
        </div>
        <div style={{ border: `1px solid ${T.line}`, borderRadius: 18, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Lightbulb size={13} color={T.accent} strokeWidth={1.5} />
            <span style={{ fontSize: 9, letterSpacing: "0.22em", color: T.creamDim }}>TIP OF THE DAY</span>
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.55, color: T.cream }}>Use water at 94°C for a cleaner, brighter cup.</div>
        </div>
        <div style={{ background: `linear-gradient(135deg, ${T.bg3}, ${T.bg2})`, border: `1px solid ${T.line}`, borderRadius: 18, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Sparkles size={13} color={T.accent} strokeWidth={1.5} />
            <span style={{ fontSize: 9, letterSpacing: "0.22em", color: T.creamDim }}>FUN FACT</span>
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.55, color: T.cream, fontStyle: "italic" }}>"Ethiopia is the birthplace of Arabica coffee."</div>
        </div>
      </div>
    </div>
  );
}

// Full-size mobile app UI — rendered at 1× then CSS-scaled down
function MobileAppContent() {
  return (
    <div style={{ fontFamily: FONT, color: T.cream, background: T.bg, height: "100%", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "56px 26px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 22, height: 22, background: T.cream, borderRadius: 6, display: "grid", placeItems: "center", color: T.bg, fontSize: 10 }}>✿</div>
          <span style={{ fontSize: 10, letterSpacing: "0.2em", color: T.creamDim }}>BEYONDPOURS</span>
        </div>
        <Settings size={16} color={T.cream} strokeWidth={1.5} />
      </div>
      <div style={{ padding: "0 26px" }}>
        <div style={{ fontSize: 13, color: T.creamDim, letterSpacing: "0.1em", marginBottom: 10 }}>Good morning.</div>
        <div style={{ fontSize: 40, fontWeight: 200, lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: 36 }}>
          What are we<br />brewing today?
        </div>
        <div style={{
          background: T.cream, color: T.bg, borderRadius: 18,
          padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14,
        }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.6, marginBottom: 4 }}>Start</div>
            <div style={{ fontSize: 20, fontWeight: 300 }}>New brew</div>
          </div>
          <ChevronRight size={20} color={T.bg} strokeWidth={1.5} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {DASH_CARDS.map(({ Icon, label, sub }) => (
            <div key={label} style={{ background: T.bg2, border: `1px solid ${T.line}`, borderRadius: 18, padding: 18 }}>
              <div style={{ color: T.accent, marginBottom: 14 }}><Icon size={16} strokeWidth={1.5} /></div>
              <div style={{ fontSize: 13, fontWeight: 400, marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: 10, color: T.creamDim }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Desktop browser frame — inner content is 1/SCALE size, CSS-scaled
function DesktopMockup() {
  const SCALE = 0.47;
  const W = 460, CHROME = 34, H = 300;
  const IW = Math.round(W / SCALE);
  const IH = Math.round((H - CHROME) / SCALE);

  return (
    <div style={{
      width: W, height: H, borderRadius: 12,
      border: `1px solid rgba(42,36,33,0.8)`, overflow: "hidden", flexShrink: 0,
      boxShadow: [
        "0 8px 16px rgba(0,0,0,0.35)",
        "0 28px 56px rgba(0,0,0,0.5)",
        "0 0 0 1px rgba(255,255,255,0.05)",
        "inset 0 1px 0 rgba(255,255,255,0.07)",
      ].join(", "),
    }}>
      <div style={{
        height: CHROME, background: "#111009", borderBottom: `1px solid ${T.line}`,
        display: "flex", alignItems: "center", padding: "0 12px", gap: 6, flexShrink: 0,
      }}>
        {[["#ff5f57", 0.7], ["#ffbd2e", 0.7], ["#28c840", 0.7]].map(([c, o]) => (
          <div key={c as string} style={{ width: 9, height: 9, borderRadius: "50%", background: c as string, opacity: o as number }} />
        ))}
        <div style={{
          flex: 1, marginLeft: 8, background: T.bg3, borderRadius: 5,
          height: 20, display: "flex", alignItems: "center", padding: "0 10px",
          fontSize: 10, color: T.creamDim,
        }}>
          beyondpours.app
        </div>
      </div>
      <div style={{ width: W, height: H - CHROME, overflow: "hidden" }}>
        <div style={{ width: IW, height: IH, transform: `scale(${SCALE})`, transformOrigin: "top left", pointerEvents: "none" }}>
          <DesktopAppContent />
        </div>
      </div>
    </div>
  );
}

// Phone frame — inner content is 1/SCALE size, CSS-scaled
function PhoneMockup() {
  const SCALE = 0.5;
  const W = 136, NOTCH = 18, H = 272;
  const IW = Math.round(W / SCALE);
  const IH = Math.round((H - NOTCH) / SCALE);

  return (
    <div style={{
      width: W, height: H, borderRadius: 28,
      border: `1.5px solid rgba(42,36,33,0.8)`, overflow: "hidden", flexShrink: 0,
      boxShadow: "0 8px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.08)",
      background: T.bg,
    }}>
      <div style={{ height: NOTCH, background: T.bg2, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 52, height: 7, borderRadius: 4, background: "#060504" }} />
      </div>
      <div style={{ width: W, height: H - NOTCH, overflow: "hidden" }}>
        <div style={{ width: IW, height: IH, transform: `scale(${SCALE})`, transformOrigin: "top left", pointerEvents: "none" }}>
          <MobileAppContent />
        </div>
      </div>
    </div>
  );
}

// ── Landing page ──────────────────────────────────────────────────────────────

export function Landing() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [mockupScale, setMockupScale] = useState(1);

  useEffect(() => {
    const GROUP_W = 460 + 68; // desktop width + phone overhang
    const check = () => {
      const vw = window.innerWidth;
      const mobile = vw < 1080;
      setIsMobile(mobile);
      if (!mobile) {
        const leftW = vw * 0.48; // no maxWidth cap — column is exactly 48% of viewport
        const rightW = vw - leftW - 48;
        // allow scaling UP so mockups fill the right section (cap at 1.4×)
        setMockupScale(Math.min(1.4, Math.max(0.65, (rightW - 40) / GROUP_W)));
      }
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!loading && user) navigate("/home", { replace: true });
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div style={{ height: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, color: T.creamDim, fontSize: 13 }}>
        Loading…
      </div>
    );
  }

  return (
    <div style={{
      height: "100vh", fontFamily: FONT,
      color: T.cream, letterSpacing: "0.01em",
      display: "flex", flexDirection: "column", overflow: "hidden",
      background: "linear-gradient(145deg, #0e0b09 0%, #0a0807 45%, #0c0908 100%)",
    }}>

      {/* Nav — frosted glass */}
      <nav style={{
        flexShrink: 0, height: 52,
        borderBottom: `1px solid rgba(42,36,33,0.7)`,
        padding: "0 clamp(20px, 4vw, 40px)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(10,8,7,0.72)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        position: "relative", zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{
            width: 26, height: 26, background: T.bg3, border: `1px solid ${T.line}`,
            borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13,
          }}>✿</div>
          <span style={{ fontSize: 11, letterSpacing: "0.2em", color: T.accent, textTransform: "uppercase" }}>BeyondPours</span>
        </div>
        <Link to="/signin" style={{
          padding: "7px 17px",
          background: "rgba(28,24,22,0.6)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: `1px solid rgba(42,36,33,0.9)`,
          borderRadius: 9, color: T.cream,
          fontFamily: FONT, fontSize: 13, textDecoration: "none",
        }}>
          Sign In
        </Link>
      </nav>

      {/* Hero */}
      {isMobile ? (
        <div style={{
          flex: 1, overflow: "auto",
          display: "flex", flexDirection: "column", alignItems: "center",
          padding: "36px 24px 32px", gap: 36, textAlign: "center",
        }}>
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "4px 12px", background: T.bg2, border: `1px solid ${T.line}`,
              borderRadius: 20, fontSize: 10, color: T.creamDim, letterSpacing: "0.08em", marginBottom: 20,
            }}>
              <span style={{ color: T.accent, fontSize: 8 }}>✦</span> For specialty coffee enthusiasts
            </div>
            <h1 style={{
              fontSize: "clamp(32px, 9vw, 44px)", fontWeight: 200,
              letterSpacing: "-0.02em", lineHeight: 1.1, margin: "0 0 16px",
            }}>
              Craft your perfect cup,<br />
              <span style={{ color: T.accent }}>every single time.</span>
            </h1>
            <p style={{ fontSize: 14, color: T.creamDim, fontWeight: 300, lineHeight: 1.65, margin: "0 0 28px" }}>
              BeyondPours is your intelligent brewing companion.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/signin" style={{
                padding: "12px 24px", background: T.accent, color: T.bg,
                borderRadius: 11, textDecoration: "none", fontSize: 14, fontWeight: 600, fontFamily: FONT,
              }}>Start brewing free</Link>
              <Link to="/signin" style={{
                padding: "12px 20px", background: T.bg2, color: T.cream,
                border: `1px solid ${T.line}`, borderRadius: 11, textDecoration: "none", fontSize: 14, fontFamily: FONT,
              }}>Sign In</Link>
            </div>
          </div>
          <PhoneMockup />
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
          {/* Full-hero ambient gradient */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
            background: [
              "radial-gradient(ellipse at 20% 45%, rgba(139,90,43,0.07) 0%, transparent 50%)",
              "radial-gradient(ellipse at 85% 25%, rgba(212,165,116,0.04) 0%, transparent 40%)",
              "radial-gradient(ellipse at 50% 100%, rgba(107,68,35,0.05) 0%, transparent 45%)",
            ].join(", "),
          }} />

          {/* Left — text */}
          <div style={{
            width: "48%",
            display: "flex", flexDirection: "column", justifyContent: "center",
            padding: "0 clamp(24px, 2.5vw, 40px) 0 clamp(40px, 4.5vw, 64px)",
            flexShrink: 0, position: "relative", zIndex: 1,
          }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "5px 13px", background: T.bg2, border: `1px solid ${T.line}`,
              borderRadius: 20, fontSize: 10.5, color: T.creamDim, letterSpacing: "0.07em",
              marginBottom: 32, alignSelf: "flex-start",
            }}>
              <span style={{ color: T.accent, fontSize: 9 }}>✦</span> For specialty coffee enthusiasts
            </div>
            <h1 style={{
              fontSize: "clamp(30px, 2.6vw, 40px)", fontWeight: 200,
              letterSpacing: "-0.025em", lineHeight: 1.1,
              margin: "0 0 24px", color: T.cream,
            }}>
              Craft your perfect cup,<br />
              <span style={{ color: T.accent }}>every single time.</span>
            </h1>
            <p style={{
              fontSize: "clamp(14px, 1.15vw, 16px)", color: T.creamDim,
              fontWeight: 300, lineHeight: 1.7, margin: "0 0 40px", maxWidth: 480,
            }}>
              BeyondPours is your intelligent brewing companion — track every brew, fine-tune recipes with AI, and discover the best of Indian specialty coffee.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link to="/signin" style={{
                padding: "13px 28px", background: T.accent, color: T.bg,
                borderRadius: 11, textDecoration: "none", fontSize: 14,
                fontWeight: 600, fontFamily: FONT, whiteSpace: "nowrap",
              }}>Start brewing free</Link>
              <Link to="/signin" style={{
                padding: "13px 22px",
                background: "rgba(28,24,22,0.6)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                border: `1px solid rgba(42,36,33,0.9)`,
                borderRadius: 11, color: T.cream,
                textDecoration: "none", fontSize: 14, fontFamily: FONT, whiteSpace: "nowrap",
              }}>Sign In →</Link>
            </div>
          </div>

          {/* Right — mockups */}
          <div style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
            paddingRight: "clamp(16px, 2.5vw, 40px)",
            position: "relative", zIndex: 1, overflow: "visible",
          }}>
            {/* Deep ambient glow — warm amber behind mockups */}
            <div style={{
              position: "absolute", inset: 0,
              background: [
                "radial-gradient(ellipse at 55% 48%, rgba(212,165,116,0.08) 0%, transparent 52%)",
                "radial-gradient(ellipse at 70% 65%, rgba(139,90,43,0.07) 0%, transparent 40%)",
              ].join(", "),
              pointerEvents: "none",
            }} />
            {/* Mockup group — scales to fill right section */}
            <div style={{
              position: "relative", flexShrink: 0,
              transform: `scale(${mockupScale})`,
              transformOrigin: "center center",
              filter: "drop-shadow(0 24px 56px rgba(139,90,43,0.2)) drop-shadow(0 8px 20px rgba(0,0,0,0.5))",
            }}>
              <DesktopMockup />
              {/* Phone overlapping bottom-right corner */}
              <div style={{ position: "absolute", bottom: -20, right: -68, zIndex: 5 }}>
                <PhoneMockup />
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
