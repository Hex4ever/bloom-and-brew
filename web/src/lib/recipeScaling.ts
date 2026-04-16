import type { Recipe, RecipeStep } from "../types";

export interface ScaledParams {
  dose: number;
  water: number;
  temp: number;
  microns: number;
  milk?: number;
}

export interface ScaledRecipe {
  params: ScaledParams;
  steps: RecipeStep[];
  totalTime: number;
}

/**
 * Scale a recipe to a given number of cups (0.5–8, 0.5 increments).
 *
 * Mass values (dose, water, milk, step pours) scale linearly.
 * Time values scale by √cups so doubling volume ≠ doubling time.
 * Microns are nudged 5% coarser per additional cup (bigger batch → coarser grind).
 * Step desc strings are left unchanged; the caller should show scaled dose/water in the header.
 */
export function scaleRecipe(recipe: Recipe, cups: number): ScaledRecipe {
  const timeScale = Math.sqrt(cups);

  const params: ScaledParams = {
    dose:    Math.round(recipe.dose  * cups * 10) / 10,
    water:   Math.round(recipe.water * cups),
    temp:    recipe.temp,
    // 5% coarser per additional cup beyond 1
    microns: Math.round(recipe.microns * (1 + (cups - 1) * 0.05)),
    ...(recipe.hasMilk && recipe.milk != null
      ? { milk: Math.round(recipe.milk * cups) }
      : {}),
  };

  const steps: RecipeStep[] = recipe.steps.map((s) => ({
    ...s,
    t:    Math.round(s.t    * timeScale),
    pour: Math.round(s.pour * cups),
  }));

  // Total time = last step time + ~60s epilogue, scaled by √cups
  const lastT = steps.length > 0 ? steps[steps.length - 1].t : 0;
  const totalTime = steps.length > 0
    ? lastT + Math.round(60 * timeScale)
    : Math.round(210 * timeScale);

  return { params, steps, totalTime };
}
