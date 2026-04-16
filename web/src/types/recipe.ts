import type { MethodId } from "./method";

export interface RecipeStep {
  t: number;
  label: string;
  desc: string;
  pour: number;
}

export interface Recipe {
  id: string;
  title: string;
  author: string;
  rating: number;
  dose: number;
  water: number;
  temp: number;
  microns: number;
  hasMilk: boolean;
  milk?: number;
  steps: RecipeStep[];
}

export type RecipesByMethod = Record<MethodId, Recipe[]>;
