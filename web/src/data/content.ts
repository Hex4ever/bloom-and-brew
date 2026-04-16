import type { RatingAxisKey } from "../types";

export interface ScoreAxisConfig {
  key: RatingAxisKey;
  label: string;
  lo: string;
  hi: string;
}

export const SCORE_AXES: ScoreAxisConfig[] = [
  { key: "sweetness",  label: "Sweetness",  lo: "Flat",  hi: "Sweet"     },
  { key: "acidity",    label: "Acidity",    lo: "Dull",  hi: "Bright"    },
  { key: "body",       label: "Body",       lo: "Thin",  hi: "Heavy"     },
  { key: "bitterness", label: "Bitterness", lo: "None",  hi: "Strong"    },
  { key: "aftertaste", label: "Aftertaste", lo: "Short", hi: "Lingering" },
];

export const TIPS: string[] = [
  "Always weigh your coffee — eyeballing scoops is the #1 reason brews are inconsistent.",
  "Pre-wet your filter. It rinses paper taste and warms the brewer.",
  "Coffee tastes best 7-21 days post-roast. Buy with the roast date visible.",
  "Store beans in an airtight container, away from light. Never freeze daily-use beans.",
  "Water is 98% of your cup. If your tap tastes bad, your coffee will too.",
  "Grind right before brewing. Pre-ground coffee loses 60% of aroma in 15 minutes.",
  "Hotter water = faster extraction. Light roasts often need 96°C+, dark roasts 88-92°C.",
  "Swirl your V60 after the bloom. It evens out the slurry without disturbing the bed.",
  "If your espresso is sour, grind finer. If bitter, grind coarser. The dial-in dance.",
  "The best brewer is the one you'll actually use every morning.",
];

export const FUN_FACTS: string[] = [
  "Coffee is the world's second-most traded commodity, after crude oil.",
  "There are over 800 aroma compounds in roasted coffee — wine has about 400.",
  "Espresso has less caffeine per serving than drip — you just drink it faster.",
  "Goats discovered coffee. Ethiopian shepherd Kaldi noticed his herd dancing after eating the cherries.",
  "The world's most expensive coffee, Kopi Luwak, comes from civet droppings.",
  "Finland drinks the most coffee per capita — ~10kg per person per year.",
  "Coffee 'cherries' are fruits. The bean is the seed inside.",
  "Brazil produces ~40% of the world's coffee. Vietnam is second.",
];
