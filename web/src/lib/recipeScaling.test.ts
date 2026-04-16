import { describe, it, expect } from "vitest";
import { scaleRecipe } from "./recipeScaling";
import type { Recipe } from "../types";

const BASE: Recipe = {
  id:      "test-v60",
  title:   "Test V60",
  author:  "Tester",
  rating:  4.5,
  dose:    15,
  water:   250,
  temp:    93,
  microns: 600,
  hasMilk: false,
  steps: [
    { t: 0,   label: "Bloom",    desc: "Pour 50g for bloom", pour: 50  },
    { t: 45,  label: "Pour 1",   desc: "Pour to 150g",       pour: 100 },
    { t: 90,  label: "Pour 2",   desc: "Pour to 250g",       pour: 100 },
    { t: 180, label: "Drawdown", desc: "Let it drain",       pour: 0   },
  ],
};

const MILK_RECIPE: Recipe = {
  ...BASE,
  id:      "test-latte",
  hasMilk: true,
  milk:    120,
};

describe("scaleRecipe", () => {
  describe("identity at cups=1", () => {
    it("dose unchanged", () => {
      expect(scaleRecipe(BASE, 1).params.dose).toBe(15);
    });
    it("water unchanged", () => {
      expect(scaleRecipe(BASE, 1).params.water).toBe(250);
    });
    it("temp unchanged", () => {
      expect(scaleRecipe(BASE, 1).params.temp).toBe(93);
    });
    it("microns unchanged at cups=1", () => {
      // 600 * (1 + (1-1)*0.05) = 600 * 1 = 600
      expect(scaleRecipe(BASE, 1).params.microns).toBe(600);
    });
    it("step pours unchanged", () => {
      const { steps } = scaleRecipe(BASE, 1);
      expect(steps[0].pour).toBe(50);
      expect(steps[1].pour).toBe(100);
    });
    it("step times unchanged (√1 = 1)", () => {
      const { steps } = scaleRecipe(BASE, 1);
      expect(steps[0].t).toBe(0);
      expect(steps[1].t).toBe(45);
      expect(steps[2].t).toBe(90);
      expect(steps[3].t).toBe(180);
    });
  });

  describe("cups=2 — double volume", () => {
    it("dose doubles", () => {
      expect(scaleRecipe(BASE, 2).params.dose).toBe(30);
    });
    it("water doubles", () => {
      expect(scaleRecipe(BASE, 2).params.water).toBe(500);
    });
    it("temp unchanged", () => {
      expect(scaleRecipe(BASE, 2).params.temp).toBe(93);
    });
    it("microns 5% coarser", () => {
      // 600 * (1 + (2-1)*0.05) = 600 * 1.05 = 630
      expect(scaleRecipe(BASE, 2).params.microns).toBe(630);
    });
    it("pour doubles", () => {
      const { steps } = scaleRecipe(BASE, 2);
      expect(steps[0].pour).toBe(100);  // 50 * 2
      expect(steps[1].pour).toBe(200);  // 100 * 2
    });
    it("step times stretch by √2", () => {
      const { steps } = scaleRecipe(BASE, 2);
      const sqr2 = Math.sqrt(2);
      expect(steps[1].t).toBe(Math.round(45 * sqr2));
      expect(steps[2].t).toBe(Math.round(90 * sqr2));
      expect(steps[3].t).toBe(Math.round(180 * sqr2));
    });
    it("totalTime includes √2-scaled epilogue", () => {
      const { steps, totalTime } = scaleRecipe(BASE, 2);
      const lastT = steps[steps.length - 1].t;
      expect(totalTime).toBe(lastT + Math.round(60 * Math.sqrt(2)));
    });
  });

  describe("micron bump", () => {
    it("cups=4 → 15% coarser", () => {
      // 600 * (1 + (4-1)*0.05) = 600 * 1.15 = 690
      expect(scaleRecipe(BASE, 4).params.microns).toBe(690);
    });
    it("cups=0.5 → finer (negative delta)", () => {
      // 600 * (1 + (0.5-1)*0.05) = 600 * 0.975 = 585
      expect(scaleRecipe(BASE, 0.5).params.microns).toBe(585);
    });
  });

  describe("milk recipes", () => {
    it("milk scales with cups=2", () => {
      expect(scaleRecipe(MILK_RECIPE, 2).params.milk).toBe(240);
    });
    it("milk present at cups=1", () => {
      expect(scaleRecipe(MILK_RECIPE, 1).params.milk).toBe(120);
    });
    it("no milk key when recipe.hasMilk=false", () => {
      const { params } = scaleRecipe(BASE, 2);
      expect(params.milk).toBeUndefined();
    });
  });

  describe("step desc strings", () => {
    it("desc strings are NOT rewritten (left for the UI)", () => {
      const { steps } = scaleRecipe(BASE, 2);
      expect(steps[0].desc).toBe("Pour 50g for bloom");
      expect(steps[1].desc).toBe("Pour to 150g");
    });
  });
});
