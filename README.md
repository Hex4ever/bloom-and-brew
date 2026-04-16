# Bloom & Brew ☕

**A space to brew slower, drink better.**

Bloom & Brew is a prototype coffee brewing companion that walks you through the perfect cup — from choosing your method, to grinding, to pouring, to logging how it tasted and tweaking the recipe for next time.

![Status](https://img.shields.io/badge/status-prototype-orange)
![Built with](https://img.shields.io/badge/built%20with-React-informational)

---

## Live demo

👉 **[your-url-goes-here]**

*(Replace with your actual deployed URL after hosting)*

---

## What it does

- **9 brewing methods** — V60, Aeropress, Chemex, French Press, Moka Pot, Espresso, Latte, Cappuccino, Flat White
- **24 researched recipes** from Hoffmann, Tetsu Kasuya, Scott Rao, Lance Hedrick, world champions, and community favorites
- **Flavor finder** — describe your ideal cup in plain English ("bright and fruity", "smooth and chocolatey") and get matched recipes
- **Grinder click calculator** — translates recipe grind size into exact clicks for your specific grinder (Comandante, 1Zpresso, Baratza, Timemore, Fellow)
- **Custom brewing animations** for each method — V60 dripper with bloom bubbles, Aeropress plunger pressing down, Moka pot with flickering flame, latte art forming as milk pours
- **Method-specific prep checklists** — every method has its own pre-brew ritual with the "why" behind each step
- **Brew journal** — rate each cup on sweetness, acidity, body, bitterness, aftertaste
- **AI tweak coach** — reads your ratings and tells you exactly what to change next time (grind, temp, ratio, technique)
- **Discover Indian beans** — curated picks from 8 specialty roasters
- **Cafes near you** — geolocation + click-through to Maps
- **Coffee glossary** with 12+ essential terms explained
- **Responsive design** — sidebar layout on desktop, bottom nav on mobile

---

## Tech stack

- **React 18** via CDN (no build step)
- **Babel** in-browser for JSX compilation
- **Vanilla CSS** with CSS variables for theming
- **Inline SVG** for all icons and animations
- **Single HTML file** — the entire app is ~180KB, self-contained

No backend (yet). Everything runs in the browser.

---

## Getting started

### Just want to try it?

Download `index.html` and double-click. Opens in your default browser. No installation.

### Want to host it?

See [`HOSTING.md`](./HOSTING.md) for step-by-step instructions covering Netlify, Vercel, and GitHub Pages.

### Want to know what's inside?

See [`FEATURES.md`](./FEATURES.md) for a complete feature walkthrough.

---

## Roadmap

This is a prototype. The architecture is intentionally simple to keep iteration fast. Next milestones:

- [ ] Persistent storage (`localStorage`)
- [ ] Migration to Vite + React project structure
- [ ] User authentication (Supabase)
- [ ] Cloud-synced journal entries
- [ ] Real AI integration (replacing the rule-based engine with GPT/Claude API calls)
- [ ] Real Google Places integration for cafes
- [ ] OCR bean scanning (Tesseract.js or Vision API)
- [ ] Native mobile app

---

## Credits & acknowledgements

Recipes drawn from:
- James Hoffmann · *The World Atlas of Coffee*
- Tetsu Kasuya · World Brewers Cup Champion
- Scott Rao · *Everything But Espresso*
- Lance Hedrick · YouTube tutorials
- Tim Wendelboe, Onyx Coffee Lab, Blue Bottle, and various WBrC competitors

Bean data for Indian roasters verified from: Blue Tokai, Subko, Araku, Maverick & Farmer, Kapi Kottai, Naivo, Quick Brown Fox.

---

## License

Personal project. Not licensed for redistribution yet.

---

*Made with too much caffeine ☕*
