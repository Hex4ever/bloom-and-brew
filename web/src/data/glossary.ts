export interface GlossaryTerm {
  term: string;
  def: string;
}

export const GLOSSARY: GlossaryTerm[] = [
  { term: "Bloom",         def: "The initial 30-45s pour where CO₂ escapes from fresh grounds. Skipping it = sour, uneven extraction." },
  { term: "Extraction",    def: "The process of dissolving flavor compounds from grounds into water. Under = sour, over = bitter, just right = sweet." },
  { term: "TDS",           def: "Total Dissolved Solids — how strong your coffee actually is. Pourover sits around 1.3-1.5%." },
  { term: "Crema",         def: "The golden foam on espresso. CO₂ trapped in oils. Looks pretty, doesn't taste great on its own." },
  { term: "Bypass",        def: "Adding water to brewed coffee to dilute strength without changing extraction. Saves over-extracted shots." },
  { term: "Microfoam",     def: "Steamed milk with tiny, glossy bubbles. The canvas for latte art." },
  { term: "Single Origin", def: "Coffee from one farm, region, or country. The opposite of a blend. Showcases unique terroir." },
  { term: "Honey Process", def: "Coffee dried with mucilage still on the bean. Sweeter, fuller body than washed." },
  { term: "Ratio",         def: "Coffee dose : water weight. 1:16 means 1g coffee per 16g water. Higher = weaker, lower = stronger." },
  { term: "Channeling",    def: "Water finding the path of least resistance through grounds. Causes uneven extraction. Espresso's nemesis." },
  { term: "Refractometer", def: "Tool that measures TDS by reading how light bends through coffee. Removes guesswork." },
  { term: "Cupping",       def: "Standard tasting protocol — break the crust, slurp loudly, evaluate. How professionals score coffee." },
];
