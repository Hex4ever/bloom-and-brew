import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  SCHEMA_VERSION,
  initStorage,
  get,
  set,
  remove,
  clearAll,
} from "./storage";
import type { JournalEntry, UserSettings } from "../types";

// ─── Minimal localStorage stub ─────────────────────────────────────────────
function makeLocalStorageStub() {
  const store = new Map<string, string>();
  return {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => { store.set(key, value); }),
    removeItem: vi.fn((key: string) => { store.delete(key); }),
    clear: vi.fn(() => { store.clear(); }),
    get _store() { return store; },
  };
}

// ─── Test fixtures ─────────────────────────────────────────────────────────
const SETTINGS: UserSettings = {
  name: "Test User",
  units: "metric",
  tempUnit: "C",
  musicAuto: false,
  notifications: false,
};

const ENTRY: JournalEntry = {
  id: "j1",
  recipeId: "r1",
  recipeTitle: "V60 Light",
  method: "v60",
  bean: "Blue Tokai",
  grinder: "c40",
  date: "2026-04-17",
  dose: 15,
  water: 250,
  temp: 93,
  clicks: 24,
  scores: { sweetness: 7, acidity: 6, body: 6, bitterness: 4, aftertaste: 7, overall: 7 },
  notes: "",
  quickLogged: false,
};

// ─── Tests ─────────────────────────────────────────────────────────────────

describe("storage — initStorage", () => {
  let ls: ReturnType<typeof makeLocalStorageStub>;

  beforeEach(() => {
    ls = makeLocalStorageStub();
    vi.stubGlobal("localStorage", ls);
  });

  it("sets the schema version key on first run", () => {
    initStorage();
    expect(ls.setItem).toHaveBeenCalledWith("bbrew_schema_version", String(SCHEMA_VERSION));
  });

  it("does nothing when version already matches", () => {
    ls._store.set("bbrew_schema_version", String(SCHEMA_VERSION));
    initStorage();
    // setItem should NOT be called again
    expect(ls.setItem).not.toHaveBeenCalled();
    expect(ls.removeItem).not.toHaveBeenCalled();
  });

  it("wipes data keys when stored version is stale", () => {
    ls._store.set("bbrew_schema_version", "0");
    ls._store.set("bbrew_journal", "[]");
    ls._store.set("bbrew_settings", "{}");
    initStorage();
    expect(ls.removeItem).toHaveBeenCalledWith("bbrew_journal");
    expect(ls.removeItem).toHaveBeenCalledWith("bbrew_settings");
  });

  it("resets the version key after a wipe", () => {
    ls._store.set("bbrew_schema_version", "999");
    initStorage();
    expect(ls.setItem).toHaveBeenCalledWith("bbrew_schema_version", String(SCHEMA_VERSION));
  });
});

describe("storage — get", () => {
  let ls: ReturnType<typeof makeLocalStorageStub>;

  beforeEach(() => {
    ls = makeLocalStorageStub();
    vi.stubGlobal("localStorage", ls);
  });

  it("returns fallback when key is absent", () => {
    const result = get("bbrew_settings", SETTINGS);
    expect(result).toEqual(SETTINGS);
  });

  it("returns parsed value when key exists", () => {
    ls._store.set("bbrew_settings", JSON.stringify(SETTINGS));
    expect(get("bbrew_settings", { ...SETTINGS, name: "fallback" })).toEqual(SETTINGS);
  });

  it("returns fallback on malformed JSON", () => {
    ls._store.set("bbrew_settings", "not-json{{{");
    expect(get("bbrew_settings", SETTINGS)).toEqual(SETTINGS);
  });

  it("handles array values (journal)", () => {
    const entries: JournalEntry[] = [ENTRY];
    ls._store.set("bbrew_journal", JSON.stringify(entries));
    expect(get("bbrew_journal", [])).toEqual(entries);
  });

  it("returns empty array fallback when journal is absent", () => {
    expect(get("bbrew_journal", [])).toEqual([]);
  });

  it("handles string values (selected grinder)", () => {
    ls._store.set("bbrew_selected_grinder", JSON.stringify("c40"));
    expect(get("bbrew_selected_grinder", "")).toBe("c40");
  });
});

describe("storage — set", () => {
  let ls: ReturnType<typeof makeLocalStorageStub>;

  beforeEach(() => {
    ls = makeLocalStorageStub();
    vi.stubGlobal("localStorage", ls);
  });

  it("serialises a settings object to JSON", () => {
    set("bbrew_settings", SETTINGS);
    expect(ls.setItem).toHaveBeenCalledWith("bbrew_settings", JSON.stringify(SETTINGS));
  });

  it("serialises a journal array to JSON", () => {
    const entries: JournalEntry[] = [ENTRY];
    set("bbrew_journal", entries);
    expect(ls.setItem).toHaveBeenCalledWith("bbrew_journal", JSON.stringify(entries));
  });

  it("round-trips through get after set", () => {
    set("bbrew_settings", SETTINGS);
    expect(get("bbrew_settings", { ...SETTINGS, name: "fallback" })).toEqual(SETTINGS);
  });

  it("round-trips a string key", () => {
    set("bbrew_selected_recipe", "chemex-light");
    expect(get("bbrew_selected_recipe", "")).toBe("chemex-light");
  });
});

describe("storage — remove", () => {
  let ls: ReturnType<typeof makeLocalStorageStub>;

  beforeEach(() => {
    ls = makeLocalStorageStub();
    vi.stubGlobal("localStorage", ls);
  });

  it("removes an existing key", () => {
    ls._store.set("bbrew_selected_grinder", JSON.stringify("jx"));
    remove("bbrew_selected_grinder");
    expect(get("bbrew_selected_grinder", "fallback")).toBe("fallback");
  });

  it("is a no-op for a key that was never set", () => {
    expect(() => remove("bbrew_selected_bean")).not.toThrow();
  });
});

describe("storage — clearAll", () => {
  let ls: ReturnType<typeof makeLocalStorageStub>;

  beforeEach(() => {
    ls = makeLocalStorageStub();
    vi.stubGlobal("localStorage", ls);
  });

  it("wipes all data keys", () => {
    ls._store.set("bbrew_journal", "[]");
    ls._store.set("bbrew_settings", "{}");
    ls._store.set("bbrew_selected_grinder", '"c40"');
    clearAll();
    expect(get("bbrew_journal", [])).toEqual([]);
    expect(get("bbrew_settings", SETTINGS)).toEqual(SETTINGS);
    expect(get("bbrew_selected_grinder", "fallback")).toBe("fallback");
  });

  it("does NOT remove the schema version sentinel", () => {
    ls._store.set("bbrew_schema_version", String(SCHEMA_VERSION));
    clearAll();
    expect(ls._store.get("bbrew_schema_version")).toBe(String(SCHEMA_VERSION));
  });
});
