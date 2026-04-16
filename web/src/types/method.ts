export const METHOD_IDS = [
  "v60",
  "aeropress",
  "chemex",
  "french",
  "moka",
  "espresso",
  "latte",
  "cappuccino",
  "flatwhite",
] as const;

export type MethodId = (typeof METHOD_IDS)[number];

export type BrewingMethodCategory = "filter" | "immersion" | "pressure" | "milk";

export type MethodDifficulty = "Easy" | "Medium" | "Hard";

export interface Method {
  id: MethodId;
  name: string;
  icon: string;
  time: string;
  ratio: string;
  difficulty: MethodDifficulty;
  category: BrewingMethodCategory;
}
