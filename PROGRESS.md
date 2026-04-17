# Bloom & Brew — Progress & Handoff

This file is the live log of what has been done, what is next, and how to resume. Read this first when opening the project in a new session.

**Last updated:** 2026-04-17 (session 4)
**Current phase:** Phase 0 — Project foundation (9 of 14 tasks done)
**Plan of record:** `BUILD_PLAN.md`
**Model rules:** `MODELS.md`
**Head of `main`:** `1603aba` — feat(components): port 8 shared components with tests

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
- [x] **#7 Port pure logic to `web/src/lib/` + unit tests**
- [x] **#8 Build `web/src/lib/storage.ts`** — typed localStorage wrapper with schema versioning
- [x] **#9 Port shared components to `web/src/components/`** — `BottomNav`, `Sidebar`, `SettingsModal`, `PrepChecklist`, `ScoreSlider`, `RatingBars`, `BrewScene`, `BrewTimer`
- [ ] #10 Port pages to `web/src/pages/`: Dashboard, MethodPicker, Setup, RecipeList, PreBrew, Brewing, Rating, Journal, Tweak, Discover, Cafes, Glossary, Community, SubmitRecipe, BeanLog. Install `react-router-dom` and wire routing.
- [ ] #11 Port CSS to `web/src/styles/` — keep every CSS variable name identical; split by concern (base, layout, components)
- [ ] #12 ESLint + Prettier + Husky pre-commit; add npm scripts `lint`, `format`, `typecheck`
- [ ] #13 Visual-parity check against `reference/index.html` in desktop and mobile widths
- [ ] #14 Deploy to Vercel (only once parity is confirmed)

**Exit criteria for Phase 0:** deployed URL looks pixel-identical to opening `reference/index.html` locally, and refreshing no longer wipes the journal.

---

## Next up: Task #10 — Port all 15 pages + install routing

Install `react-router-dom`, define routes in `App.tsx`, then port every page from `reference/index.html` into `web/src/pages/`.

Pages to create: `Dashboard`, `MethodPicker`, `Setup`, `RecipeList`, `PreBrew`, `Brewing`, `Rating`, `Journal`, `Tweak`, `Discover`, `Cafes`, `Glossary`, `Community`, `SubmitRecipe`, `BeanLog`.

Key design points:
- Pages receive no globals — only props and hooks (router params, context).
- Wire `storage.ts` for journal reads/writes so refreshing persists data (Phase 0 exit criterion).
- Each page should be a standalone `.tsx`; shared sub-components live in `components/`.
- Routing: `react-router-dom` v6, `createBrowserRouter` + `RouterProvider` pattern.

---

## What's on disk now (as of 2026-04-16 end of session 3)

```
bloombrewvs/
  .git/                          5 commits on main
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
      components/
        index.ts                 barrel
        BottomNav.tsx + Sidebar.tsx
        SettingsModal.tsx        (includes SetField, Toggle, Switch)
        PrepChecklist.tsx
        ScoreSlider.tsx + RatingBars.tsx
        BrewScene.tsx            (6 SVG scene variants)
        BrewTimer.tsx            (+ PulseDot, fmtTime)
        components.test.tsx      (38 tests)
      lib/
        .gitkeep
        grinderMath.ts + grinderMath.test.ts
        recipeScaling.ts + recipeScaling.test.ts
        flavorMatch.ts + flavorMatch.test.ts
        tweakEngine.ts + tweakEngine.test.ts
        storage.ts + storage.test.ts
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

### Session 4 (2026-04-17) — storage wrapper + shared components

**Task #9 (same session):**
- Created `web/src/styles/theme.ts` — exports design-token object `T` and `FONT` (matches reference exactly).
- Installed `lucide-react`, `@testing-library/react`, `@testing-library/dom`, `@testing-library/user-event`, `jsdom`, `@testing-library/jest-dom`.
- Updated `vite.config.ts` to use `test.projects`: `.test.tsx` runs in jsdom, `.test.ts` stays in node.
- Ported 8 shared components (all from `reference/index.html`) into `web/src/components/`:
  - `BottomNav` — mobile 5-item nav bar
  - `Sidebar` — desktop 8-item sticky nav with settings button
  - `SettingsModal` — overlay with display name, units, temp, music, notifications toggles (+ `SetField`, `Toggle`, `Switch` sub-components)
  - `PrepChecklist` — collapsible pre-brew checklist with per-step tick-off state
  - `ScoreSlider` — controlled range input 1-10 for a single rating axis
  - `RatingBars` — read-only horizontal bar visualization of all 5 rating axes
  - `BrewScene` — animated SVG brewing visualizer; routes to 6 scene variants (PourOver, Chemex, Aeropress, FrenchPress, Moka, Espresso/Milk)
  - `BrewTimer` — elapsed/next-step countdown display with progress bar; `fmtTime` and `PulseDot` exported
- 38 component tests in `components.test.tsx`; 138 tests total, all green; `tsc --noEmit` clean.
- Committed as `1603aba`.

**Task #8 (earlier):**

- Built `web/src/lib/storage.ts` (task #8):
  - `StorageSchema` interface maps all `bbrew_` keys to their TS types (journal, settings, grinder, bean, recipe).
  - `StorageKey` union type enforces compile-time safety on all get/set/remove calls.
  - `SCHEMA_VERSION = 1`; `initStorage()` wipes all data keys on mismatch so stale shapes never reach the app.
  - `get<K>`, `set<K>`, `remove`, `clearAll` helpers — JSON round-trip, fallback on parse error.
  - 18 tests (storage.test.ts); 100 tests total, all green; `tsc --noEmit` clean.
  - Committed as `d10fdd0`.

### Session 3 (2026-04-16) — pure-logic lib + vitest
- Installed vitest 3.x + @vitest/coverage-v8; added `test`, `test:run`, `test:cov` scripts to `web/package.json` (task #7a).
- Wrote four pure-logic modules in `web/src/lib/` (task #7b):
  - `grinderMath.ts` — microns → clicks with half-click support for c40/jx/k6 (21 tests).
  - `recipeScaling.ts` — linear mass scaling, √cups time stretch, 5%/cup micron coarsening; step descs left unchanged (19 tests).
  - `flavorMatch.ts` — FLAVOR_KEYWORDS map, `parseFlavorText`, `recipeProfile`, `flavorMatch`; empty result on no-keyword query; MVP precision/recall tradeoff documented in code comment (19 tests).
  - `tweakEngine.ts` — rules-based coach (over/under extraction, thin body, muddy, low sweetness, acidity imbalance, short aftertaste, great brew, mediocre); all suggestion numbers computed from entry values, not hard-coded; tunable constants at module top (23 tests).
- 82 tests total, all green; `tsc --noEmit` clean; committed as `789ee2c`.
- Decision: step desc strings are NOT rewritten during scaling — the UI will show scaled dose/water/milk in the prep-card header instead (resolves task #7d open question).

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
