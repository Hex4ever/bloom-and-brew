import { describe, it, expect } from "vitest";
import { parseFlavorText, flavorMatch, recipeProfile } from "./flavorMatch";
import type { Recipe, MethodId } from "../types";

// Minimal recipe factory
function mkRecipe(overrides: Partial<Recipe> = {}): Recipe {
  return {
    id:      "r1",
    title:   "Test Recipe",
    author:  "Test",
    rating:  4.5,
    dose:    15,
    water:   240,   // ratio 16 → neutral body
    temp:    93,
    microns: 600,
    hasMilk: false,
    steps:   [],
    ...overrides,
  };
}

const RECIPES: Partial<Record<MethodId, Recipe[]>> = {
  v60: [
    mkRecipe({ id: "v1", title: "Bright V60",      water: 250, temp: 95, rating: 4.8 }),
    mkRecipe({ id: "v2", title: "Sweet V60",        water: 240, temp: 93, rating: 4.5 }),
    mkRecipe({ id: "v3", title: "Chocolatey V60",   water: 220, temp: 90, rating: 4.2 }),  // ratio 14.7, lower temp
  ],
  french: [
    mkRecipe({ id: "f1", title: "Bold French",      water: 200, temp: 95, rating: 4.6 }),  // ratio 13.3
    mkRecipe({ id: "f2", title: "Smooth French",    water: 240, temp: 92, rating: 4.4 }),
  ],
};

describe("parseFlavorText", () => {
  it("parses known keywords", () => {
    const r = parseFlavorText("bright and fruity");
    expect(r.matched).toContain("bright");
    expect(r.matched).toContain("fruity");
  });

  it("builds target profile with acidity > neutral for bright+fruity", () => {
    const r = parseFlavorText("bright and fruity");
    // bright: acidity+3; fruity: acidity+3, sweetness+1 → acidity delta = +6, clamped to 10
    expect(r.target.acidity).toBe(10);
    expect(r.target.sweetness).toBeGreaterThan(5);
  });

  it("unknown words do not match anything", () => {
    const r = parseFlavorText("xyxzqq blorp");
    expect(r.matched).toHaveLength(0);
  });

  it("case-insensitive", () => {
    const r = parseFlavorText("SWEET Bold");
    expect(r.matched).toContain("sweet");
    expect(r.matched).toContain("bold");
  });

  it("avoids partial matches (e.g. 'berry' inside 'blueberry' should not double-count)", () => {
    // "blueberry" and "berry" are both separate keywords with separate regex
    // both should match "blueberry" text
    const r = parseFlavorText("blueberry");
    expect(r.matched).toContain("blueberry");
    // "berry" regex \bberry\b should NOT match inside "blueberry"
    expect(r.matched).not.toContain("berry");
  });

  it("'sour' pushes acidity below neutral", () => {
    const r = parseFlavorText("not sour please");
    expect(r.target.acidity).toBeLessThan(5);
  });

  it("neutral text (no keywords) returns empty matched", () => {
    const r = parseFlavorText("a nice cup of coffee");
    expect(r.matched).toHaveLength(0);
  });
});

describe("flavorMatch", () => {
  it("returns empty array for unrecognised query", () => {
    const results = flavorMatch("xyzzy blorp", RECIPES);
    expect(results).toHaveLength(0);
  });

  it("returns top-3 by default", () => {
    const results = flavorMatch("bright and fruity", RECIPES);
    expect(results.length).toBeLessThanOrEqual(3);
    expect(results.length).toBeGreaterThan(0);
  });

  it("results are sorted descending by score", () => {
    const results = flavorMatch("bright and fruity", RECIPES);
    for (let i = 0; i < results.length - 1; i++) {
      expect(results[i].score).toBeGreaterThanOrEqual(results[i + 1].score);
    }
  });

  it("method filter restricts to that method only", () => {
    const results = flavorMatch("bold and strong", RECIPES, "french");
    for (const r of results) {
      expect(r.methodId).toBe("french");
    }
  });

  it("method filter returns fewer results than unfiltered", () => {
    const all    = flavorMatch("bold", RECIPES);
    const french = flavorMatch("bold", RECIPES, "french");
    expect(french.length).toBeLessThanOrEqual(all.length);
  });

  it("includes matchedKeywords in results", () => {
    const results = flavorMatch("sweet and creamy", RECIPES);
    expect(results[0].matchedKeywords).toContain("sweet");
    expect(results[0].matchedKeywords).toContain("creamy");
  });

  it("topN=1 returns at most 1 result", () => {
    const results = flavorMatch("bright", RECIPES, undefined, 1);
    expect(results.length).toBeLessThanOrEqual(1);
  });

  it("ordering is stable: higher-rated recipe wins ties at same distance", () => {
    // Two identical recipes except rating — higher rating should rank first
    const tied: Partial<Record<MethodId, Recipe[]>> = {
      v60: [
        mkRecipe({ id: "low",  rating: 4.0 }),
        mkRecipe({ id: "high", rating: 5.0 }),
      ],
    };
    const results = flavorMatch("sweet", tied);
    if (results.length >= 2) {
      expect(results[0].recipe.id).toBe("high");
    }
  });
});

describe("recipeProfile", () => {
  it("higher temp boosts acidity and bitterness", () => {
    const hot  = recipeProfile(mkRecipe({ temp: 97 }), "v60");
    const cold = recipeProfile(mkRecipe({ temp: 89 }), "v60");
    expect(hot.bitterness).toBeGreaterThan(cold.bitterness);
    expect(hot.acidity).toBeGreaterThan(cold.acidity);
  });

  it("tight ratio boosts body and bitterness", () => {
    const tight = recipeProfile(mkRecipe({ water: 180 }), "aeropress"); // ratio 12 < 13
    const loose = recipeProfile(mkRecipe({ water: 280 }), "aeropress"); // ratio 18.6 > 17
    expect(tight.body).toBeGreaterThan(loose.body);
    expect(tight.bitterness).toBeGreaterThan(loose.bitterness);
  });

  it("all values clamped to 0-10", () => {
    const p = recipeProfile(mkRecipe({ water: 100, temp: 99 }), "espresso"); // extreme inputs
    for (const v of Object.values(p)) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(10);
    }
  });

  it("french press modifier adds body", () => {
    const v60French = recipeProfile(mkRecipe(), "french");
    const v60Filter = recipeProfile(mkRecipe(), "chemex");
    expect(v60French.body).toBeGreaterThan(v60Filter.body);
  });
});
