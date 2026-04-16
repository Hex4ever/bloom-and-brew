import { describe, it, expect } from "vitest";
import { generateTweaks } from "./tweakEngine";
import type { JournalEntry, MethodId } from "../types";

// Minimal journal entry factory
function mkEntry(overrides: Partial<JournalEntry> = {}): JournalEntry {
  return {
    id:          "e1",
    recipeId:    "r1",
    recipeTitle: "Test Recipe",
    method:      "v60" as MethodId,
    bean:        "Test Bean",
    grinder:     "c40",
    date:        "2026-04-16",
    dose:        15,
    water:       250,
    temp:        93,
    clicks:      24,
    scores: {
      sweetness:  6,
      acidity:    5,
      body:       6,
      bitterness: 5,
      aftertaste: 6,
      overall:    6,
    },
    notes:       "",
    quickLogged: false,
    ...overrides,
  };
}

// Score shortcuts
function scores(partial: Partial<JournalEntry["scores"]>): JournalEntry["scores"] {
  return {
    sweetness:  5,
    acidity:    5,
    body:       5,
    bitterness: 5,
    aftertaste: 5,
    overall:    5,
    ...partial,
  };
}

describe("generateTweaks", () => {
  describe("over-extraction (high bitterness)", () => {
    const entry = mkEntry({ temp: 95, scores: scores({ bitterness: 8, overall: 5 }) });
    const { diagnoses, suggestions } = generateTweaks(entry);

    it("diagnosis mentions over-extraction", () => {
      expect(diagnoses[0]).toMatch(/over-extract/i);
    });
    it("suggests coarser grind", () => {
      expect(suggestions.some((s) => s.axis === "Grind" && /coarser/i.test(s.change))).toBe(true);
    });
    it("suggests temperature drop with correct value", () => {
      const tempSug = suggestions.find((s) => s.axis === "Temp");
      expect(tempSug).toBeDefined();
      // temp=95, drop=2 → 93
      expect(tempSug!.change).toContain("93");
    });
    it("does not drop below 85°C minimum", () => {
      const e = mkEntry({ temp: 85, scores: scores({ bitterness: 9, overall: 4 }) });
      const t = generateTweaks(e);
      const tempSug = t.suggestions.find((s) => s.axis === "Temp");
      expect(tempSug!.change).toContain("85");
    });
    it("suggests faster pour", () => {
      expect(suggestions.some((s) => s.axis === "Time" && /faster/i.test(s.change))).toBe(true);
    });
  });

  describe("under-extraction (sour + low sweetness)", () => {
    const entry = mkEntry({
      temp: 92,
      scores: scores({ bitterness: 2, acidity: 8, sweetness: 4, overall: 5 }),
    });
    const { diagnoses, suggestions } = generateTweaks(entry);

    it("diagnosis mentions under-extraction", () => {
      expect(diagnoses.some((d) => /under-extract/i.test(d))).toBe(true);
    });
    it("suggests finer grind", () => {
      expect(suggestions.some((s) => s.axis === "Grind" && /finer/i.test(s.change))).toBe(true);
    });
    it("suggests temperature raise with correct value", () => {
      const tempSug = suggestions.find((s) => s.axis === "Temp");
      expect(tempSug).toBeDefined();
      // temp=92, raise=2 → 94
      expect(tempSug!.change).toContain("94");
    });
    it("does not exceed 99°C maximum", () => {
      const e = mkEntry({ temp: 99, scores: scores({ bitterness: 2, acidity: 9, sweetness: 3, overall: 4 }) });
      const t = generateTweaks(e);
      const tempSug = t.suggestions.find((s) => s.axis === "Temp");
      expect(tempSug!.change).toContain("99");
    });
  });

  describe("thin body", () => {
    it("diagnosis mentions thin body", () => {
      const entry = mkEntry({ water: 300, scores: scores({ body: 2, overall: 5 }) });
      const { diagnoses } = generateTweaks(entry);
      expect(diagnoses.some((d) => /thin/i.test(d))).toBe(true);
    });
    it("ratio suggestion uses actual water value", () => {
      const entry = mkEntry({ water: 300, scores: scores({ body: 2, overall: 5 }) });
      const { suggestions } = generateTweaks(entry);
      const ratioSug = suggestions.find((s) => s.axis === "Ratio");
      expect(ratioSug).toBeDefined();
      // 300 * 0.92 = 276
      expect(ratioSug!.why).toContain("276");
    });
    it("v60 gets technique suggestion", () => {
      const entry = mkEntry({ method: "v60", water: 250, scores: scores({ body: 2, overall: 5 }) });
      const { suggestions } = generateTweaks(entry);
      expect(suggestions.some((s) => s.axis === "Technique")).toBe(true);
    });
    it("non-v60/chemex does not get technique suggestion", () => {
      const entry = mkEntry({ method: "aeropress", water: 250, scores: scores({ body: 2, overall: 5 }) });
      const { suggestions } = generateTweaks(entry);
      expect(suggestions.some((s) => s.axis === "Technique")).toBe(false);
    });
  });

  describe("muddy / heavy", () => {
    it("diagnosis mentions muddy", () => {
      const entry = mkEntry({ scores: scores({ body: 9, bitterness: 7, overall: 5 }) });
      const { diagnoses } = generateTweaks(entry);
      expect(diagnoses.some((d) => /muddy/i.test(d))).toBe(true);
    });
    it("suggests pre-rinsing filter", () => {
      const entry = mkEntry({ scores: scores({ body: 9, bitterness: 7, overall: 5 }) });
      const { suggestions } = generateTweaks(entry);
      expect(suggestions.some((s) => s.axis === "Filter")).toBe(true);
    });
  });

  describe("low sweetness (isolated)", () => {
    it("diagnosis mentions sweetness", () => {
      const entry = mkEntry({ scores: scores({ sweetness: 3, overall: 5 }) });
      const { diagnoses } = generateTweaks(entry);
      expect(diagnoses.some((d) => /sweetness/i.test(d))).toBe(true);
    });
    it("suggests extending bloom", () => {
      const entry = mkEntry({ scores: scores({ sweetness: 3, overall: 5 }) });
      const { suggestions } = generateTweaks(entry);
      expect(suggestions.some((s) => s.axis === "Time" && /bloom/i.test(s.change))).toBe(true);
    });
  });

  describe("short aftertaste", () => {
    it("diagnosis mentions aftertaste", () => {
      const entry = mkEntry({ scores: scores({ aftertaste: 3, overall: 6 }) });
      const { diagnoses } = generateTweaks(entry);
      expect(diagnoses.some((d) => /aftertaste/i.test(d))).toBe(true);
    });
    it("suggests checking bean freshness", () => {
      const entry = mkEntry({ scores: scores({ aftertaste: 3, overall: 6 }) });
      const { suggestions } = generateTweaks(entry);
      expect(suggestions.some((s) => s.axis === "Bean" && /fresh/i.test(s.change))).toBe(true);
    });
  });

  describe("great brew", () => {
    it("positive diagnosis for excellent overall + no issues", () => {
      const entry = mkEntry({
        scores: scores({ overall: 9, sweetness: 8, acidity: 7, body: 8, bitterness: 5, aftertaste: 8 }),
      });
      const { diagnoses, suggestions } = generateTweaks(entry);
      expect(diagnoses[0]).toMatch(/excellent/i);
      expect(suggestions.some((s) => s.axis === "Repeat")).toBe(true);
    });
  });

  describe("mediocre / balanced but unmemorable", () => {
    it("fires when overall < 7 and no other flag", () => {
      const entry = mkEntry({
        water: 250,
        scores: scores({ overall: 6, sweetness: 5, acidity: 5, body: 5, bitterness: 5, aftertaste: 5 }),
      });
      const { diagnoses, suggestions } = generateTweaks(entry);
      expect(diagnoses.some((d) => /unmemorable/i.test(d))).toBe(true);
      // ratio suggestion uses actual water value: 250 * 0.94 = 235
      const ratioSug = suggestions.find((s) => s.axis === "Ratio");
      expect(ratioSug).toBeDefined();
      expect(ratioSug!.why).toContain("235");
    });
  });

  describe("suggestion numbers are computed, not literals", () => {
    it("temp in temp-drop suggestion matches entry.temp - 2", () => {
      const entry = mkEntry({ temp: 97, scores: scores({ bitterness: 8, overall: 5 }) });
      const { suggestions } = generateTweaks(entry);
      const tempSug = suggestions.find((s) => s.axis === "Temp");
      expect(tempSug!.change).toContain("95");
    });
    it("ratio suggestion water matches Math.round(entry.water * 0.92)", () => {
      const entry = mkEntry({ water: 320, scores: scores({ body: 2, overall: 5 }) });
      const { suggestions } = generateTweaks(entry);
      const ratioSug = suggestions.find((s) => s.axis === "Ratio");
      expect(ratioSug!.why).toContain(String(Math.round(320 * 0.92)));
    });
  });
});
