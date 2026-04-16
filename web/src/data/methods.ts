import type { Method } from "../types";

export const METHODS: Method[] = [
  { id: "v60",        name: "V60 Pourover",  icon: "▽", time: "3:30", ratio: "1:16", difficulty: "Medium", category: "filter"    },
  { id: "aeropress",  name: "Aeropress",     icon: "◉", time: "2:00", ratio: "1:14", difficulty: "Easy",   category: "filter"    },
  { id: "chemex",     name: "Chemex",        icon: "⏃", time: "5:00", ratio: "1:17", difficulty: "Medium", category: "filter"    },
  { id: "french",     name: "French Press",  icon: "▭", time: "4:00", ratio: "1:15", difficulty: "Easy",   category: "immersion" },
  { id: "moka",       name: "Moka Pot",      icon: "⏅", time: "6:00", ratio: "1:10", difficulty: "Medium", category: "pressure"  },
  { id: "espresso",   name: "Espresso",      icon: "■", time: "0:30", ratio: "1:2",  difficulty: "Hard",   category: "pressure"  },
  { id: "latte",      name: "Latte",         icon: "◐", time: "3:00", ratio: "1:5",  difficulty: "Medium", category: "milk"      },
  { id: "cappuccino", name: "Cappuccino",    icon: "◓", time: "3:00", ratio: "1:3",  difficulty: "Medium", category: "milk"      },
  { id: "flatwhite",  name: "Flat White",    icon: "●", time: "3:00", ratio: "1:4",  difficulty: "Medium", category: "milk"      },
];
