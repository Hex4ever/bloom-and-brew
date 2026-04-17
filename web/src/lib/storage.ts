import type { JournalEntry, UserSettings } from "../types";

// ─── Schema version ────────────────────────────────────────────────────────
// Bump this whenever a stored type's shape changes in a breaking way.
// On a version mismatch all bbrew_ keys are wiped so the app starts fresh
// rather than silently deserialising corrupted data.
export const SCHEMA_VERSION = 1;

const VERSION_KEY = "bbrew_schema_version";

// ─── Typed key registry ────────────────────────────────────────────────────
// Add new keys here as new features land.  The generic helpers below only
// accept keys from this union, preventing stringly-typed access.

export interface StorageSchema {
  bbrew_journal: JournalEntry[];
  bbrew_settings: UserSettings;
  bbrew_selected_grinder: string;   // grinder.id
  bbrew_selected_bean: string;      // free-text bean name last used
  bbrew_selected_recipe: string;    // recipeId last used
}

export type StorageKey = keyof StorageSchema;

// All data keys (everything except the version sentinel)
const DATA_KEYS: StorageKey[] = [
  "bbrew_journal",
  "bbrew_settings",
  "bbrew_selected_grinder",
  "bbrew_selected_bean",
  "bbrew_selected_recipe",
];

// ─── Schema migration ──────────────────────────────────────────────────────
/**
 * Call once at app startup.  If the stored schema version differs from
 * SCHEMA_VERSION all data keys are removed and the version is reset, so the
 * app boots into a clean state rather than crashing on stale data shapes.
 */
export function initStorage(): void {
  const stored = localStorage.getItem(VERSION_KEY);
  if (stored === String(SCHEMA_VERSION)) return;

  // Version mismatch (or first ever run) — wipe data keys
  for (const key of DATA_KEYS) {
    localStorage.removeItem(key);
  }
  localStorage.setItem(VERSION_KEY, String(SCHEMA_VERSION));
}

// ─── Generic typed helpers ─────────────────────────────────────────────────

/**
 * Read a value from localStorage, returning `fallback` on miss or parse error.
 */
export function get<K extends StorageKey>(
  key: K,
  fallback: StorageSchema[K],
): StorageSchema[K] {
  const raw = localStorage.getItem(key);
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as StorageSchema[K];
  } catch {
    return fallback;
  }
}

/**
 * Write a value to localStorage as JSON.
 */
export function set<K extends StorageKey>(
  key: K,
  value: StorageSchema[K],
): void {
  localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Remove a key from localStorage.
 */
export function remove(key: StorageKey): void {
  localStorage.removeItem(key);
}

/**
 * Remove all bbrew_ data keys (does NOT reset the schema version sentinel).
 * Useful for a "clear all data" user action.
 */
export function clearAll(): void {
  for (const key of DATA_KEYS) {
    localStorage.removeItem(key);
  }
}
