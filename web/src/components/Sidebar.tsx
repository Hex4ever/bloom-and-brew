import { Home, Coffee, Book, Compass, BookOpen, Users, MapPin, Settings, Bell } from "lucide-react";
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
  | "notifications"
  | "cafes"
  | "glossary"
  | (typeof BREW_SCREENS)[number];

interface Props {
  screen: SidebarScreen | string;
  go: (screen: SidebarScreen) => void;
  openSettings: () => void;
  unreadNotifCount?: number;
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
    case "notifications": return <Bell  {...props} />;
    case "glossary":      return <Book  {...props} />;
    default:              return null;
  }
}

export function Sidebar({ screen, go, openSettings, unreadNotifCount = 0 }: Props) {
  return (
    <div style={{
      width: 240, height: "100vh", flexShrink: 0, background: T.bg2,
      borderRight: `1px solid ${T.line}`, padding: "30px 18px",
      display: "flex", flexDirection: "column",
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
      <nav aria-label="Main navigation" style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
        {items.map((it) => {
          const active =
            screen === it.id ||
            (it.id === "methods" && (BREW_SCREENS as readonly string[]).includes(screen));
          return (
            <button
              key={it.id}
              onClick={() => go(it.id)}
              aria-current={active ? "page" : undefined}
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
      </nav>

      {/* Bottom utility row: bell + settings */}
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {/* Notifications bell */}
        <button
          onClick={() => go("notifications")}
          aria-label="Notifications"
          aria-current={screen === "notifications" ? "page" : undefined}
          style={{
            position: "relative", flexShrink: 0,
            width: 40, height: 40, display: "grid", placeItems: "center",
            background: screen === "notifications" ? T.bg3 : "transparent",
            border: "none", borderRadius: 10, color: screen === "notifications" ? T.cream : T.creamDim,
            cursor: "pointer",
          }}
        >
          <Bell size={16} strokeWidth={1.5} />
          {unreadNotifCount > 0 && (
            <div style={{
              position: "absolute", top: 6, right: 6,
              minWidth: 14, height: 14, borderRadius: 999,
              background: T.accent, color: T.bg,
              fontSize: 8, fontWeight: 700,
              display: "grid", placeItems: "center",
              padding: "0 3px",
            }}>
              {unreadNotifCount > 9 ? "9+" : unreadNotifCount}
            </div>
          )}
        </button>

        {/* Settings */}
        <button
          onClick={openSettings}
          style={{
            flex: 1, display: "flex", alignItems: "center", gap: 12, padding: "12px 10px",
            background: "transparent", border: "none", borderRadius: 10,
            color: T.creamDim, textAlign: "left", fontSize: 13, cursor: "pointer",
          }}
        >
          <Settings size={16} strokeWidth={1.5} />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
}
