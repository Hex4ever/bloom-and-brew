# Bloom & Brew — Progress & Handoff

This file is the live log of what has been done, what is next, and how to resume. Read this first when opening the project in a new session.

**Last updated:** 2026-04-16 (end of session 2)
**Current phase:** Phase 0 — Project foundation (6 of 14 tasks done)
**Plan of record:** `BUILD_PLAN.md`
**Model rules:** `MODELS.md`
**Head of `main`:** `e08f17c` — feat(data): port all static data from prototype

---

## Quick resume checklist

When you open a new session:

1. `cd /Users/praveenkumarv/bloombrewvs`
2. `nvm use` (picks up `.nvmrc` → Node 22.17.0; system default stays on Node 18)
3. Read this file, then `BUILD_PLAN.md` for the full plan.
4. Jump to the **Next up** section below.
5. Model: start on **Sonnet 4.6** for coding (the bulk of task #7 is mechanical porting of pure functions). Escalate to **Opus 4.6** only if you hit a hard algorithmic question or a tricky refactor. Haiku is not in the loop for code.

---

## Phase 0 task checklist

- [x] #1 Move `index.html` to `reference/`
- [x] #2 `git init` + initial commit
- [x] #3 Scaffold Vite + React 19 + TS 6 in `web/`
- [x] #3b Commit the Vite scaffold
- [x] #4 Create directory structure in `web/src/`: `pages/`, `components/`, `lib/`, `data/`, `styles/`, `types/` (empty dirs tracked via `.gitkeep`; `types/` and `data/` now have real files, `.gitkeep` stays in the still-empty ones)
- [x] #5 Define TypeScript data models in `web/src/types/`
- [x] #6 Port static data into `web/src/data/`
- [ ] **#7 Port pure logic to `web/src/lib/` + unit tests** ← next up (see below)
- [ ] #8 Build `web/src/lib/storage.ts` — typed localStorage wrapper with a schema version field (so the Supabase swap in Phase 3 is one file's worth of change)
- [ ] #9 Port shared components to `web/src/components/`: `Timer`, `SVGScene`, `PrepChecklist`, `Sliders`, `RatingBars`, `BottomNav`, `Sidebar`, `SettingsModal`
- [ ] #10 Port pages to `web/src/pages/`: Dashboard, MethodPicker, Setup, RecipeList, PreBrew, Brewing, Rating, Journal, Tweak, Discover, Cafes, Glossary, Community, SubmitRecipe, BeanLog. Install `react-router-dom` and wire routing.
- [ ] #11 Port CSS to `web/src/styles/` — keep every CSS variable name identical; split by concern (base, layout, components)
- [ ] #12 ESLint + Prettier + Husky pre-commit; add npm scripts `lint`, `format`, `typecheck`
- [ ] #13 Visual-parity check against `reference/index.html` in desktop and mobile widths
- [ ] #14 Deploy to Vercel (only once parity is confirmed)

**Exit criteria for Phase 0:** deployed URL looks pixel-identical to opening `reference/index.html` locally, and refreshing no longer wipes the journal.

---

## Next up: Task #7 — port pure logic to `web/src/lib/`

Four pure functions + vitest. All currently live inline inside React components in `reference/index.html`; extract them into typed, tested modules. Types already exist in `web/src/types/`; data already exists in `web/src/data/`.

### 7a. Set up vitest

```bash
cd web
npm i -D vitest @vitest/coverage-v8
```

Add scripts to `web/package.json`:

```json
"scripts": {
  "test": "vitest",
  "test:run": "vitest run",
  "test:cov": "vitest run --coverage"
}
```

No separate `vitest.config.ts` needed — Vitest reads `vite.config.ts`.

Tests co-located: `web/src/lib/<module>.test.ts`.

### 7b. The four modules

**`lib/grinderMath.ts`**
- Input: `Grinder`, `microns` (target grind size), `adjustmentClicks?` (from tweak engine, ±N)
- Output: `{ clicks: number, supportsHalf: boolean, display: string }` — display like "23" or "23.5"
- Rules:
  - `clicks = microns * grinder.clicksPerMicron`
  - Hand grinders with half-click detents: `supportsHalf = ["c40", "jx", "k6"].includes(grinder.id)` — round to nearest 0.5
  - Others: round to nearest whole click
  - Reference: `reference/index.html` line 1692 (`supportsHalf`), line 1711 (display formatting)
- Tests: one per grinder id covering a typical micron value; edge cases for 0 and very-large microns.

**`lib/recipeScaling.ts`**
- Input: `Recipe`, `cups: number` (0.5–8, 0.5 increments)
- Output: scaled `{ dose, water, temp, microns, milk? }` + scaled `RecipeStep[]` + `totalTime` (seconds)
- Rules (all from `reference/index.html` lines 1641–1700):
  - `dose`, `water`, `milk`, step `pour` values: linear × cups
  - `temp`: unchanged
  - Brew time: `Math.sqrt(cups)` × original — doubling volume ≠ doubling time
  - Step `t` (offset): scale by `Math.sqrt(cups)` too, so the whole schedule stretches consistently
  - Grind coarser for bigger batches: `adjMicrons = Math.round(recipe.microns * (1 + (cups - 1) * 0.05))` — 5% coarser per additional cup
  - Step `desc` strings: prototype rewrites "Pour to 100g" → "Pour to 200g" when cups=2. See how it does the regex rewrite around line 1650ish; replicate or leave strings unchanged and render cups-aware sub-text in the UI.
- Tests: identity at cups=1, 2× all masses at cups=2, time stretch by √2, micron bump.

**`lib/flavorMatch.ts`**
- Input: free-text flavor query, optional method filter
- Output: ranked `{ recipe: Recipe, score: number, profile: RatingAxes, matchedKeywords: string[] }[]`
- Rules (reference lines 1076–1236):
  - `FLAVOR_KEYWORDS` maps words → axis deltas (positive/negative). Port this map as a const.
  - Parse user text → build target profile across the 5 rating axes (baseline 5 + sum of deltas, clamped to 0–10)
  - Each recipe has an implicit profile (prototype computes it by method — see line 1153 `byMethod`). Port that table.
  - Score each recipe: `-Math.sqrt(sum of squared distances per axis) + ratingBoost` where `ratingBoost = recipe.rating * 0.3` (line 1198)
  - Return top-N sorted descending by score; include matched keywords for the pills UI
  - If no keywords parsed, return a clearly-flagged empty/low-confidence result
- Tests: exact-match queries ("bright and fruity"), unknown-word queries, method filter narrows set, ordering is stable for ties.

**`lib/tweakEngine.ts`**
- Input: `JournalEntry` (has scores, recipe params, clicks, grinder)
- Output: `{ diagnosis: string, suggestions: Array<{ axis: 'Grind'|'Temp'|'Time'|'Ratio'|'Bean', change: string, why: string }> }`
- Rules: reference `generateTweaks` at line 3066 and follow-on Q&A helpers around 3283. Key heuristics (coffee-science rules of thumb):
  - Bitter + low sweetness → over-extracted: coarser grind, lower temp, faster pour
  - Sour + low sweetness → under-extracted: finer grind, raise temp, extend brew
  - Thin body → stronger ratio, less agitation
  - Muddy + bitter → coarser grind, rinse filter longer
  - Short aftertaste → check bean freshness, improve water quality
- Return deterministic, ordered suggestions; concrete numbers computed from the entry's actual dose/water/temp/clicks.
- Tests: five-ish canonical scorecards → expected primary diagnosis; assert suggestion numbers match the computed values (no literal strings; interpolate from input).

### 7c. Guardrails

- `import type` from `../types` where needed (`verbatimModuleSyntax: true`).
- No React imports — these are pure. If you find yourself reaching for `useMemo`, you're in the wrong file.
- Aim for 100% branch coverage on `grinderMath` and `recipeScaling`; ~80% on the two rule-based engines is fine.
- After each module: `npx tsc --noEmit -p tsconfig.app.json` and `npm run test:run` both clean.
- Commit per-module (or one commit for all four if tests pass cleanly). Prefix messages `feat(lib): ...`.

### 7d. Open algorithmic questions to watch for

- **Flavor keyword parsing**: the prototype is a naive substring match. Fine for MVP; document the precision/recall tradeoff in a code comment so Phase 4's Claude-powered swap is unsurprising.
- **Tweak suggestion magnitudes**: the prototype picks +/- values that "feel right" to a coffee enthusiast. If you want these exact, cross-reference with the prototype line-by-line; otherwise codify them as named constants at the top of `tweakEngine.ts` so they're tunable in one place.
- **Step-description rewrites during scaling**: if you preserve the prototype's regex approach, note that it breaks for recipes that don't phrase things as "Pour to Xg" (most don't). Simpler: don't rewrite step descs, just show the scaled `dose/water/milk` in the prep card header and let the step descs reference "the target weight" generically. Check visual parity against the prototype either way before locking this in.

---

## What's on disk now (as of 2026-04-16 end of session 2)

```
bloombrewvs/
  .git/                          4 commits on main
  .gitignore                     node_modules, .env, dist, .venv, .vercel, .supabase, etc.
  .nvmrc                         "22"
  BUILD_PLAN.md                  9-phase plan (stable)
  MODELS.md                      Opus/Sonnet/Haiku routing
  PROGRESS.md                    this file
  README.md                      original prototype README
  FEATURES.md                    complete feature spec
  HOSTING.md                     original hosting notes
  projectcontext.md              user's original instructions
  reference/
    index.html                   prototype, 181KB, design-locked
  web/
    package.json                 Vite 8, React 19, TS 6
    tsconfig.app.json            verbatimModuleSyntax + erasableSyntaxOnly
    vite.config.ts, eslint.config.js, index.html, dist/ (gitignored)
    node_modules/                gitignored
    public/                      favicon + icons
    src/
      App.tsx, main.tsx, index.css, App.css, assets/  default Vite template still
      types/
        index.ts                 barrel
        method.ts                METHOD_IDS, Method, MethodId, BrewingMethodCategory, MethodDifficulty
        recipe.ts                Recipe, RecipeStep, RecipesByMethod
        grinder.ts               Grinder, GrinderType
        bean.ts                  Bean, BeanSource, CuratedBean
        journal.ts               RATING_AXIS_KEYS, RatingAxes, RatingAxisKey, JournalEntry
        prep.ts                  PrepStep, PrepChecklist, PrepChecklistsByMethod
        settings.ts              UserSettings, Units, TempUnit
      data/
        index.ts                 barrel
        methods.ts               9 Method[]
        grinders.ts              6 Grinder[]
        recipes.ts               26 recipes (RecipesByMethod)
        glossary.ts              12 terms + GlossaryTerm type
        indianBeans.ts           8 CuratedBean[] (renamed `source` → `availability`)
        cafes.ts                 6 Cafe[] + Cafe type
        content.ts               SCORE_AXES, TIPS, FUN_FACTS + ScoreAxisConfig type
        preBrew.ts               PRE_BREW (all 9 methods) + DEFAULT_PRE_BREW
        feed.ts                  3 CommunityPost[] seeds + CommunityPost type
      pages/.gitkeep             empty (task #10)
      components/.gitkeep        empty (task #9)
      lib/.gitkeep               empty (task #7 next)
      styles/.gitkeep            empty (task #11)
```

Working tree is clean. Everything is committed.

---

## Sessions log

### Session 1 (2026-04-16) — foundation decisions
- Locked frontend design (`reference/index.html`) pending working backend.
- Chose Supabase free tier, monorepo layout with `web/`.
- Pinned Node 22.17.0 per-project via `.nvmrc`; system Node 18 untouched.
- Scaffolded Vite 8 + React 19 + TypeScript 6 in `web/`.
- Original `git init` happened at `/Users/praveenkumarv/PycharmProjects/bloomanbrew` — that path is now abandoned.

### Session 2 (2026-04-16) — re-init + types + data
- Re-init git at `/Users/praveenkumarv/bloombrewvs`; old PycharmProjects path discarded (its `.git` is not migrated).
- Committed Vite scaffold, updated PROGRESS.md paths (task #3b).
- Created `src/` folder skeleton with `.gitkeep` in empty dirs (task #4).
- Wrote 7 type modules + barrel; `MethodId` is a literal union (enables exhaustiveness in switches), all `id` fields on user-mutable entities are `string` (prepares for Supabase uuid migration) (task #5).
- Ported all 11 static-data modules + barrel. Key naming fix: `CuratedBean.source` renamed to `availability` to avoid collision with `Bean.source` (provenance vs. sales channel). Secondary fix: Chemex single-cup recipe id changed from `c2` to `chemex-single` to avoid collision with Timemore C2 grinder id (task #6).
- Four commits total; `tsc --noEmit` clean after every file write; no runtime code uses the types/data yet (will start at task #7).

---

## How to run the project locally

```bash
cd /Users/praveenkumarv/bloombrewvs
nvm use                    # → Node 22 via .nvmrc
cd web
npm run dev                # Vite dev server on http://localhost:5173
```

To compare against the original:

```bash
open reference/index.html  # opens the prototype in your default browser
```

To build & verify:

```bash
cd web
npm run build
npm run preview            # serve the production build
npx tsc --noEmit -p tsconfig.app.json   # typecheck without emit
```

---

## Current tech versions

| Tool | Version | Notes |
|---|---|---|
| Node | 22.17.0 | via `nvm use` |
| npm | 10.9.2 | ships with Node 22 |
| Vite | 8.0.8 | |
| React | 19.2.4 | |
| TypeScript | 6.0.2 | `verbatimModuleSyntax`, `erasableSyntaxOnly`, `noUnusedLocals` all on |
| ESLint | 9.39.4 | Vite default; tighten in task #12 |
| Vitest | — | install in task #7 |

---

## Open questions to revisit

1. **GitHub remote** — when to create it; keep monorepo in one repo or split when mobile is added.
2. **zsh auto-switch hook** — ever want it? (5 lines in `~/.zshrc`)
3. **Custom domain** — eventual production URL (e.g. `bloomandbrew.app`); buy early so DNS propagation is not a launch-week problem.
4. **Admin UI for recipe submissions** — MVP assumes manual SQL promotion; decide by end of Phase 3 whether to build a simple admin view before launch.
5. **Monetization / Pro tier** — not required for launch; if on roadmap, Stripe integration slots into Phase 6/7.
6. **Step-description rewrites during scaling** — see task #7d above; decide now so it does not leak into pages (#10).

---

## How this file stays useful

- Update **Sessions log**, **What's on disk**, and **Phase 0 task checklist** at the end of each working session.
- When a task completes, check it off inline and move the detailed breakdown out of "Next up" into the sessions log entry for that day.
- When phase boundaries cross, add a new **Phase N handoff** section below the current Next-up block.
- If a decision changes, record the reversal *and the reason* so future you does not re-litigate it.
