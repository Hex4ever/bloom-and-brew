import type { JournalEntry, RatingAxes } from "../types";

// -------------------------------------------------------------------------
// Tunable constants — change these in one place rather than hunting strings
// -------------------------------------------------------------------------
const BITTER_THRESHOLD    = 7;   // bitterness score ≥ this → over-extracted
const SOUR_BITTER_MAX     = 3;   // bitterness ≤ this (paired with high acidity)
const SOUR_ACIDITY_MIN    = 7;   // acidity ≥ this → under-extracted
const SOUR_SWEET_MAX      = 5;
const THIN_BODY_MAX       = 3;
const MUDDY_BODY_MIN      = 8;
const MUDDY_BITTER_MIN    = 6;
const SWEET_LOW_MAX       = 4;
const ACID_HIGH_MIN       = 8;
const ACID_BITTER_MAX     = 4;
const ACID_SWEET_MAX      = 6;
const AFTERTASTE_LOW_MAX  = 4;
const GREAT_OVERALL_MIN   = 8;
const MEDIOCRE_OVERALL_MAX = 7;

const TEMP_DROP    = 2;   // °C to drop for over-extraction
const TEMP_RAISE   = 2;   // °C to raise for under-extraction / thin acidity
const RATIO_DROP   = 0.92; // water multiplier for "stronger ratio"
const RATIO_STRONG = 0.94; // water multiplier for "test stronger pour"

export type TweakAxis =
  | "Grind"
  | "Temp"
  | "Time"
  | "Ratio"
  | "Bean"
  | "Filter"
  | "Technique"
  | "Water"
  | "Repeat"
  | "Variation";

export interface TweakSuggestion {
  axis: TweakAxis;
  change: string;
  why: string;
}

export interface TweakResult {
  diagnoses: string[];
  suggestions: TweakSuggestion[];
}

/**
 * Rule-based recipe coach.
 * Reads a JournalEntry's score profile and brew parameters, returns
 * a primary diagnosis string + concrete suggestions with numbers derived
 * from the entry's actual values (not hard-coded strings).
 */
export function generateTweaks(entry: JournalEntry): TweakResult {
  const s: RatingAxes = entry.scores;
  const diagnoses: string[] = [];
  const suggestions: TweakSuggestion[] = [];

  const temp    = entry.temp    ?? 95;
  const water   = entry.water   ?? 250;

  // ------------------------------------------------------------------
  // OVER-EXTRACTED: high bitterness
  // ------------------------------------------------------------------
  if (s.bitterness >= BITTER_THRESHOLD) {
    diagnoses.push("Over-extracted — water pulled too much from the grounds.");
    suggestions.push({
      axis: "Grind",
      change: "Coarser",
      why: "Try 1-2 clicks coarser. Bigger particles slow extraction.",
    });
    suggestions.push({
      axis: "Temp",
      change: `Drop to ${Math.max(85, temp - TEMP_DROP)}°C`,
      why: "Cooler water extracts less aggressively.",
    });
    suggestions.push({
      axis: "Time",
      change: "Pour faster",
      why: "Less contact time = less bitterness pulled.",
    });
  }

  // ------------------------------------------------------------------
  // UNDER-EXTRACTED: sour/sharp without sweetness
  // ------------------------------------------------------------------
  if (
    s.bitterness <= SOUR_BITTER_MAX &&
    s.acidity    >= SOUR_ACIDITY_MIN &&
    s.sweetness  <= SOUR_SWEET_MAX
  ) {
    diagnoses.push("Under-extracted — sour, sharp, lacking sweetness.");
    suggestions.push({
      axis: "Grind",
      change: "Finer",
      why: "Try 1-2 clicks finer. Smaller particles extract more.",
    });
    suggestions.push({
      axis: "Temp",
      change: `Up to ${Math.min(99, temp + TEMP_RAISE)}°C`,
      why: "Hotter water dissolves more compounds.",
    });
    suggestions.push({
      axis: "Time",
      change: "Pour slower",
      why: "More contact time builds sweetness and body.",
    });
  }

  // ------------------------------------------------------------------
  // THIN BODY
  // ------------------------------------------------------------------
  if (s.body <= THIN_BODY_MAX) {
    diagnoses.push("Body is thin — lacks weight on the palate.");
    suggestions.push({
      axis: "Ratio",
      change: "Stronger",
      why: `Try ${Math.round(water * RATIO_DROP)}g water (drop ratio by 1 point) for more concentration.`,
    });
    if (entry.method === "v60" || entry.method === "chemex") {
      suggestions.push({
        axis: "Technique",
        change: "Less agitation",
        why: "Skip the late swirl — preserves fines that build body.",
      });
    }
  }

  // ------------------------------------------------------------------
  // MUDDY / HEAVY
  // ------------------------------------------------------------------
  if (s.body >= MUDDY_BODY_MIN && s.bitterness >= MUDDY_BITTER_MIN) {
    diagnoses.push("Heavy and muddy — too much sediment and over-extraction.");
    suggestions.push({
      axis: "Grind",
      change: "Coarser",
      why: "Bigger grind = less sediment, cleaner cup.",
    });
    suggestions.push({
      axis: "Filter",
      change: "Pre-rinse longer",
      why: "Removes paper taste and tightens filter pores.",
    });
  }

  // ------------------------------------------------------------------
  // LOW SWEETNESS (only when no other issue found yet)
  // ------------------------------------------------------------------
  if (s.sweetness <= SWEET_LOW_MAX && suggestions.length === 0) {
    diagnoses.push("Lacks sweetness — extraction stopped short of sugars.");
    suggestions.push({
      axis: "Time",
      change: "Extend bloom",
      why: "Try a 45s bloom instead of 30s. CO2 release helps even extraction.",
    });
    suggestions.push({
      axis: "Grind",
      change: "Slightly finer",
      why: "1 click finer to develop more sugar dissolution.",
    });
  }

  // ------------------------------------------------------------------
  // ACIDITY DOMINATES (only when no other issue found yet)
  // ------------------------------------------------------------------
  if (
    s.acidity    >= ACID_HIGH_MIN  &&
    s.bitterness <= ACID_BITTER_MAX &&
    s.sweetness  <= ACID_SWEET_MAX  &&
    suggestions.length === 0
  ) {
    diagnoses.push("Bright but unbalanced — acidity dominates.");
    suggestions.push({
      axis: "Temp",
      change: `Up to ${Math.min(99, temp + 3)}°C`,
      why: "Hotter water mellows acidity.",
    });
    suggestions.push({
      axis: "Bean",
      change: "Try a longer rest",
      why: "If beans are <7 days off-roast, wait a few days. Fresh beans read sour.",
    });
  }

  // ------------------------------------------------------------------
  // SHORT AFTERTASTE
  // ------------------------------------------------------------------
  if (s.aftertaste <= AFTERTASTE_LOW_MAX) {
    diagnoses.push("Aftertaste fades quickly — could be under-developed.");
    suggestions.push({
      axis: "Bean",
      change: "Check freshness",
      why: "Beans past 4 weeks lose finish. Buy with visible roast date.",
    });
    suggestions.push({
      axis: "Water",
      change: "Filtered, not RO",
      why: "Minerals carry flavor. Pure RO water = flat finish.",
    });
  }

  // ------------------------------------------------------------------
  // GREAT BREW
  // ------------------------------------------------------------------
  if (s.overall >= GREAT_OVERALL_MIN && diagnoses.length === 0) {
    diagnoses.push("Excellent cup. Lock this recipe in.");
    suggestions.push({
      axis: "Repeat",
      change: "Save as default",
      why: "Consistency beats novelty. Run this recipe again next session.",
    });
    suggestions.push({
      axis: "Variation",
      change: "Try 1 variable",
      why: "Want to push further? Change ONE thing — temp OR grind, never both.",
    });
  }

  // ------------------------------------------------------------------
  // MEDIOCRE / UNCLEAR
  // ------------------------------------------------------------------
  if (diagnoses.length === 0 && s.overall < MEDIOCRE_OVERALL_MAX) {
    diagnoses.push("Balanced but unmemorable — small dial-in needed.");
    suggestions.push({
      axis: "Bean",
      change: "Different origin",
      why: "Bean might be the limit. Try a different roaster or origin.",
    });
    suggestions.push({
      axis: "Ratio",
      change: "Test a stronger pour",
      why: `Try ${Math.round(water * RATIO_STRONG)}g water for more concentration.`,
    });
  }

  return { diagnoses, suggestions };
}
