import type { RecipesByMethod } from "../types";

export const RECIPES: RecipesByMethod = {
  v60: [
    {
      id: "hoff", title: "Hoffmann Ultimate V60", author: "James Hoffmann",
      rating: 4.9, dose: 15, water: 250, temp: 96, microns: 700, hasMilk: false,
      steps: [
        { t: 0,   label: "Bloom",       desc: "Pour 45g water, swirl gently to saturate all grounds",        pour: 45 },
        { t: 45,  label: "First pour",  desc: "Pour to 100g in slow circles from center outward",             pour: 55 },
        { t: 75,  label: "Second pour", desc: "Pour to 175g, keep the level high",                            pour: 75 },
        { t: 105, label: "Final pour",  desc: "Pour to 250g, gentle swirl to flatten the bed",                pour: 75 },
        { t: 210, label: "Drawdown",    desc: "Let it finish. Should complete around 3:30 total",             pour: 0  },
      ],
    },
    {
      id: "tetsu", title: "Tetsu Kasuya 4:6 Method", author: "Tetsu Kasuya",
      rating: 4.8, dose: 20, water: 300, temp: 92, microns: 800, hasMilk: false,
      steps: [
        { t: 0,   label: "Pour 1 — Sweetness", desc: "Pour 50g slowly. Smaller pour = more sweetness",          pour: 50 },
        { t: 45,  label: "Pour 2 — Acidity",   desc: "Pour to 120g. This pour balances the acidity",            pour: 70 },
        { t: 90,  label: "Pour 3",             desc: "Pour to 180g. Controls strength",                         pour: 60 },
        { t: 135, label: "Pour 4",             desc: "Pour to 240g",                                            pour: 60 },
        { t: 180, label: "Pour 5",             desc: "Pour to 300g. Final pour for strength",                   pour: 60 },
        { t: 210, label: "Drawdown",           desc: "Let it finish, aim for 3:30 total",                       pour: 0  },
      ],
    },
    {
      id: "lance", title: "Lance Hedrick One Cup", author: "Lance Hedrick",
      rating: 4.7, dose: 14, water: 230, temp: 99, microns: 650, hasMilk: false,
      steps: [
        { t: 0,   label: "Bloom",     desc: "Pour 60g at near-boiling water, swirl hard",                   pour: 60  },
        { t: 45,  label: "Main pour", desc: "Pour continuously to 230g in slow spiral, ~30s",               pour: 170 },
        { t: 75,  label: "Rao spin",  desc: "Swirl the dripper once to flatten the bed",                    pour: 0   },
        { t: 180, label: "Drawdown",  desc: "Complete around 2:30-3:00 total",                              pour: 0   },
      ],
    },
    {
      id: "scott", title: "Scott Rao Pulse Pour", author: "Scott Rao",
      rating: 4.7, dose: 22, water: 360, temp: 95, microns: 720, hasMilk: false,
      steps: [
        { t: 0,   label: "Bloom",    desc: "Pour 66g (3x dose), swirl thoroughly",                          pour: 66  },
        { t: 45,  label: "Pulse 1",  desc: "Pour to 180g in gentle pulses",                                 pour: 114 },
        { t: 90,  label: "Pulse 2",  desc: "Pour to 270g, maintain slurry level",                           pour: 90  },
        { t: 135, label: "Pulse 3",  desc: "Pour to 360g, then spin the dripper",                           pour: 90  },
        { t: 240, label: "Drawdown", desc: "Target 4:00 total brew time",                                   pour: 0   },
      ],
    },
    {
      id: "onyx", title: "Onyx Classic V60", author: "Onyx Coffee Lab",
      rating: 4.6, dose: 22, water: 350, temp: 96, microns: 700, hasMilk: false,
      steps: [
        { t: 0,   label: "Bloom",             desc: "Pour 60g water, stir gently with a spoon",             pour: 60  },
        { t: 30,  label: "First main pour",   desc: "Pour to 200g over 30 seconds",                         pour: 140 },
        { t: 75,  label: "Second main pour",  desc: "Pour to 350g over 30 seconds",                         pour: 150 },
        { t: 210, label: "Drawdown",          desc: "Total time around 3:30",                               pour: 0   },
      ],
    },
    {
      id: "blue", title: "Blue Bottle Method", author: "Blue Bottle Coffee",
      rating: 4.4, dose: 30, water: 500, temp: 93, microns: 750, hasMilk: false,
      steps: [
        { t: 0,   label: "Bloom",        desc: "Pour 60g (2x dose), gentle swirl",                          pour: 60  },
        { t: 45,  label: "First pour",   desc: "Pour to 150g in circular motion",                           pour: 90  },
        { t: 90,  label: "Second pour",  desc: "Pour to 300g, keep level steady",                           pour: 150 },
        { t: 150, label: "Third pour",   desc: "Pour to 500g, finish the brew",                             pour: 200 },
        { t: 240, label: "Drawdown",     desc: "Target 4:00 total",                                         pour: 0   },
      ],
    },
    {
      id: "icv", title: "Iced V60 (Japanese-style)", author: "Mark Prince",
      rating: 4.5, dose: 20, water: 200, temp: 96, microns: 600, hasMilk: false,
      steps: [
        { t: 0,   label: "Ice in server", desc: "Add 100g ice to the server before brewing",                pour: 0   },
        { t: 15,  label: "Bloom",         desc: "Pour 40g over grounds, swirl",                             pour: 40  },
        { t: 45,  label: "Main pour",     desc: "Pour to 200g in gentle spiral",                            pour: 160 },
        { t: 150, label: "Drawdown",      desc: "Coffee drips onto ice — instant chill",                   pour: 0   },
        { t: 200, label: "Swirl",         desc: "Swirl the server to mix. Serve over fresh ice",            pour: 0   },
      ],
    },
  ],
  aeropress: [
    {
      id: "wac", title: "World Aeropress Champion '23", author: "Carlos de la Torre",
      rating: 4.9, dose: 14, water: 200, temp: 88, microns: 500, hasMilk: false,
      steps: [
        { t: 0,   label: "Add water", desc: "Pour 200g water quickly, stir 3 times with paddle",            pour: 200 },
        { t: 60,  label: "Steep",     desc: "Attach cap, let sit undisturbed",                              pour: 0   },
        { t: 105, label: "Press",     desc: "Press slowly and steadily over 30 seconds",                    pour: 0   },
        { t: 135, label: "Done",      desc: "Stop when you hear the hiss",                                  pour: 0   },
      ],
    },
    {
      id: "inv", title: "Inverted Method", author: "Aeropress Co.",
      rating: 4.7, dose: 17, water: 220, temp: 85, microns: 550, hasMilk: false,
      steps: [
        { t: 0,   label: "Invert & load", desc: "Flip Aeropress upside down, add grounds",                 pour: 0   },
        { t: 10,  label: "Pour water",    desc: "Pour 220g water, stir briskly 5 times",                   pour: 220 },
        { t: 60,  label: "Attach cap",    desc: "Screw on rinsed filter cap, wait",                        pour: 0   },
        { t: 90,  label: "Flip & press",  desc: "Carefully flip onto cup, press over 25s",                 pour: 0   },
        { t: 120, label: "Done",          desc: "Stop at the hiss — don't squeeze more",                   pour: 0   },
      ],
    },
    {
      id: "tim", title: "Tim Wendelboe AP", author: "Tim Wendelboe",
      rating: 4.7, dose: 15, water: 220, temp: 90, microns: 520, hasMilk: false,
      steps: [
        { t: 0,   label: "Bloom",    desc: "Pour 30g water, stir once, bloom 30s",                         pour: 30  },
        { t: 30,  label: "Fill",     desc: "Pour to 220g, don't stir again",                               pour: 190 },
        { t: 60,  label: "Cap & wait",desc: "Attach cap immediately to trap heat",                         pour: 0   },
        { t: 90,  label: "Press",    desc: "Press slowly over 45 seconds",                                 pour: 0   },
        { t: 135, label: "Done",     desc: "Stop when you feel resistance",                                pour: 0   },
      ],
    },
    {
      id: "jh", title: "Hoffmann Ultimate Aeropress", author: "James Hoffmann",
      rating: 4.8, dose: 11, water: 200, temp: 95, microns: 480, hasMilk: false,
      steps: [
        { t: 0,   label: "Add water", desc: "Pour 200g quickly, stir once gently",                         pour: 200 },
        { t: 15,  label: "Wait",      desc: "Let it steep untouched",                                      pour: 0   },
        { t: 120, label: "Swirl",     desc: "Swirl the Aeropress gently to settle grounds",                pour: 0   },
        { t: 150, label: "Press",     desc: "Press slowly over 30 seconds",                               pour: 0   },
        { t: 180, label: "Done",      desc: "Stop before the hiss for cleaner cup",                       pour: 0   },
      ],
    },
    {
      id: "fast", title: "Fast & Strong", author: "Community",
      rating: 4.3, dose: 18, water: 150, temp: 92, microns: 450, hasMilk: false,
      steps: [
        { t: 0,  label: "Add water",   desc: "Pour 150g water, stir vigorously",                           pour: 150 },
        { t: 15, label: "Short steep", desc: "Cap quickly, brief rest",                                    pour: 0   },
        { t: 45, label: "Press",       desc: "Press firmly over 20 seconds",                               pour: 0   },
        { t: 65, label: "Dilute",      desc: "Add 100g hot water to the cup to taste",                     pour: 0   },
      ],
    },
    {
      id: "ic", title: "Iced Aeropress", author: "Community",
      rating: 4.4, dose: 18, water: 120, temp: 88, microns: 500, hasMilk: false,
      steps: [
        { t: 0,   label: "Ice in cup",   desc: "Fill cup with 100g ice",                                   pour: 0   },
        { t: 10,  label: "Add water",    desc: "Pour 120g hot water into Aeropress, stir",                 pour: 120 },
        { t: 45,  label: "Steep",        desc: "Cap and rest briefly",                                     pour: 0   },
        { t: 75,  label: "Press",        desc: "Press onto ice over 25 seconds",                           pour: 0   },
        { t: 100, label: "Stir & serve", desc: "Stir to melt ice and chill. Top up if needed",             pour: 0   },
      ],
    },
  ],
  chemex: [
    {
      id: "c1", title: "Classic Chemex 6-cup", author: "Chemex Co.",
      rating: 4.8, dose: 42, water: 700, temp: 96, microns: 850, hasMilk: false,
      steps: [
        { t: 0,   label: "Bloom",       desc: "Pour 100g water (2.5x dose), swirl carafe gently",          pour: 100 },
        { t: 45,  label: "First pour",  desc: "Pour to 300g in slow spirals",                              pour: 200 },
        { t: 120, label: "Second pour", desc: "Pour to 500g, maintaining level",                           pour: 200 },
        { t: 210, label: "Final pour",  desc: "Pour to 700g",                                              pour: 200 },
        { t: 330, label: "Drawdown",    desc: "Target 5:30 total. Remove filter, swirl to mix",            pour: 0   },
      ],
    },
    {
      id: "chemex-single", title: "Chemex Single Cup", author: "Community",
      rating: 4.6, dose: 22, water: 360, temp: 96, microns: 830, hasMilk: false,
      steps: [
        { t: 0,   label: "Bloom",      desc: "Pour 50g water, swirl",                                      pour: 50  },
        { t: 40,  label: "Main pour",  desc: "Pour to 200g in slow circles",                               pour: 150 },
        { t: 100, label: "Final pour", desc: "Pour to 360g, gently",                                       pour: 160 },
        { t: 240, label: "Drawdown",   desc: "Target 4:30 total",                                          pour: 0   },
      ],
    },
  ],
  french: [
    {
      id: "f1", title: "Hoffmann French Press", author: "James Hoffmann",
      rating: 4.9, dose: 30, water: 500, temp: 95, microns: 1100, hasMilk: false,
      steps: [
        { t: 0,   label: "Pour water",  desc: "Pour all 500g water quickly over grounds",                  pour: 500 },
        { t: 240, label: "Break crust", desc: "Gently stir the crust with a spoon, 3 times",               pour: 0   },
        { t: 260, label: "Skim",        desc: "Scoop off floating foam and grounds with 2 spoons",         pour: 0   },
        { t: 300, label: "Rest",        desc: "Let it settle — grounds sink to the bottom",                pour: 0   },
        { t: 540, label: "Pour gently", desc: "Pour slowly without plunging — the filter stays up top",    pour: 0   },
      ],
    },
    {
      id: "f2", title: "Classic French Press", author: "Community",
      rating: 4.5, dose: 30, water: 500, temp: 94, microns: 1100, hasMilk: false,
      steps: [
        { t: 0,   label: "Pour water",    desc: "Pour 500g water over grounds, stir briefly",              pour: 500 },
        { t: 30,  label: "Attach plunger",desc: "Place plunger on top (don't press)",                      pour: 0   },
        { t: 240, label: "Press",         desc: "Press slowly and steadily to the bottom",                 pour: 0   },
        { t: 270, label: "Serve",         desc: "Decant immediately — don't let it sit on grounds",        pour: 0   },
      ],
    },
  ],
  moka: [
    {
      id: "m1", title: "Stovetop Classic", author: "Bialetti",
      rating: 4.6, dose: 18, water: 200, temp: 100, microns: 400, hasMilk: false,
      steps: [
        { t: 0,   label: "Pre-heat water",   desc: "Fill bottom chamber with pre-heated water to the valve",  pour: 0 },
        { t: 30,  label: "Add grounds",      desc: "Fill basket level — don't tamp. Assemble tightly",        pour: 0 },
        { t: 60,  label: "Medium heat",      desc: "Place on stove, lid open, medium flame",                  pour: 0 },
        { t: 180, label: "Listen",           desc: "Coffee begins streaming — honey-colored, steady",         pour: 0 },
        { t: 300, label: "Pull off heat",    desc: "Remove when stream turns pale/blonde",                    pour: 0 },
        { t: 330, label: "Cool the base",    desc: "Run cold water on the bottom to stop extraction",         pour: 0 },
      ],
    },
    {
      id: "m2", title: "Moka Concentrate", author: "Community",
      rating: 4.4, dose: 14, water: 150, temp: 100, microns: 420, hasMilk: false,
      steps: [
        { t: 0,   label: "Hot water in base", desc: "Fill with 150g pre-heated water",                       pour: 0 },
        { t: 30,  label: "Level the basket",  desc: "Fill basket, level flat — no tamping",                  pour: 0 },
        { t: 60,  label: "Low-medium heat",   desc: "Assemble, place on gentle flame",                       pour: 0 },
        { t: 240, label: "Stream starts",     desc: "Watch for steady honey stream",                         pour: 0 },
        { t: 360, label: "Done",              desc: "Off heat when it sputters, cool base",                  pour: 0 },
      ],
    },
  ],
  espresso: [
    {
      id: "e1", title: "Modern Espresso", author: "Lance Hedrick",
      rating: 4.8, dose: 18, water: 36, temp: 93, microns: 250, hasMilk: false,
      steps: [
        { t: 0,  label: "Flush the group",    desc: "Run 2s flush to stabilize temperature",                 pour: 0  },
        { t: 5,  label: "Dose & distribute",  desc: "Grind 18g in, WDT with needles to break clumps",       pour: 0  },
        { t: 20, label: "Tamp",               desc: "Level, even tamp. ~15kg pressure",                     pour: 0  },
        { t: 25, label: "Lock & pull",        desc: "Lock portafilter, start shot immediately",              pour: 0  },
        { t: 30, label: "Extraction",         desc: "Target 36g out in 25-30s. Mouse-tail pour",            pour: 36 },
        { t: 55, label: "Stop",               desc: "Stop when blonding starts or at 36g",                  pour: 0  },
      ],
    },
    {
      id: "e2", title: "Classic Italian Shot", author: "SCA",
      rating: 4.5, dose: 18, water: 36, temp: 92, microns: 240, hasMilk: false,
      steps: [
        { t: 0,  label: "Flush",   desc: "Brief group flush to purge",                                       pour: 0  },
        { t: 5,  label: "Dose",    desc: "Grind 18g directly into portafilter",                              pour: 0  },
        { t: 15, label: "Tamp",    desc: "Firm, level tamp",                                                 pour: 0  },
        { t: 22, label: "Pull",    desc: "Lock and start immediately",                                       pour: 0  },
        { t: 27, label: "Extract", desc: "Aim for 36g out in 25s",                                          pour: 36 },
      ],
    },
  ],
  latte: [
    {
      id: "lat1", title: "Classic Latte", author: "Barista Guild",
      rating: 4.8, dose: 18, water: 36, temp: 93, microns: 250, hasMilk: true, milk: 200,
      steps: [
        { t: 0,   label: "Pull shot",   desc: "Pull 36g espresso directly into warmed cup",                 pour: 36  },
        { t: 30,  label: "Purge wand",  desc: "Quick steam blast to clear condensation",                    pour: 0   },
        { t: 40,  label: "Steam milk",  desc: "Stretch 3-5s at surface, then texture deep. Target 60°C",   pour: 0   },
        { t: 90,  label: "Tap & swirl", desc: "Tap pitcher to pop bubbles, swirl to integrate",             pour: 0   },
        { t: 105, label: "Pour",        desc: "Pour from height to blend, close to surface for art",        pour: 200 },
      ],
    },
    {
      id: "lat2", title: "Iced Latte", author: "Community",
      rating: 4.6, dose: 18, water: 36, temp: 93, microns: 250, hasMilk: true, milk: 200,
      steps: [
        { t: 0,  label: "Ice the glass",    desc: "Fill a tall glass with ice",                             pour: 0   },
        { t: 10, label: "Cold milk",        desc: "Pour 200g cold whole milk over ice",                     pour: 200 },
        { t: 30, label: "Pull shot",        desc: "Pull 36g espresso into a separate vessel",               pour: 36  },
        { t: 60, label: "Pour over milk",   desc: "Pour espresso slowly over the milk — creates the layered look", pour: 0 },
        { t: 75, label: "Stir & serve",     desc: "Stir before drinking to combine",                        pour: 0   },
      ],
    },
  ],
  cappuccino: [
    {
      id: "cap1", title: "Italian Cappuccino", author: "SCA Standard",
      rating: 4.9, dose: 18, water: 36, temp: 93, microns: 250, hasMilk: true, milk: 120,
      steps: [
        { t: 0,   label: "Pull shot",   desc: "Pull 36g espresso into warmed 150ml cup",                    pour: 36  },
        { t: 30,  label: "Purge wand",  desc: "Quick steam blast",                                          pour: 0   },
        { t: 40,  label: "Stretch milk",desc: "Longer stretch — 6-8s of 'tssss' for thick foam",            pour: 0   },
        { t: 75,  label: "Texture",     desc: "Submerge wand, spin to polish. Target 60°C",                 pour: 0   },
        { t: 110, label: "Pour & spoon",desc: "Pour milk, then spoon the thick foam on top",                pour: 120 },
      ],
    },
    {
      id: "cap2", title: "Dry Cappuccino", author: "Community",
      rating: 4.5, dose: 18, water: 36, temp: 93, microns: 250, hasMilk: true, milk: 100,
      steps: [
        { t: 0,   label: "Pull shot",          desc: "36g espresso into warm cup",                          pour: 36 },
        { t: 30,  label: "Aggressive stretch", desc: "8-10s of air to build very thick foam",               pour: 0  },
        { t: 75,  label: "Minimal texture",    desc: "Brief spin — you want stiff foam, not velvet",        pour: 0  },
        { t: 110, label: "Spoon foam",         desc: "Spoon only the foam onto the shot. Skip the milk",    pour: 0  },
      ],
    },
  ],
  flatwhite: [
    {
      id: "fw1", title: "Aussie Flat White", author: "Melbourne Standard",
      rating: 4.8, dose: 18, water: 36, temp: 93, microns: 250, hasMilk: true, milk: 150,
      steps: [
        { t: 0,   label: "Pull ristretto", desc: "36g out from 18g in — more concentrated shot",            pour: 36  },
        { t: 30,  label: "Purge wand",     desc: "Clear condensation with a brief blast",                   pour: 0   },
        { t: 40,  label: "Minimal stretch",desc: "Just 2-3s of air — no visible bubbles",                   pour: 0   },
        { t: 60,  label: "Texture deep",   desc: "Spin wand deep to create silky microfoam. 60°C",          pour: 0   },
        { t: 100, label: "Pour low",       desc: "Pour from low height to integrate fully. Finish with surface art", pour: 150 },
      ],
    },
  ],
};
