# Bloom & Brew — Feature Guide

A complete walkthrough of every feature, screen, and hidden detail in the app.

---

## The dashboard

The first thing you see on every launch.

**What you'll find:**

- **Time-aware greeting** — "Good morning", "Good afternoon", or "Good evening" based on your system clock, followed by your name (set in Settings)
- **Big cream "New brew" CTA** — the primary action, takes you to the method picker
- **Six dashboard cards:**
  - **Brew Journal** — your logged brews with ratings
  - **Discover Beans** — curated Indian specialty roasters
  - **Cafes Near Me** — geolocation-based cafe finder
  - **Coffee Glossary** — dictionary of brewing terms
  - **Add New Recipe** — submit your own
  - **Bean Log** — beans you own, manually added or scanned
- **Weekly stats panel** — mock data showing 12 brews, 4.7 avg score, 3 methods used, plus a 7-day bar chart
- **Tip of the Day** — randomized brewing tip on each visit
- **Fun Fact** — randomized coffee trivia on each visit

**Settings icon** (top right on mobile, sidebar on desktop) opens a modal for:
- Display name
- Units (Metric/Imperial)
- Temperature (Celsius/Fahrenheit)
- Auto-play music toggle
- Step notifications toggle

---

## Choosing a brewing method

The method picker organizes 9 methods into 4 categories:

### Filter
- **V60 Pourover** — the specialty standard, 1:16 ratio, 3:30 brew time
- **Aeropress** — forgiving, 1:14 ratio, 2 minutes
- **Chemex** — clean and tea-like, 1:17 ratio, 5 minutes

### Immersion
- **French Press** — rich and sedimented, 1:15 ratio, 4 minutes

### Pressure
- **Moka Pot** — intense stovetop espresso, 1:10 ratio, 6 minutes
- **Espresso** — concentrated, 1:2 ratio, 25-30 seconds

### Milk drinks
- **Latte** — espresso + steamed microfoam
- **Cappuccino** — espresso + stretched foam
- **Flat White** — ristretto + silky velvet microfoam

Each card shows the method's brew time, typical ratio, and difficulty (Easy/Medium/Hard).

---

## Setup — your grinder and beans

Asked at the start of every recipe so the app can personalize.

### Step 1: Your grinder

Six grinders supported, each with calibrated click-per-micron values:

- **Comandante C40** — premium hand grinder, 33 clicks per 1000 microns
- **1Zpresso JX** — 77 clicks per 1000 microns (finer adjustment)
- **1Zpresso K-Ultra** — 12.5 clicks per 1000 microns
- **Baratza Encore** — electric, 25 clicks per 1000 microns
- **Timemore C2** — budget hand grinder, 40 clicks per 1000 microns
- **Fellow Ode Gen 2** — electric, 30 clicks per 1000 microns

Each grinder's clicks are rounded appropriately — hand grinders with half-click detents (Comandante, 1Zpresso) show half-click positions, stepped grinders (Encore, C2, Ode) round to whole numbers.

### Step 2: Your beans

Two ways to add beans:

1. **Scan packaging** — opens your camera, simulates OCR to auto-fill roaster, origin, roast level, and tasting notes
2. **Pick from your log** — select from previously scanned or added beans

---

## The recipe list

### Flavor Finder (the highlight feature)

At the top of every recipe list, a collapsible card asking **"What flavour are you after?"**

Type anything — "bright and fruity with berry notes", "bold chocolatey and smooth", "floral and delicate" — and the app:

1. Parses your text against 60+ known flavor keywords
2. Builds a target taste profile across 5 axes
3. Scores every recipe across all methods by distance to your target
4. Shows the top 3 matches with the best highlighted in gold

Suggestion chips ("bright and fruity", "bold and chocolatey", "smooth with low acidity", "floral and delicate", "creamy and sweet") let you tap one if you don't feel like typing.

The matched flavor words appear as pills so you see what the engine picked up. If it couldn't recognize any flavor words, it tells you honestly and shows best guesses.

### Surprise me / Auto-choose

Two quick buttons beneath:

- **Surprise me** — random recipe from the current method
- **Auto-choose** — highest-rated recipe for your beans

### The full recipe list

Each recipe card shows:
- Recipe number and title
- Author (Hoffmann, Kasuya, Rao, etc.)
- Key parameters as pills: dose, water, temp, rating
- A "+ Milk" indicator for milk drinks

---

## Pre-brew (the "Get Ready" screen)

Before you start, the app shows:

### Servings scroller
Adjust cups from 0.5 to 8. Dose, water, milk, and step times all scale automatically. Step descriptions auto-update (e.g. "Pour to 100g" becomes "Pour to 200g" for 2 cups). Grind goes slightly coarser for larger batches (real brewing principle).

### Prep cards (grid)
- **Dose** — coffee weight for current serving size
- **Water** — water weight + current ratio
- **Temp** — water temperature (with reminder to heat kettle)
- **Grind** — exact click count for your selected grinder
- **Milk** (only for milk drinks) — milk weight + target steaming temp

### Schedule
All brewing steps with their timing, plus a total time at the bottom.

### Pre-brew checklist
Method-specific setup ritual with checkboxes. Each step has a title, a "why" description, and a tap-to-check interaction. Progress counter (3/7) at the top. When everything's checked, the card glows amber and the icon switches from lightbulb to checkmark.

**Per-method checklists include:**
- **V60** (7 steps): boil water, fold filter, rinse filter, warm cup, weigh & grind, add grounds, tare scale
- **Chemex** (7 steps): emphasizes the extra-thick filter rinse and triple-layer orientation
- **Aeropress** (7 steps): standard vs inverted, filter rinse, optional pre-wet
- **French Press** (6 steps): preheat carafe, coarse grind, plunger position, timer
- **Moka Pot** (7 steps): pre-heated water, no tamping, tight seal, watch stream
- **Espresso** (7 steps): warm machine, flush group, WDT, even tamp, lock and brew
- **Latte** (6 steps): warm everything, cold milk, purge wand, wand position
- **Cappuccino** (5 steps): stretching for thick foam, smaller pitcher
- **Flat White** (5 steps): ristretto, minimal stretch, silky texture

---

## The brewing experience

When you tap "Start brewing," the timer begins.

### Two-column timer
- **ELAPSED** — how long you've been brewing, "OF X:XX" total
- **NEXT IN** — countdown to the next step, with the next step's name underneath (in accent gold)

Both use tabular numerals so digits don't jitter as they tick.

### Animated scene
Custom SVG animation for every method:

- **V60** — kettle pouring, dripper with bloom bubbles rising, pour stream, carafe filling
- **Chemex** — distinctive hourglass shape with wooden collar, coffee filling bottom bulb
- **Aeropress** — plunger descends during press, bubbles rise during steep
- **French Press** — plunger rod descends, grounds float during steep
- **Moka Pot** — water transfers from bottom to top chamber, flickering stovetop flame, steam from spout
- **Espresso** — group head with twin spouts into shot glasses, animated pressure gauge climbing to 9 BAR
- **Milk drinks** — steam wand with rising vapor, milk pitcher with swirling microfoam, shot pulling, milk pouring with rosetta latte art dots forming

### Jazz music toggle
Top-right icon. When on, shows a spinning vinyl widget with animated EQ bars labeled "Smooth Brew Sessions · Funky Jazz". Currently visual only — no actual audio (would need a licensed stream or royalty-free tracks).

### Current step card
Shows step number, label, and full description. Live pulse dot during active brewing.

### Progress bar
A thin accent-colored line filling from left to right as the brew progresses.

---

## Rating and logging

When brewing finishes, the done screen prompts for a rating.

### Quick save (1 tap)
- Overall rating slider (1-10) visible immediately
- "UNDRINKABLE" to "PERFECT" labels
- **Save to profile** stores a minimal entry
- Confirmation screen with link to journal

### Detailed log (5 axes + notes)
Tap **"Rate in detail"** to open the full logging screen:

- **Sweetness** (Flat ↔ Sweet)
- **Acidity** (Dull ↔ Bright)
- **Body** (Thin ↔ Heavy)
- **Bitterness** (None ↔ Strong)
- **Aftertaste** (Short ↔ Lingering)
- **Overall** (1-10)
- Free-form notes field

---

## The brew journal

Accessible from the dashboard, sidebar, or bottom nav.

Shows:
- Total brews logged
- Average overall rating
- Method breakdown pills (e.g. "V60 · 8", "AEROPRESS · 3")

Each entry displays:
- Recipe title and date
- Bean + grinder used
- Score bars for all 5 axes (visualized with accent-colored fills)
- Overall rating in large gold text
- Your written notes in italic
- **"Tweak" button** — opens the AI coach for that brew

Quick-logged entries show with a dashed border and an **"Add detailed rating →"** button to upgrade them to full entries later.

---

## The AI tweak coach

Tap "Tweak" on any journal entry.

### What it gives you:

1. **Diagnosis in plain English** based on your scores — e.g. *"Over-extracted — water pulled too much from the grounds"* or *"Bright but unbalanced — acidity dominates"*

2. **Specific, ordered suggestions** with axis labels (Grind, Temp, Time, Ratio, Bean) and concrete numbers calculated from your actual recipe — *"Drop to 91°C"*, *"Try 234g water"*, *"Grind 1-2 clicks coarser"*

3. **Q&A chat box** — ask follow-ups like:
   - "Why is it bitter?"
   - "How do I get more body?"
   - "Should I change beans?"
   - "What temperature should I use?"
   
   The coach reads your specific scores and recipe parameters to give tailored answers.

### How it actually works

The engine is **rules-based**, not a real LLM. It applies established coffee science:

- **Bitter = over-extracted** → grind coarser, lower temp, pour faster
- **Sour + low sweetness = under-extracted** → grind finer, raise temp, extend brew
- **Thin body** → stronger ratio, less agitation
- **Muddy and bitter** → coarser grind, rinse filter longer
- **Short aftertaste** → check bean freshness, improve water quality

All diagnoses reference the Hoffmann/Rao/Hedrick school of thinking. When you eventually add real AI via API, the UI stays exactly the same — you just swap the `generateTweaks` function for an API call.

---

## Discover Beans (Indian specialty roasters)

Curated picks from 8 roasters:

- **Blue Tokai** — Attikan Estate, Coorg
- **Subko** — Vienna Roast, Chikmagalur
- **Araku Coffee** — Monsoon Malabar + Gems of Araku
- **Kapi Kottai** — Anaerobic Natural, BR Hills
- **Maverick & Farmer** — Ratnagiri Estate, Chikmagalur
- **Naivo Coffee** — Sangameshwar Peaberry
- **Quick Brown Fox** — Riverdale, Yercaud

Each card includes:
- Roaster + origin
- Tasting notes in italic quotes
- Description paragraph
- Price (₹ per 250g)
- Where to buy (online, cafes, specific cities)
- **"Find" button** opens Google search for the bean

Filter tabs: All / Online / In stores

Ends with a "Did You Know" card: *India is the world's 7th largest coffee producer — most of it grown under shade in the Western Ghats.*

---

## Cafes Near Me

On load, asks for browser geolocation permission.

If granted: shows cafes sorted by distance.
If denied: shows a dashed warning banner and demo locations.

Each cafe card shows:
- Name with external-link icon
- Area, distance
- Rating with star
- Tags (V60, Espresso, Single Origin, Specialty, etc.)

**Tap any card** → opens Google Maps in a new tab with the cafe pre-searched.

Demo data covers 6 Bangalore specialty spots: Third Wave Coffee (Indiranagar), Subko (Koramangala), Blue Tokai (Indiranagar), Maverick & Farmer (Kalyan Nagar), Dope Coffee (HSR), Araku Coffee (Lavelle Road).

---

## Coffee Glossary

Dictionary of 12 essential brewing terms:

- **Bloom** — the initial 30-45s pour where CO₂ escapes
- **Extraction** — dissolving flavor from grounds
- **TDS** — Total Dissolved Solids
- **Crema** — the golden foam on espresso
- **Bypass** — diluting to fix over-extraction
- **Microfoam** — glossy steamed milk
- **Single Origin** — coffee from one farm or region
- **Honey Process** — drying coffee with mucilage
- **Ratio** — coffee dose to water weight
- **Channeling** — uneven water path, espresso's nemesis
- **Refractometer** — tool for measuring TDS
- **Cupping** — standardized tasting protocol

Live search bar at top filters as you type.
Quick tip card at the bottom rotates on each visit.

---

## Community feed

Post + scroll feed for sharing brews:

- Mock posts from other users (kenji.brews, morning_pour, slow_drip_co)
- Each post has avatar, username, time ago, caption, likes, comments
- Like button increments count
- **"What's brewing?"** composer for creating new posts (text + photo upload button)

Note: posts are in-memory only — they don't persist across sessions yet.

---

## Submit recipe

Share your own brewing method with the community.

Form fields:
- Recipe title
- Brewing method (3-column picker — required if entered from dashboard)
- Dose (g)
- Water (g)
- Temp (°C)
- Notes & method (free-form)

Submit button disabled until title + method are filled. Shows success screen with award icon on submit.

Note: submissions are in-memory — they don't actually upload anywhere yet (needs backend).

---

## Bean Log

Your personal beans archive.

Shows all beans you've scanned or added manually. Each card:
- Bean name, date added
- Roaster, roast level
- Tasting notes in italic

Scan button in header opens the camera flow.

---

## Settings

Accessible from the dashboard (mobile) or sidebar (desktop).

**Display name** — shown in greetings and feed posts.

**Units toggle** — Metric (grams) or Imperial (ounces). *Currently cosmetic — recipe calculations still use grams. Full imperial support is a future upgrade.*

**Temperature toggle** — Celsius or Fahrenheit. *Also currently cosmetic.*

**Auto-play music during brew** — if on, the jazz widget opens automatically when a brew starts.

**Step notifications** — would enable browser push notifications for step changes. *Needs backend integration to actually fire notifications.*

**About** section at the bottom.

---

## Responsive design

### Mobile (< 900px)
- 440px max content width, centered with side borders
- Bottom nav bar with 5 icons: Home, Brew, Journal, Beans, Cafes
- Single-column layouts throughout
- Larger tap targets
- Settings accessed via icon on dashboard

### Desktop (≥ 900px)
- 240px sidebar with 7 nav items: Home, Brew, Brew Journal, Discover Beans, My Bean Log, Community, Cafes Near Me, Glossary
- 1100px max content area, centered
- Multi-column grids (2-column on most pages)
- Hero card layout on dashboard (1.4fr + 1fr split)
- Sidebar shows "Bloom & Brew" branding with flower mark
- Settings accessed via button at bottom of sidebar

---

## Hidden details worth noticing

- **Brew times scale by √(volume)** — doubling cups doesn't double brew time, just extends it proportionally
- **Step descriptions auto-update** — "Pour to 100g" becomes "Pour to 200g" for 2 cups
- **Grind goes slightly coarser for bigger batches** — real brewing principle baked in
- **Every icon is inline SVG** — no external icon library, so there's no flicker on load
- **Every animation is CSS or SVG** — no images, no GIFs
- **Fallback handling** — if a recipe is missing its step data, the app generates sensible defaults rather than crashing
- **Error recovery** — a global error boundary catches crashes and shows a friendly "The pour spilled" recovery screen
- **Tab-aware cafe search** — opens in `target="_blank"` so your brew session doesn't get interrupted

---

## Known limitations

This is a prototype. Things to keep in mind:

- **No persistence** — refreshing loses your journal, beans, and settings. Fixing this requires `localStorage` (small change) or a backend (big change).
- **No actual AI** — the tweak engine and flavor matcher are rule-based. Real LLM integration requires a backend to protect API keys.
- **No real cafe data** — the list is hardcoded Bangalore spots. Google Places API would fix this (needs a backend).
- **No real OCR** — the bean scanner is simulated. Tesseract.js or a Vision API could make it real.
- **No real audio** — the jazz widget is visual only.
- **No accounts** — everything is local to your browser, per-device.
- **Babel compiles in-browser** — slows initial load by ~2 seconds. Moving to Vite's build-time compilation fixes this.

See the [README](./README.md) roadmap for the planned upgrade path.

---

## Credits

All recipes drawn from published sources (Hoffmann, Rao, Kasuya, Hedrick, Wendelboe, WBrC champions). Indian bean data verified from roaster websites. Glossary definitions written for this app. UI design original.
