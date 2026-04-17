import { Home, Coffee, Book, Compass, MapPin } from "lucide-react";
import { T } from "../styles/theme";

// Screens that count as "Brew" for the active indicator
const BREW_SCREENS = ["setup", "recipes", "brew"] as const;

export type NavScreen =
  | "welcome"
  | "methods"
  | "journal"
  | "discover"
  | "cafes"
  | (typeof BREW_SCREENS)[number];

interface Props {
  screen: NavScreen | string;
  go: (screen: NavScreen) => void;
}

const items: { id: NavScreen; label: string }[] = [
  { id: "welcome",  label: "Home"    },
  { id: "methods",  label: "Brew"    },
  { id: "journal",  label: "Journal" },
  { id: "discover", label: "Beans"   },
  { id: "cafes",    label: "Cafes"   },
];

function NavIcon({ id, size }: { id: NavScreen; size: number }) {
  const props = { size, strokeWidth: 1.5 };
  switch (id) {
    case "welcome":  return <Home     {...props} />;
    case "methods":  return <Coffee   {...props} />;
    case "journal":  return <Book     {...props} />;
    case "discover": return <Compass  {...props} />;
    case "cafes":    return <MapPin   {...props} />;
    default:         return null;
  }
}

export function BottomNav({ screen, go }: Props) {
  return (
    <div style={{
      position: "fixed", bottom: 0, width: "100%", maxWidth: 440,
      background: T.bg, borderTop: `1px solid ${T.line}`,
      display: "flex", padding: "10px 0 14px", justifyContent: "space-around",
    }}>
      {items.map((it) => {
        const active =
          screen === it.id ||
          (it.id === "methods" && (BREW_SCREENS as readonly string[]).includes(screen));
        return (
          <button
            key={it.id}
            onClick={() => go(it.id)}
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
    </div>
  );
}

