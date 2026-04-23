import { Home, Coffee, Book, Compass, MapPin, MoreHorizontal, X, Users, BookOpen } from "lucide-react";
import { useState } from "react";
import { T } from "../styles/theme";

// Screens that count as "Brew" for the active indicator
const BREW_SCREENS = ["setup", "methods", "recipes", "brew"] as const;

export type NavScreen =
  | "welcome"
  | "methods"
  | "journal"
  | "discover"
  | "cafes"
  | "beans"
  | "feed"
  | "glossary"
  | (typeof BREW_SCREENS)[number];

interface Props {
  screen: NavScreen | string;
  go: (screen: NavScreen) => void;
  openSettings: () => void;
}

const mainItems: { id: NavScreen; label: string }[] = [
  { id: "welcome",  label: "Home"    },
  { id: "methods",  label: "Brew"    },
  { id: "journal",  label: "Journal" },
  { id: "discover", label: "Beans"   },
  { id: "cafes",    label: "Cafes"   },
];

const moreItems: { id: NavScreen; label: string }[] = [
  { id: "beans",    label: "My Bean Log" },
  { id: "feed",     label: "Community"   },
  { id: "glossary", label: "Glossary"    },
];

function NavIcon({ id, size }: { id: NavScreen; size: number }) {
  const props = { size, strokeWidth: 1.5 };
  switch (id) {
    case "welcome":  return <Home      {...props} />;
    case "methods":  return <Coffee    {...props} />;
    case "journal":  return <Book      {...props} />;
    case "discover": return <Compass   {...props} />;
    case "cafes":    return <MapPin    {...props} />;
    case "beans":    return <BookOpen  {...props} />;
    case "feed":     return <Users     {...props} />;
    case "glossary": return <Book      {...props} />;
    default:         return null;
  }
}

export function BottomNav({ screen, go, openSettings }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const moreActive = moreItems.some(
    (it) => screen === it.id || (it.id === "methods" && (BREW_SCREENS as readonly string[]).includes(screen))
  );

  const handleGo = (id: NavScreen) => {
    go(id);
    setDrawerOpen(false);
  };

  return (
    <>
      {/* More drawer overlay */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 190,
            background: "rgba(0,0,0,0.55)",
          }}
        />
      )}

      {/* More drawer panel */}
      <div style={{
        position: "fixed", bottom: 70, left: "50%",
        width: "min(340px, 90vw)",
        background: T.bg2, border: `1px solid ${T.line}`, borderRadius: 18,
        padding: "8px 0", zIndex: 200,
        transition: "opacity 0.18s, transform 0.18s",
        opacity: drawerOpen ? 1 : 0,
        pointerEvents: drawerOpen ? "auto" : "none",
        transform: drawerOpen
          ? "translateX(-50%) translateY(0)"
          : "translateX(-50%) translateY(12px)",
      }}>
        {/* Header row */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 18px 6px",
          borderBottom: `1px solid ${T.line}`, marginBottom: 4,
        }}>
          <span style={{ fontSize: 10, letterSpacing: "0.2em", color: T.creamDim }}>MORE</span>
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Close more menu"
            style={{ background: "none", border: "none", color: T.creamDim, cursor: "pointer", padding: 2 }}
          >
            <X size={14} strokeWidth={1.5} />
          </button>
        </div>

        {moreItems.map((it) => (
          <button
            key={it.id}
            onClick={() => handleGo(it.id)}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 14,
              padding: "13px 18px", background: "none", border: "none",
              color: screen === it.id ? T.cream : T.creamDim,
              fontSize: 14, textAlign: "left", cursor: "pointer", fontFamily: "inherit",
            }}
          >
            <NavIcon id={it.id} size={17} />
            <span>{it.label}</span>
          </button>
        ))}

        {/* Settings row */}
        <div style={{ borderTop: `1px solid ${T.line}`, marginTop: 4, paddingTop: 4 }}>
          <button
            onClick={() => { openSettings(); setDrawerOpen(false); }}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 14,
              padding: "13px 18px", background: "none", border: "none",
              color: T.creamDim, fontSize: 14, textAlign: "left", cursor: "pointer", fontFamily: "inherit",
            }}
          >
            <span style={{ fontSize: 17 }}>⚙</span>
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Bottom bar */}
      <nav aria-label="Main navigation" style={{
        position: "fixed", bottom: 0, width: "100%", maxWidth: 440,
        left: "50%", transform: "translateX(-50%)",
        background: T.bg, borderTop: `1px solid ${T.line}`,
        display: "flex", padding: "10px 0 14px", justifyContent: "space-around",
        zIndex: 100,
      }}>
        {mainItems.map((it) => {
          const active =
            screen === it.id ||
            (it.id === "methods" && (BREW_SCREENS as readonly string[]).includes(screen));
          return (
            <button
              key={it.id}
              onClick={() => { setDrawerOpen(false); go(it.id); }}
              aria-label={it.label}
              aria-current={active ? "page" : undefined}
              style={{
                background: "none", border: "none",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                color: active ? T.cream : T.creamDim,
              }}
            >
              <NavIcon id={it.id} size={18} />
              <span style={{ fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                {it.label}
              </span>
            </button>
          );
        })}

        {/* More button */}
        <button
          onClick={() => setDrawerOpen((v) => !v)}
          aria-label="More navigation options"
          aria-expanded={drawerOpen}
          style={{
            background: "none", border: "none",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            color: drawerOpen || moreActive ? T.cream : T.creamDim,
          }}
        >
          <MoreHorizontal size={18} strokeWidth={1.5} />
          <span style={{ fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase" }}>More</span>
        </button>
      </nav>
    </>
  );
}
