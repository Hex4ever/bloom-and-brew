import type { MethodId } from "../types";
import type { PrepChecklist } from "../types";

export const DEFAULT_PRE_BREW: PrepChecklist = {
  title: "Before you brew",
  note: "The small rituals that stack into a better cup.",
  steps: [
    { title: "Use fresh water",       desc: "Filtered, freshly boiled. Water quality is 98% of your cup." },
    { title: "Pre-heat your vessel",  desc: "Rinse with hot water to warm it up. Cold equipment drops brew temp fast." },
    { title: "Weigh your coffee",     desc: "Always weigh. Eyeballing is the #1 cause of inconsistent brews." },
    { title: "Grind fresh",           desc: "Grind right before brewing — pre-ground loses 60% of aroma in 15 minutes." },
    { title: "Tare your scale",       desc: "Zero everything out with the vessel and grounds in place." },
  ],
};

export const PRE_BREW: Record<MethodId, PrepChecklist> = {
  v60: {
    title: "Before you pour",
    note: "The fundamentals that separate a good V60 from a great one.",
    steps: [
      { title: "Boil fresh water",        desc: "Filtered or mineral water. Never use previously-boiled water — it's flat." },
      { title: "Fold your filter",        desc: "Fold along the seam, then open into a cone. Seat firmly in the dripper." },
      { title: "Rinse the filter",        desc: "Pour hot water through the filter until fully saturated. This removes paper taste AND pre-heats the dripper and server. Discard the rinse water." },
      { title: "Warm your cup",           desc: "Pour some of that rinse water into your cup too. A cold cup drops brew temp fast." },
      { title: "Weigh and grind",         desc: "Weigh your dose, then grind right before brewing. Ground coffee loses aroma within minutes." },
      { title: "Add grounds to dripper",  desc: "Level the bed with a gentle tap or shake. An even bed = an even extraction." },
      { title: "Place on scale",          desc: "Tare the scale to zero with everything in place. You're ready." },
    ],
  },
  chemex: {
    title: "Before you pour",
    note: "Chemex filters are 20-30% thicker than V60 — rinsing is non-negotiable.",
    steps: [
      { title: "Boil fresh water",         desc: "Filtered water, freshly boiled. Chemex benefits from slightly hotter water (96°C)." },
      { title: "Unfold the filter",        desc: "Thick side (3 layers) against the pour spout — this keeps the filter from collapsing." },
      { title: "Rinse thoroughly",         desc: "Use ~300ml of hot water. Chemex paper is thick and needs real rinsing to remove the cardboard taste." },
      { title: "Discard rinse water",      desc: "Pour out through the spout — it also warms the flask." },
      { title: "Weigh and grind",          desc: "Use a medium-coarse grind, a touch coarser than V60." },
      { title: "Add grounds and level",    desc: "Gently tap to settle. With Chemex you want a flat, even bed." },
      { title: "Tare the scale",           desc: "Everything on the scale, zeroed out." },
    ],
  },
  aeropress: {
    title: "Before you press",
    note: "Aeropress is forgiving, but these details still matter.",
    steps: [
      { title: "Boil water",              desc: "Most Aeropress recipes use cooler water (80-90°C) than pourovers. Let it rest 30-60s off the boil." },
      { title: "Choose orientation",      desc: "Standard (upright) or inverted? This recipe uses whichever the author specified." },
      { title: "Rinse the filter",        desc: "Place paper filter in the cap, rinse with hot water. Quick step but removes paper taste." },
      { title: "Attach the cap",          desc: "Screw on tightly — it should be snug but not cranked." },
      { title: "Weigh and grind",         desc: "Medium-fine grind, similar to table salt. Finer for shorter steeps, coarser for longer." },
      { title: "Add grounds",             desc: "Funnel the grounds in. Tap the side to settle them evenly." },
      { title: "Pre-wet the grounds",     desc: "Optional but recommended: a quick bloom with a splash of water, stir once, wait 10s. Evens the extraction." },
    ],
  },
  french: {
    title: "Before you steep",
    note: "French Press is about immersion — get the prep right and it runs itself.",
    steps: [
      { title: "Boil water",              desc: "Fresh, filtered. French Press likes 93-96°C." },
      { title: "Pre-heat the carafe",     desc: "Pour hot water into the empty press, swirl, discard. A cold glass carafe drops temp by 5-8°C." },
      { title: "Weigh and grind",         desc: "Coarse grind — like rough sea salt. Too fine and you'll get sludge and bitterness." },
      { title: "Add grounds to carafe",   desc: "Pour them in, give the press a gentle tap to level." },
      { title: "Position the plunger",    desc: "Place it on top (don't push down yet). This traps heat during steep." },
      { title: "Have your timer ready",   desc: "French Press needs precise timing — 4 minutes is the standard." },
    ],
  },
  moka: {
    title: "Before you heat",
    note: "Moka pots reward patience. The whole ritual takes 6-8 minutes.",
    steps: [
      { title: "Start with hot water",   desc: "Counter-intuitive but crucial: use pre-heated water in the bottom chamber. This prevents grounds from cooking and getting bitter." },
      { title: "Fill to the valve",      desc: "Water level just below the safety valve. Never above." },
      { title: "Insert the funnel",      desc: "The metal filter basket sits on top of the water chamber." },
      { title: "Grind medium-fine",      desc: "Finer than filter, coarser than espresso. Think table salt." },
      { title: "Fill the basket",        desc: "Level with the rim — don't tamp. Tamping causes pressure build-up and bitterness." },
      { title: "Screw tightly",          desc: "Use a towel if the base is hot. A loose seal leaks steam and ruins extraction." },
      { title: "Medium heat, lid open",  desc: "Watch the coffee stream. You want a steady honey-coloured pour, not a violent sputter." },
    ],
  },
  espresso: {
    title: "Before you pull",
    note: "Espresso is the least forgiving brew method. Every variable matters.",
    steps: [
      { title: "Warm the machine",           desc: "15-20 minutes minimum. Group head, portafilter, cup — all need to be hot." },
      { title: "Flush the group",            desc: "Run a 2-3 second flush to stabilise temperature and clean any old grounds." },
      { title: "Weigh your dose",            desc: "Exactly — espresso is sensitive to 0.1g differences. Follow the recipe." },
      { title: "Grind fresh",               desc: "Directly into the portafilter. Espresso grind should look like fine powder, almost like flour." },
      { title: "Distribute and level",       desc: "Tap, WDT (weiss distribution technique), or swirl to break up clumps. Uneven distribution = channeling." },
      { title: "Tamp evenly",               desc: "Consistent pressure, level tamp. About 15-20kg of force — the exact number matters less than consistency." },
      { title: "Lock and brew immediately", desc: "Don't let the portafilter sit in the group head. The hot metal starts extracting before water hits." },
    ],
  },
  latte: {
    title: "Before you pour",
    note: "Great latte = great espresso + great milk texture. Both need prep.",
    steps: [
      { title: "Warm the machine",       desc: "15+ minutes. Especially the steam wand and boiler." },
      { title: "Warm your cup",          desc: "Rinse with hot water. A cold ceramic cup kills the foam texture in seconds." },
      { title: "Pour cold milk",         desc: "Fresh, cold, whole milk from the fridge. Cold milk gives you more time to texture before it overheats." },
      { title: "Purge the steam wand",   desc: "Before AND after. Blast steam to clear condensation and old milk residue." },
      { title: "Prep espresso gear",     desc: "Grind, distribute, tamp. Pull the shot directly into the warmed cup." },
      { title: "Position the wand",      desc: "Just below the milk surface, slightly off-center. This is where microfoam happens." },
    ],
  },
  cappuccino: {
    title: "Before you pour",
    note: "Cappuccino is all about the foam — stretch harder, texture longer.",
    steps: [
      { title: "Warm the machine and cup",  desc: "15+ minutes for the machine. Cup warmed with hot water." },
      { title: "Cold milk, smaller pitcher",desc: "Use a 12oz pitcher for a single cappuccino — a bigger one won't let you control the foam." },
      { title: "Purge the wand",           desc: "Steam blast, wipe clean." },
      { title: "Pull the espresso shot",   desc: "Straight into the warmed cup. Thick crema is the base you'll pour onto." },
      { title: "Stretching is key",        desc: "Unlike latte, you want the 'tssss' sound for the first 5-8 seconds — that's air incorporating into foam." },
    ],
  },
  flatwhite: {
    title: "Before you pour",
    note: "Silky microfoam, no dry foam. It's all in the texturing.",
    steps: [
      { title: "Warm everything",             desc: "Machine, cup, and the flat white cup should all be hot." },
      { title: "Cold, fresh whole milk",      desc: "Whole milk only — lower fat content won't produce proper velvet microfoam." },
      { title: "Purge the steam wand",        desc: "Clean and ready." },
      { title: "Pull a double ristretto",     desc: "Shorter shot than a latte — around 36g out for 18g in. More concentrated flavour." },
      { title: "Texture minimally",           desc: "Brief stretching — just 2-3 seconds of air. Then spin deep to polish. No visible bubbles, ever." },
    ],
  },
};
