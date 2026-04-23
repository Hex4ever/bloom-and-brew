import { Home, Coffee, Book, Compass, BookOpen, Users, MapPin, Settings } from "lucide-react";
import { T } from "../styles/theme";

// Screens that count as "Brew" for the active indicator
const BREW_SCREENS = ["setup", "methods", "recipes", "brew"] as const;

export type SidebarScreen =
  | "welcome"
  | "methods"
  | "journal"
  | "discover"
  | "beans"
  | "feed"
  | "cafes"
  | "glossary"
  | (typeof BREW_SCREENS)[number];

interface Props {
  screen: SidebarScreen | string;
  go: (screen: SidebarScreen) => void;
  openSettings: () => void;
}

const items: { id: SidebarScreen; label: string }[] = [
  { id: "welcome",  label: "Home"           },
  { id: "methods",  label: "Brew"           },
  { id: "journal",  label: "Brew Journal"   },
  { id: "discover", label: "Discover Beans" },
  { id: "beans",    label: "My Bean Log"    },
  { id: "feed",     label: "Community"      },
  { id: "cafes",    label: "Cafes Near Me"  },
  { id: "glossary", label: "Glossary"       },
];

function NavIcon({ id, size }: { id: SidebarScreen; size: number }) {
  const props = { size, strokeWidth: 1.5 };
  switch (id) {
    case "welcome":  return <Home     {...props} />;
    case "methods":  return <Coffee   {...props} />;
    case "journal":  return <Book     {...props} />;
    case "discover": return <Compass  {...props} />;
    case "beans":    return <BookOpen {...props} />;
    case "feed":     return <Users    {...props} />;
    case "cafes":    return <MapPin   {...props} />;
    case "glossary": return <Book     {...props} />;
    default:         return null;
  }
}

export function Sidebar({ screen, go, openSettings }: Props) {
  return (
    <div style={{
      width: 240, minHeight: "100vh", background: T.bg2,
      borderRight: `1px solid ${T.line}`, padding: "30px 18px",
      display: "flex", flexDirection: "column", position: "sticky", top: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: "0 12px 36px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <div style={{
            width: 28, height: 28, background: T.cream, borderRadius: 8,
            display: "grid", placeItems: "center", color: T.bg, fontSize: 14, fontWeight: 600,
          }}>✿</div>
          <div style={{ fontSize: 14, letterSpacing: "0.05em", color: T.cream, fontWeight: 300 }}>
            BeyondPours
          </div>
        </div>
      </div>

      {/* Nav items */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
        {items.map((it) => {
          const active =
            screen === it.id ||
            (it.id === "methods" && (BREW_SCREENS as readonly string[]).includes(screen));
          return (
            <button
              key={it.id}
              onClick={() => go(it.id)}
              style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                background: active ? T.bg3 : "transparent", border: "none", borderRadius: 10,
                color: active ? T.cream : T.creamDim, textAlign: "left",
                fontSize: 13, letterSpacing: "0.05em",
              }}
            >
              <NavIcon id={it.id} size={16} />
              <span>{it.label}</span>
            </button>
          );
        })}
      </div>

      {/* Settings */}
      <button
        onClick={openSettings}
        style={{
          display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
          background: "transparent", border: "none", borderRadius: 10,
          color: T.creamDim, textAlign: "left", fontSize: 13,
        }}
      >
        <Settings size={16} strokeWidth={1.5} />
        <span>Settings</span>
      </button>
    </div>
  );
}
