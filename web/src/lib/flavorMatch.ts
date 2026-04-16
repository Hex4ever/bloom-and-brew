import type { Recipe, RatingAxes, MethodId } from "../types";

// -------------------------------------------------------------------------
// Flavor keyword → axis delta map
// NOTE: This is a naive substring / whole-word match (see parseFlavorText).
// Precision/recall tradeoffs are intentional for the MVP. When Phase 4 adds
// Claude-powered semantic matching, replace parseFlavorText() with an API call
// that returns the same { target, matched } shape — nothing else needs to change.
// -------------------------------------------------------------------------
type AxisDeltas = Partial<Omit<RatingAxes, "overall">>;

export const FLAVOR_KEYWORDS: Record<string, AxisDeltas> = {
  // Sweet / sugary
  sweet:      { sweetness: +3, bitterness: -1 },
  sugary:     { sweetness: +3 },
  caramel:    { sweetness: +2, body: +1 },
  honey:      { sweetness: +2, acidity: +1 },
  chocolate:  { sweetness: +2, body: +2, bitterness: +1 },
  cocoa:      { body: +2, bitterness: +1 },
  vanilla:    { sweetness: +2 },
  nutty:      { body: +2, sweetness: +1 },
  almond:     { body: +1, sweetness: +1 },
  // Fruity / bright
  fruity:     { acidity: +3, sweetness: +1 },
  fruit:      { acidity: +2, sweetness: +1 },
  berry:      { acidity: +3, sweetness: +1 },
  strawberry: { acidity: +2, sweetness: +2 },
  blueberry:  { acidity: +3, sweetness: +1 },
  citrus:     { acidity: +3 },
  lemon:      { acidity: +3 },
  orange:     { acidity: +2, sweetness: +1 },
  bergamot:   { acidity: +2 },
  tropical:   { acidity: +3, sweetness: +2 },
  mango:      { acidity: +2, sweetness: +2 },
  peach:      { acidity: +1, sweetness: +2 },
  wine:       { acidity: +2, body: +1 },
  juicy:      { acidity: +2, sweetness: +1 },
  bright:     { acidity: +3 },
  crisp:      { acidity: +2 },
  // Floral
  floral:     { acidity: +2, aftertaste: +1 },
  jasmine:    { acidity: +2, aftertaste: +1 },
  tea:        { body: -1, aftertaste: +2 },
  delicate:   { body: -1, acidity: +1 },
  light:      { body: -2, acidity: +1 },
  // Bold / heavy
  bold:       { body: +3, bitterness: +1 },
  strong:     { body: +3 },
  heavy:      { body: +3 },
  full:       { body: +2 },
  rich:       { body: +2, sweetness: +1 },
  robust:     { body: +2, bitterness: +1 },
  bitter:     { bitterness: +3 },
  dark:       { body: +2, bitterness: +2 },
  smoky:      { bitterness: +2, body: +1 },
  earthy:     { body: +2, bitterness: +1 },
  // Balance / smooth
  balanced:   { sweetness: +1, acidity: 0, body: +1 },
  smooth:     { bitterness: -2, body: +1 },
  clean:      { bitterness: -1, aftertaste: +1 },
  mellow:     { acidity: -2, bitterness: -1 },
  creamy:     { body: +2, sweetness: +1 },
  silky:      { body: +1, aftertaste: +1 },
  // Avoid
  sour:       { acidity: -3 },
  weak:       { body: -3 },
  thin:       { body: -3 },
  watery:     { body: -3 },
  harsh:      { bitterness: -2 },
  ashy:       { bitterness: -3 },
};

// -------------------------------------------------------------------------
// Method-specific profile modifiers (matches prototype exactly)
// -------------------------------------------------------------------------
const METHOD_MODIFIERS: Partial<Record<MethodId, AxisDeltas>> = {
  v60:        { acidity: +2, aftertaste: +2, body: -1 },
  chemex:     { acidity: +1, aftertaste: +2, body: -2 },
  aeropress:  { body: +1, sweetness: +1, bitterness: -1 },
  french:     { body: +3, bitterness: +1, aftertaste: -1 },
  moka:       { body: +2, bitterness: +2, sweetness: -1 },
  espresso:   { body: +3, bitterness: +2, sweetness: +1 },
  latte:      { body: +2, sweetness: +2, bitterness: -2, acidity: -2 },
  cappuccino: { body: +2, sweetness: +2, bitterness: -1, acidity: -1 },
  flatwhite:  { body: +2, sweetness: +1, bitterness: -1, acidity: -1 },
};

type ProfileAxes = Omit<RatingAxes, "overall">;
const PROFILE_KEYS: (keyof ProfileAxes)[] = [
  "sweetness", "acidity", "body", "bitterness", "aftertaste",
];

function clamp(n: number): number {
  return Math.max(0, Math.min(10, n));
}

/** Infer a recipe's implied flavor profile from its parameters and brew method. */
export function recipeProfile(recipe: Recipe, methodId: MethodId): ProfileAxes {
  const ratio = recipe.water / recipe.dose;
  const p: ProfileAxes = { sweetness: 5, acidity: 5, body: 5, bitterness: 5, aftertaste: 5 };

  // Ratio: tighter = stronger, more body, more bitterness
  if      (ratio < 13) { p.body += 3; p.bitterness += 2; p.sweetness -= 1; }
  else if (ratio < 15) { p.body += 1; p.bitterness += 1; }
  else if (ratio > 17) { p.body -= 2; p.acidity += 1; }

  // Temperature
  if      (recipe.temp >= 96) { p.acidity += 1; p.bitterness += 1; p.sweetness += 1; }
  else if (recipe.temp <= 90) { p.acidity -= 2; p.sweetness += 1; p.bitterness -= 1; }

  // Method modifier
  const mod = METHOD_MODIFIERS[methodId];
  if (mod) {
    for (const k of PROFILE_KEYS) {
      if (mod[k] != null) p[k] = clamp(p[k] + (mod[k] as number));
    }
  }

  // Final clamp
  for (const k of PROFILE_KEYS) p[k] = clamp(p[k]);
  return p;
}

export interface ParseResult {
  target: ProfileAxes;
  matched: string[];
  /** raw deltas before baseline offset — useful for debugging */
  delta: ProfileAxes;
}

/** Parse a free-text flavor query into a target profile + matched keywords list. */
export function parseFlavorText(text: string): ParseResult {
  const t = text.toLowerCase();
  const delta: ProfileAxes = { sweetness: 0, acidity: 0, body: 0, bitterness: 0, aftertaste: 0 };
  const matched: string[] = [];

  for (const [word, effects] of Object.entries(FLAVOR_KEYWORDS)) {
    const re = new RegExp(`\\b${word}\\b`, "i");
    if (re.test(t)) {
      matched.push(word);
      for (const [axis, v] of Object.entries(effects)) {
        (delta as Record<string, number>)[axis] += v as number;
      }
    }
  }

  const target: ProfileAxes = { sweetness: 0, acidity: 0, body: 0, bitterness: 0, aftertaste: 0 };
  for (const k of PROFILE_KEYS) {
    target[k] = clamp(5 + delta[k]);
  }

  return { target, matched, delta };
}

export interface FlavorMatchResult {
  recipe: Recipe;
  methodId: MethodId;
  score: number;
  profile: ProfileAxes;
  matchedKeywords: string[];
}

/**
 * Rank all recipes (or a single method's recipes) against a target profile.
 *
 * @param query - free-text flavor description
 * @param recipes - map of methodId → Recipe[]
 * @param methodId - optional: restrict to one method
 * @param topN - how many results to return (default 3)
 */
export function flavorMatch(
  query: string,
  recipes: Partial<Record<MethodId, Recipe[]>>,
  methodId?: MethodId,
  topN = 3,
): FlavorMatchResult[] {
  const parsed = parseFlavorText(query);

  // Low-confidence guard: if nothing matched, return empty
  if (parsed.matched.length === 0) return [];

  const pool: FlavorMatchResult[] = [];
  for (const [mId, recipeList] of Object.entries(recipes) as [MethodId, Recipe[]][]) {
    if (methodId && mId !== methodId) continue;
    for (const r of recipeList) {
      const profile = recipeProfile(r, mId);
      let distance = 0;
      for (const k of PROFILE_KEYS) {
        distance += Math.pow(profile[k] - parsed.target[k], 2);
      }
      const ratingBoost = (r.rating - 4.0) * 0.5;
      const score = -Math.sqrt(distance) + ratingBoost;
      pool.push({ recipe: r, methodId: mId, score, profile, matchedKeywords: parsed.matched });
    }
  }

  pool.sort((a, b) => b.score - a.score);
  return pool.slice(0, topN);
}
