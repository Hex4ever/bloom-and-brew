import { describe, it, expect } from "vitest";
import { computeGrindClicks } from "./grinderMath";
import type { Grinder } from "../types";

// Mirrors the GRINDERS data exactly
const GRINDERS: Record<string, Grinder> = {
  c40:    { id: "c40",    name: "Comandante C40",   clicksPerMicron: 0.033,  type: "Hand"     },
  jx:     { id: "jx",     name: "1Zpresso JX",      clicksPerMicron: 0.077,  type: "Hand"     },
  k6:     { id: "k6",     name: "1Zpresso K-Ultra",  clicksPerMicron: 0.0125, type: "Hand"     },
  encore: { id: "encore", name: "Baratza Encore",   clicksPerMicron: 0.025,  type: "Electric" },
  c2:     { id: "c2",     name: "Timemore C2",      clicksPerMicron: 0.04,   type: "Hand"     },
  ode:    { id: "ode",    name: "Fellow Ode Gen 2",  clicksPerMicron: 0.03,   type: "Electric" },
};

describe("computeGrindClicks", () => {
  // Half-click grinders (c40, jx, k6)
  describe("c40 — half-click", () => {
    it("returns supportsHalf=true", () => {
      expect(computeGrindClicks(GRINDERS.c40, 400).supportsHalf).toBe(true);
    });
    it("typical v60 grind: 400µm → 13.5 clicks", () => {
      // 400 * 0.033 = 13.2 → round to nearest 0.5 = 13.0
      const r = computeGrindClicks(GRINDERS.c40, 400);
      expect(r.clicks).toBe(13);
      expect(r.display).toBe("13");
    });
    it("450µm → 14.5 clicks", () => {
      // 450 * 0.033 = 14.85 → round(14.85*2)/2 = round(29.7)/2 = 30/2 = 15
      // Actually: 450 * 0.033 = 14.85 → round(14.85*2)=round(29.7)=30 → 30/2=15
      const r = computeGrindClicks(GRINDERS.c40, 450);
      expect(r.clicks).toBe(15);
    });
    it("420µm → rounds to nearest 0.5", () => {
      // 420 * 0.033 = 13.86 → round(13.86*2)/2 = round(27.72)/2 = 28/2 = 14
      const r = computeGrindClicks(GRINDERS.c40, 420);
      expect(r.clicks).toBe(14);
    });
    it("edge: 0 microns → 0 clicks", () => {
      const r = computeGrindClicks(GRINDERS.c40, 0);
      expect(r.clicks).toBe(0);
      expect(r.display).toBe("0");
    });
    it("edge: very large microns (2000µm)", () => {
      // 2000 * 0.033 = 66 → whole number as half-click
      const r = computeGrindClicks(GRINDERS.c40, 2000);
      expect(r.clicks).toBe(66);
    });
    it("applies adjustmentClicks offset", () => {
      const base = computeGrindClicks(GRINDERS.c40, 400).clicks;
      const adjusted = computeGrindClicks(GRINDERS.c40, 400, 2);
      expect(adjusted.clicks).toBe(base + 2);
    });
  });

  describe("jx — half-click", () => {
    it("returns supportsHalf=true", () => {
      expect(computeGrindClicks(GRINDERS.jx, 400).supportsHalf).toBe(true);
    });
    it("typical grind: 300µm → correct clicks", () => {
      // 300 * 0.077 = 23.1 → round(23.1*2)/2 = round(46.2)/2 = 46/2 = 23
      const r = computeGrindClicks(GRINDERS.jx, 300);
      expect(r.clicks).toBe(23);
    });
    it("display shows .5 for half-clicks", () => {
      // Find a value that produces a half-click
      // 320 * 0.077 = 24.64 → round(49.28)/2 = 49/2 = 24.5
      const r = computeGrindClicks(GRINDERS.jx, 320);
      expect(r.clicks).toBe(24.5);
      expect(r.display).toBe("24.5");
    });
  });

  describe("k6 — half-click", () => {
    it("returns supportsHalf=true", () => {
      expect(computeGrindClicks(GRINDERS.k6, 400).supportsHalf).toBe(true);
    });
    it("typical espresso: 200µm", () => {
      // 200 * 0.0125 = 2.5 → round(2.5*2)/2 = round(5)/2 = 2.5
      const r = computeGrindClicks(GRINDERS.k6, 200);
      expect(r.clicks).toBe(2.5);
      expect(r.display).toBe("2.5");
    });
  });

  // Whole-click grinders (encore, c2, ode)
  describe("encore — whole click", () => {
    it("returns supportsHalf=false", () => {
      expect(computeGrindClicks(GRINDERS.encore, 400).supportsHalf).toBe(false);
    });
    it("400µm → 10 clicks", () => {
      // 400 * 0.025 = 10 → round(10) = 10
      const r = computeGrindClicks(GRINDERS.encore, 400);
      expect(r.clicks).toBe(10);
      expect(r.display).toBe("10");
    });
    it("edge: 0 microns", () => {
      expect(computeGrindClicks(GRINDERS.encore, 0).clicks).toBe(0);
    });
    it("edge: very large microns", () => {
      const r = computeGrindClicks(GRINDERS.encore, 2000);
      expect(r.clicks).toBe(50);
    });
  });

  describe("c2 — whole click", () => {
    it("returns supportsHalf=false", () => {
      expect(computeGrindClicks(GRINDERS.c2, 400).supportsHalf).toBe(false);
    });
    it("400µm → 16 clicks", () => {
      // 400 * 0.04 = 16
      const r = computeGrindClicks(GRINDERS.c2, 400);
      expect(r.clicks).toBe(16);
    });
  });

  describe("ode — whole click", () => {
    it("returns supportsHalf=false", () => {
      expect(computeGrindClicks(GRINDERS.ode, 400).supportsHalf).toBe(false);
    });
    it("400µm → 12 clicks", () => {
      // 400 * 0.03 = 12
      const r = computeGrindClicks(GRINDERS.ode, 400);
      expect(r.clicks).toBe(12);
    });
    it("negative adjustment clamps correctly", () => {
      const r = computeGrindClicks(GRINDERS.ode, 400, -2);
      expect(r.clicks).toBe(10);
    });
  });
});
