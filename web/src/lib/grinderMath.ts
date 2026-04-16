import type { Grinder } from "../types";

export interface GrindResult {
  clicks: number;
  supportsHalf: boolean;
  display: string;
}

// Grinders that support half-click detents
const HALF_CLICK_IDS = ["c40", "jx", "k6"] as const;

/**
 * Convert a target grind size in microns to a click count for the given grinder.
 * @param grinder - the selected grinder
 * @param microns - target particle size in microns
 * @param adjustmentClicks - optional ±N offset from the tweak engine
 */
export function computeGrindClicks(
  grinder: Grinder,
  microns: number,
  adjustmentClicks = 0,
): GrindResult {
  const raw = microns * grinder.clicksPerMicron;
  const supportsHalf = (HALF_CLICK_IDS as readonly string[]).includes(grinder.id);

  let clicks: number;
  if (supportsHalf) {
    clicks = Math.round(raw * 2) / 2 + adjustmentClicks;
    // Keep adjustment in half-click resolution
    clicks = Math.round(clicks * 2) / 2;
  } else {
    clicks = Math.round(raw) + adjustmentClicks;
  }

  const display = Number.isInteger(clicks) ? String(clicks) : clicks.toFixed(1);

  return { clicks, supportsHalf, display };
}
