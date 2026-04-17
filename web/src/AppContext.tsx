import { createContext, useContext, useEffect, useState } from "react";
import type { Bean, Grinder, JournalEntry, Method, Recipe, UserSettings } from "./types";
import { GRINDERS } from "./data";
import { get, set, initStorage } from "./lib/storage";
import type { MethodId } from "./types";

// ─── PendingBrew ──────────────────────────────────────────────────────────────
// Transient data stashed in context instead of window.__pendingBrew.
// The Brew page writes it when navigating to Rating; Rating reads and clears it.
export interface PendingBrew {
  recipeId: string;
  recipeTitle: string;
  method: MethodId;
  bean: string;
  grinder: string;
  dose?: number;
  water?: number;
  temp?: number;
  clicks?: number;
  /** Present when the user is upgrading a quick-log entry to a full one */
  existingId?: string;
}

// ─── Default values ───────────────────────────────────────────────────────────
const DEFAULT_SETTINGS: UserSettings = {
  name: "Adrian",
  units: "metric",
  tempUnit: "C",
  musicAuto: false,
  notifications: true,
};

const SEED_BEAN: Bean = {
  id: "seed-bean-1",
  name: "Yirgacheffe",
  roaster: "Blue Tokai",
  roast: "Light",
  notes: "Floral, bergamot, citrus",
  date: "Mar 28",
  source: "manual",
};

const SEED_JOURNAL: JournalEntry[] = [
  {
    id: "seed-1",
    recipeId: "hoff",
    recipeTitle: "Hoffmann Ultimate V60",
    method: "v60",
    bean: "Yirgacheffe",
    grinder: "Comandante C40",
    date: "Apr 14",
    dose: 15,
    water: 250,
    temp: 96,
    clicks: 23,
    scores: { sweetness: 6, acidity: 8, body: 4, bitterness: 3, aftertaste: 7, overall: 7 },
    notes: "Bright and clean but a bit thin. Floral peaks.",
    quickLogged: false,
  },
];

// ─── Context shape ────────────────────────────────────────────────────────────
interface AppContextValue {
  grinder: Grinder;
  setGrinder: (g: Grinder) => void;
  bean: Bean | null;
  setBean: (b: Bean | null) => void;
  method: Method | null;
  setMethod: (m: Method | null) => void;
  recipe: Recipe | null;
  setRecipe: (r: Recipe | null) => void;
  beanLog: Bean[];
  setBeanLog: (log: Bean[]) => void;
  brewLog: JournalEntry[];
  setBrewLog: (log: JournalEntry[]) => void;
  settings: UserSettings;
  setSettings: (s: UserSettings) => void;
  settingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
  pendingBrew: PendingBrew | null;
  setPendingBrew: (b: PendingBrew | null) => void;
  pendingTweak: JournalEntry | null;
  setPendingTweak: (e: JournalEntry | null) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AppProvider({ children }: { children: React.ReactNode }) {
  // initStorage() is called once in main.tsx before render, but calling again is a no-op
  useEffect(() => { initStorage(); }, []);

  const [grinder, setGrinder] = useState<Grinder>(GRINDERS[0]);
  const [bean, setBean] = useState<Bean | null>(null);
  const [method, setMethod] = useState<Method | null>(null);
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  // Persisted state — loaded from storage on mount
  const [beanLog, setBeanLogState] = useState<Bean[]>(() =>
    get("bbrew_bean_log", [SEED_BEAN]),
  );
  const [brewLog, setBrewLogState] = useState<JournalEntry[]>(() =>
    get("bbrew_journal", SEED_JOURNAL),
  );
  const [settings, setSettingsState] = useState<UserSettings>(() =>
    get("bbrew_settings", DEFAULT_SETTINGS),
  );

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [pendingBrew, setPendingBrew] = useState<PendingBrew | null>(null);
  const [pendingTweak, setPendingTweak] = useState<JournalEntry | null>(null);

  // Write-through helpers
  const setBeanLog = (log: Bean[]) => {
    setBeanLogState(log);
    set("bbrew_bean_log", log);
  };
  const setBrewLog = (log: JournalEntry[]) => {
    setBrewLogState(log);
    set("bbrew_journal", log);
  };
  const setSettings = (s: UserSettings) => {
    setSettingsState(s);
    set("bbrew_settings", s);
  };

  return (
    <AppContext.Provider value={{
      grinder, setGrinder,
      bean, setBean,
      method, setMethod,
      recipe, setRecipe,
      beanLog, setBeanLog,
      brewLog, setBrewLog,
      settings, setSettings,
      settingsOpen, setSettingsOpen,
      pendingBrew, setPendingBrew,
      pendingTweak, setPendingTweak,
    }}>
      {children}
    </AppContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used inside AppProvider");
  return ctx;
}
