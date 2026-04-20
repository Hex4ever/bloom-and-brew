import type { MethodId } from "./method";

export const RATING_AXIS_KEYS = [
  "sweetness",
  "acidity",
  "body",
  "bitterness",
  "aftertaste",
] as const;

export type RatingAxisKey = (typeof RATING_AXIS_KEYS)[number];

export interface RatingAxes {
  sweetness: number;
  acidity: number;
  body: number;
  bitterness: number;
  aftertaste: number;
  overall: number;
}

export interface JournalEntry {
  id: string;
  recipeId: string;
  recipeTitle: string;
  method: MethodId;
  bean: string;
  grinder: string;
  date: string;
  createdAt?: string;
  dose?: number;
  water?: number;
  temp?: number;
  clicks?: number;
  scores: RatingAxes;
  notes: string;
  quickLogged: boolean;
}
