import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Bean, Grinder, JournalEntry, Method, Recipe, UserSettings } from "./types";
import { GRINDERS } from "./data";
import { get, set, initStorage } from "./lib/storage";
import { supabase } from "./lib/supabase";
import { useAuth } from "./AuthContext";
import type { MethodId } from "./types";
import type { Track } from "./constants/music";

// ─── ActiveBrewSession ────────────────────────────────────────────────────────
export interface ActiveBrewSession {
  phase: "brewing" | "done";
  paused: boolean;
  elapsed: number;
  totalTime: number;
  cups: number;
}

// ─── PendingBrew ──────────────────────────────────────────────────────────────
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

// ─── DB row → local type helpers ──────────────────────────────────────────────

type DbJournal = {
  id: string;
  recipe_title: string | null;
  bean_name: string | null;
  grinder_name: string | null;
  method_id: string | null;
  dose_g_used: number | null;
  water_g_used: number | null;
  temp_c_used: number | null;
  clicks_used: number | null;
  sweetness: number | null;
  acidity: number | null;
  body: number | null;
  bitterness: number | null;
  aftertaste: number | null;
  overall: number | null;
  notes: string | null;
  quick_logged: boolean;
  created_at: string;
};

function dbJournalToLocal(row: DbJournal): JournalEntry {
  const d = new Date(row.created_at);
  const date = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return {
    id: row.id,
    recipeId:    row.recipe_title ?? "unknown",
    recipeTitle: row.recipe_title ?? "Unknown Recipe",
    method:      (row.method_id ?? "v60") as MethodId,
    bean:        row.bean_name ?? "Unknown bean",
    grinder:     row.grinder_name ?? "Unknown grinder",
    date,
    createdAt:   row.created_at,
    dose:        row.dose_g_used ?? undefined,
    water:       row.water_g_used ?? undefined,
    temp:        row.temp_c_used ?? undefined,
    clicks:      row.clicks_used ?? undefined,
    scores: {
      sweetness:  row.sweetness ?? 5,
      acidity:    row.acidity ?? 5,
      body:       row.body ?? 5,
      bitterness: row.bitterness ?? 3,
      aftertaste: row.aftertaste ?? 5,
      overall:    row.overall ?? 7,
    },
    notes:       row.notes ?? "",
    quickLogged: row.quick_logged,
  };
}

type DbBean = {
  id: string;
  name: string | null;
  roaster: string | null;
  origin: string | null;
  roast_level: string | null;
  tasting_notes: string | null;
  source: "scan" | "manual" | "curated";
  image_url: string | null;
  created_at: string;
};

function dbBeanToLocal(row: DbBean): Bean {
  const d = new Date(row.created_at);
  const date = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return {
    id:      row.id,
    name:    row.name ?? row.roaster ?? "Unknown bean",
    roaster: row.roaster ?? "",
    roast:   row.roast_level ?? "Medium",
    notes:   row.tasting_notes ?? "",
    date,
    source:  row.source,
    origin:  row.origin ?? undefined,
    imageUrl: row.image_url ?? undefined,
  };
}

type DbGrinder = {
  id: string;
  name: string;
  clicks_per_1000um: number;
  grinder_type: string;
};

function dbGrinderToLocal(row: DbGrinder): Grinder {
  return {
    id:             row.id,
    name:           row.name,
    clicksPerMicron: row.clicks_per_1000um / 1000,
    type:           (row.grinder_type === "Electric" ? "Electric" : "Hand") as Grinder["type"],
  };
}

// ─── Context shape ────────────────────────────────────────────────────────────
interface AppContextValue {
  grinder: Grinder;
  setGrinder: (g: Grinder) => void;
  availableGrinders: Grinder[];
  addGrinder: (data: { name: string; type: "Hand" | "Electric"; micronsPerClick?: number }) => Promise<Grinder>;
  bean: Bean | null;
  setBean: (b: Bean | null) => void;
  method: Method | null;
  setMethod: (m: Method | null) => void;
  recipe: Recipe | null;
  setRecipe: (r: Recipe | null) => void;
  beanLog: Bean[];
  setBeanLog: (log: Bean[]) => void;
  addBean: (bean: Omit<Bean, "id" | "date">) => Promise<Bean>;
  deleteBean: (id: string) => Promise<void>;
  brewLog: JournalEntry[];
  setBrewLog: (log: JournalEntry[]) => void;
  saveJournalEntry: (entry: JournalEntry) => Promise<JournalEntry | null>;
  settings: UserSettings;
  setSettings: (s: UserSettings) => void;
  settingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
  pendingBrew: PendingBrew | null;
  setPendingBrew: (b: PendingBrew | null) => void;
  pendingTweak: JournalEntry | null;
  setPendingTweak: (e: JournalEntry | null) => void;
  activeBrewSession: ActiveBrewSession | null;
  startBrewSession: (totalTime: number, cups: number) => void;
  toggleBrewPause: () => void;
  clearBrewSession: () => void;
  notifyBrewStep: (label: string) => void;
  // ── Music ──
  musicPlaying: boolean;
  musicMuted: boolean;
  currentTrack: Track | null;
  setCurrentTrack: (t: Track | null) => void;
  playMusic: () => void;
  pauseMusic: () => void;
  toggleMusicMute: () => void;
  // ────────────
  dbLoading: boolean;
  dbError: string | null;
  clearDbError: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  useEffect(() => { initStorage(); }, []);

  const [grinder, setGrinderState] = useState<Grinder>(GRINDERS[0]);
  const setGrinder = useCallback((g: Grinder) => {
    setGrinderState(g);
    set("bbrew_selected_grinder", g.id);
    if (user) {
      supabase.from("profiles")
        .update({ default_grinder_id: g.id })
        .eq("id", user.id)
        .then(({ error }) => {
          if (error) console.error("grinder preference save failed:", error.message);
        });
    }
  }, [user]);
  const [availableGrinders, setAvailableGrinders] = useState<Grinder[]>(GRINDERS);
  const [bean, setBean] = useState<Bean | null>(null);
  const [method, setMethod] = useState<Method | null>(null);
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  const [beanLog, setBeanLogState] = useState<Bean[]>(() => get("bbrew_bean_log", []));
  const [brewLog, setBrewLogState] = useState<JournalEntry[]>(() => get("bbrew_journal", []));
  const [settings, setSettingsState] = useState<UserSettings>(() =>
    get("bbrew_settings", DEFAULT_SETTINGS),
  );

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [pendingBrew, setPendingBrew] = useState<PendingBrew | null>(null);
  const [pendingTweak, setPendingTweak] = useState<JournalEntry | null>(null);
  const [activeBrewSession, setActiveBrewSession] = useState<ActiveBrewSession | null>(null);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicMuted, setMusicMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [dbLoading, setDbLoading] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const clearDbError = useCallback(() => setDbError(null), []);

  // Global brew timer — keeps ticking even when the user navigates away from /brew
  useEffect(() => {
    if (!activeBrewSession || activeBrewSession.phase !== "brewing" || activeBrewSession.paused) return;
    const id = setInterval(() => {
      setActiveBrewSession(prev => {
        if (!prev || prev.phase !== "brewing" || prev.paused) return prev;
        const next = prev.elapsed + 1;
        if (next >= prev.totalTime) return { ...prev, elapsed: prev.totalTime, phase: "done" };
        return { ...prev, elapsed: next };
      });
    }, 1000);
    return () => clearInterval(id);
  }, [activeBrewSession?.phase, activeBrewSession?.paused]);

  const playMusic = useCallback(() => setMusicPlaying(true), []);
  const pauseMusic = useCallback(() => setMusicPlaying(false), []);
  const toggleMusicMute = useCallback(() => setMusicMuted(prev => !prev), []);

  const startBrewSession = useCallback((totalTime: number, cups: number) => {
    setActiveBrewSession({ phase: "brewing", paused: false, elapsed: 0, totalTime, cups });
    if (settings.musicAuto) setMusicPlaying(true);
  }, [settings.musicAuto]);

  const toggleBrewPause = useCallback(() => {
    setActiveBrewSession(prev => prev ? { ...prev, paused: !prev.paused } : null);
  }, []);

  const clearBrewSession = useCallback(() => {
    setActiveBrewSession(null);
    setMusicPlaying(false);
  }, []);

  // Notify when brew completes
  useEffect(() => {
    if (activeBrewSession?.phase === "done" && settings.notifications) {
      if (Notification.permission === "granted") {
        new Notification("Your brew is ready! ☕", { body: "Tap to log your rating." });
      }
    }
  }, [activeBrewSession?.phase, settings.notifications]);

  // Local brew-step notification (called by Brew.tsx when step changes)
  const notifyBrewStep = useCallback((label: string) => {
    if (!settings.notifications) return;
    if (Notification.permission !== "granted") return;
    new Notification("Next step", { body: label, silent: true });
  }, [settings.notifications]);

  // Register Web Push subscription when notifications are enabled
  useEffect(() => {
    if (!user || !settings.notifications) return;
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

    const register = async () => {
      const perm = await Notification.requestPermission();
      if (perm !== "granted") return;

      const registration = await navigator.serviceWorker.ready;
      const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined;
      if (!vapidKey) return;

      let sub = await registration.pushManager.getSubscription();
      if (!sub) {
        sub = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: vapidKey,
        });
      }

      const { endpoint, keys } = sub.toJSON() as {
        endpoint: string;
        keys: { p256dh: string; auth: string };
      };

      await supabase.functions.invoke("subscribe-push", {
        body: { endpoint, p256dh: keys.p256dh, auth: keys.auth },
      });
    };

    void register();
  }, [user, settings.notifications]);

  // Load all user data from DB on login
  useEffect(() => {
    if (!user) return;

    setDbLoading(true);

    Promise.all([
      // Profile / settings
      supabase
        .from("profiles")
        .select("display_name, units, temperature_unit, auto_play_music, step_notifications, default_grinder_id")
        .eq("id", user.id)
        .single(),

      // Journal entries — newest first
      supabase
        .from("journal_entries")
        .select("id, recipe_title, bean_name, grinder_name, method_id, dose_g_used, water_g_used, temp_c_used, clicks_used, sweetness, acidity, body, bitterness, aftertaste, overall, notes, quick_logged, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),

      // Bean log
      supabase
        .from("beans")
        .select("id, name, roaster, origin, roast_level, tasting_notes, source, image_url, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),

      // Grinders — curated (user_id is null) + user's custom
      supabase
        .from("grinders")
        .select("id, name, clicks_per_1000um, grinder_type")
        .or(`user_id.is.null,user_id.eq.${user.id}`)
        .order("created_at", { ascending: true }),
    ]).then(([profileRes, journalRes, beansRes, grindersRes]) => {
      if (profileRes.error) console.error("profile load:", profileRes.error.message);
      if (profileRes.data) {
        const d = profileRes.data;
        setSettingsState(prev => ({
          ...prev,
          name:          d.display_name ?? prev.name,
          units:         (d.units as UserSettings["units"]) ?? prev.units,
          tempUnit:      (d.temperature_unit?.toUpperCase() as UserSettings["tempUnit"]) ?? prev.tempUnit,
          // Prefer whichever source has it enabled — DB is authoritative once saved,
          // but we don't let a stale DB `false` stomp a locally-confirmed `true`.
          musicAuto:     d.auto_play_music || prev.musicAuto,
          notifications: d.step_notifications ?? prev.notifications,
        }));
      }

      if (journalRes.data) {
        const entries = journalRes.data.map(dbJournalToLocal);
        setBrewLogState(entries);
        set("bbrew_journal", entries);
      }

      if (beansRes.data) {
        const beans = beansRes.data.map(dbBeanToLocal);
        setBeanLogState(beans);
        set("bbrew_bean_log", beans);
      }

      if (grindersRes.data && grindersRes.data.length > 0) {
        const grinders = grindersRes.data.map(dbGrinderToLocal);
        setAvailableGrinders(grinders);
        // DB default_grinder_id is the cross-device source of truth.
        // Fall back to localStorage cache, then to first in list.
        const dbDefaultId   = profileRes.data?.default_grinder_id ?? null;
        const localDefaultId = get("bbrew_selected_grinder", "");
        const preferredId   = dbDefaultId ?? localDefaultId;
        const resolved      = grinders.find(g => g.id === preferredId) ?? grinders[0];
        setGrinderState(resolved);
        set("bbrew_selected_grinder", resolved.id);
      }

      setDbLoading(false);
    });
  }, [user]);

  // ─── Write-through helpers ─────────────────────────────────────────────────

  const setBeanLog = (log: Bean[]) => {
    setBeanLogState(log);
    set("bbrew_bean_log", log);
  };

  const setBrewLog = useCallback((log: JournalEntry[]) => {
    setBrewLogState(log);
    set("bbrew_journal", log);
  }, []);

  const setSettings = (s: UserSettings) => {
    setSettingsState(s);
    set("bbrew_settings", s);
    if (user) {
      supabase.from("profiles").upsert({
        id:                 user.id,
        display_name:       s.name,
        units:              s.units,
        temperature_unit:   s.tempUnit.toLowerCase() as "c" | "f",
        auto_play_music:    s.musicAuto,
        step_notifications: s.notifications,
      }, { onConflict: "id" }).then(({ error }) => {
        if (error) console.error("profile save failed:", error.message);
      });
    }
  };

  // ─── DB mutations ──────────────────────────────────────────────────────────

  const saveJournalEntry = useCallback(async (entry: JournalEntry): Promise<JournalEntry | null> => {
    const isUpdate = !!entry.id && brewLog.some(e => e.id === entry.id);

    // Optimistic update — rolled back in the error path below if DB write fails
    if (isUpdate) {
      setBrewLog(brewLog.map(e => e.id === entry.id ? entry : e));
    } else {
      setBrewLog([entry, ...brewLog]);
    }

    if (!user) return entry;

    if (isUpdate) {
      const { data, error } = await supabase
        .from("journal_entries")
        .update({
          sweetness:    entry.scores.sweetness,
          acidity:      entry.scores.acidity,
          body:         entry.scores.body,
          bitterness:   entry.scores.bitterness,
          aftertaste:   entry.scores.aftertaste,
          overall:      entry.scores.overall,
          notes:        entry.notes || null,
          quick_logged: entry.quickLogged,
          recipe_title: entry.recipeTitle,
          bean_name:    entry.bean,
          grinder_name: entry.grinder,
          method_id:    entry.method,
          dose_g_used:  entry.dose ?? null,
          water_g_used: entry.water ?? null,
          temp_c_used:  entry.temp ?? null,
          clicks_used:  entry.clicks ?? null,
        })
        .eq("id", entry.id)
        .select()
        .single();

      if (error) { console.error("journal update failed:", error.message); setDbError(error.message); return null; }
      if (!data) return entry;
      const updated = dbJournalToLocal(data as unknown as DbJournal);
      setBrewLog(brewLog.map(e => e.id === entry.id ? updated : e));
      return updated;
    } else {
      const { data, error } = await supabase
        .from("journal_entries")
        .insert({
          user_id:      user.id,
          sweetness:    entry.scores.sweetness,
          acidity:      entry.scores.acidity,
          body:         entry.scores.body,
          bitterness:   entry.scores.bitterness,
          aftertaste:   entry.scores.aftertaste,
          overall:      entry.scores.overall,
          notes:        entry.notes || null,
          quick_logged: entry.quickLogged,
          recipe_title: entry.recipeTitle,
          bean_name:    entry.bean,
          grinder_name: entry.grinder,
          method_id:    entry.method,
          dose_g_used:  entry.dose ?? null,
          water_g_used: entry.water ?? null,
          temp_c_used:  entry.temp ?? null,
          clicks_used:  entry.clicks ?? null,
        })
        .select()
        .single();

      if (error) {
        console.error("journal insert failed:", error.message);
        setDbError(error.message);
        // Roll back optimistic update so localStorage stays in sync with DB
        setBrewLog(brewLog.filter(e => e.id !== entry.id));
        return null;
      }
      if (!data) return entry;
      const saved = dbJournalToLocal(data as unknown as DbJournal);
      // Replace temp entry with the DB-assigned UUID and sync localStorage
      setBrewLog([saved, ...brewLog.filter(e => e.id !== entry.id)]);
      return saved;
    }
  }, [user, brewLog, setBrewLog]);

  const addBean = useCallback(async (beanData: Omit<Bean, "id" | "date">): Promise<Bean> => {
    const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const optimistic: Bean = { ...beanData, id: `temp-${Date.now()}`, date: today };
    setBeanLogState(prev => [optimistic, ...prev]);

    if (!user) return optimistic;

    const { data, error } = await supabase
      .from("beans")
      .insert({
        user_id:       user.id,
        name:          beanData.name,
        roaster:       beanData.roaster || null,
        origin:        beanData.origin ?? null,
        roast_level:   beanData.roast || null,
        tasting_notes: beanData.notes || null,
        source:        beanData.source,
        image_url:     beanData.imageUrl ?? null,
      })
      .select()
      .single();

    if (error || !data) return optimistic;
    const saved = dbBeanToLocal(data as unknown as DbBean);
    setBeanLogState(prev => [saved, ...prev.filter(b => b.id !== optimistic.id)]);
    set("bbrew_bean_log", [saved, ...beanLog.filter(b => b.id !== optimistic.id)]);
    return saved;
  }, [user, beanLog]);

  const deleteBean = useCallback(async (id: string): Promise<void> => {
    setBeanLogState(prev => prev.filter(b => b.id !== id));
    if (!user) return;
    await supabase.from("beans").delete().eq("id", id);
  }, [user]);

  const addGrinder = useCallback(async (data: { name: string; type: "Hand" | "Electric"; micronsPerClick?: number }): Promise<Grinder> => {
    // If user provided microns-per-click, convert. Otherwise fall back to type defaults.
    // Hand default ≈ Comandante C40 (~30 µm/click). Electric default ≈ Baratza Encore (~40 µm/click).
    const fallback = data.type === "Hand" ? 0.033 : 0.025;
    const clicksPerMicron = data.micronsPerClick && data.micronsPerClick > 0
      ? 1 / data.micronsPerClick
      : fallback;
    const optimistic: Grinder = { id: `custom-${Date.now()}`, name: data.name, clicksPerMicron, type: data.type };
    setAvailableGrinders(prev => [...prev, optimistic]);

    if (!user) return optimistic;

    const { data: row, error } = await supabase
      .from("grinders")
      .insert({ user_id: user.id, name: data.name, clicks_per_1000um: clicksPerMicron * 1000, grinder_type: data.type })
      .select()
      .single();

    if (error || !row) return optimistic;
    const saved = dbGrinderToLocal(row as unknown as DbGrinder);
    setAvailableGrinders(prev => [...prev.filter(g => g.id !== optimistic.id), saved]);
    return saved;
  }, [user]);

  return (
    <AppContext.Provider value={{
      grinder, setGrinder,
      availableGrinders, addGrinder,
      bean, setBean,
      method, setMethod,
      recipe, setRecipe,
      beanLog, setBeanLog,
      addBean, deleteBean,
      brewLog, setBrewLog,
      saveJournalEntry,
      settings, setSettings,
      settingsOpen, setSettingsOpen,
      pendingBrew, setPendingBrew,
      pendingTweak, setPendingTweak,
      activeBrewSession,
      startBrewSession, toggleBrewPause, clearBrewSession, notifyBrewStep,
      musicPlaying, musicMuted, currentTrack, setCurrentTrack,
      playMusic, pauseMusic, toggleMusicMute,
      dbLoading,
      dbError, clearDbError,
    }}>
      {children}
    </AppContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
// eslint-disable-next-line react-refresh/only-export-components
export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used inside AppProvider");
  return ctx;
}
