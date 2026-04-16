# Bloom & Brew — Progress & Handoff

This file is the live log of what has been done, what is next, and how to resume. Read this first when opening the project in a new session.

**Last updated:** 2026-04-16
**Current phase:** Phase 0 — Project foundation (in progress)
**Plan of record:** `BUILD_PLAN.md`
**Model rules:** `MODELS.md`

---

## Quick resume checklist

When you open a new session:

1. `cd /Users/praveenkumarv/bloombrewvs`
2. `nvm use` (picks up `.nvmrc` -> Node 22.17.0; your system default stays on Node 18)
3. Read this file, then `BUILD_PLAN.md` for the full plan.
4. Continue from the **Next steps** section below.
5. Ask Claude to use **Sonnet** for coding (we are currently on Opus — switch via `/model` -> Sonnet 4.6). Escalate back to Opus if a hard bug or complex refactor comes up.

---

## Session 1 summary (2026-04-16)

### What got decided

| Decision | Choice | Why |
|---|---|---|
| Frontend design | Locked — do not change `reference/index.html` visuals | User directive: build the working model behind the current design first; improvements come later |
| Backend | Supabase (free tier) | User choice |
| Directory layout | **Monorepo**: Vite web app in `web/`, leaves room for `mobile/` and `supabase/` later | Mobile comes in Phase 7, cleaner split |
| Node version | **22.17.0 pinned per-project via `.nvmrc`**; system default stays Node 18 | User wants to keep node 18 as system default; `nvm use` picks up the pin |
| zsh auto-switch hook | **Skipped for now** — user runs `nvm use` manually | User preference |
| Git | `git init` done locally, one initial commit | User wants local-only for now |
| GitHub remote | **Skipped for now** — revisit later | User preference |
| Scaffold | `npm create vite@latest web -- --template react-ts` -> Vite 8.0.8, React 19.2.4, TypeScript 6.0.2 | Matches latest stable as of 2026-04-16 |
| Vercel deploy | Deferred to end of Phase 0 | No point deploying until we have parity with reference |

### What is on disk now

```
bloombrewvs/
  .git/                      initialized, one commit (see git log)
  .gitignore                 project-wide (covers node_modules, .env, .venv, etc.)
  .nvmrc                     pins this project to Node 22
  .idea/                     PyCharm metadata (untouched)
  .venv/                     pre-existing Python venv (untouched, unrelated)
  BUILD_PLAN.md              the 9-phase plan (Phase 0 -> Phase 8)
  MODELS.md                  model routing rules (Opus/Sonnet/Haiku)
  PROGRESS.md                this file
  README.md                  original prototype README
  FEATURES.md                complete feature spec for the prototype
  HOSTING.md                 original hosting notes
  projectcontext.md          user's original instructions
  reference/
    index.html               the prototype (181KB, moved from root)
  web/                       Vite + React 19 + TS 6 scaffold (default template only)
    package.json
    tsconfig*.json
    vite.config.ts
    eslint.config.js
    index.html               Vite entry (NOT the prototype — the prototype is in reference/)
    src/
      App.tsx                default Vite App
      main.tsx
      index.css
      App.css
      assets/
    public/
    node_modules/            installed, gitignored
```

### What is committed vs uncommitted

- **Committed** (one commit on `main`): `.gitignore`, `.nvmrc`, all .md files at root, `reference/index.html`
- **Uncommitted / untracked**: the entire `web/` scaffold is on disk but **not yet committed** (user interrupted the commit). Next session should either commit it or review first.

### What is already verified working

- `npm install` in `web/` succeeded (172 packages, 0 vulnerabilities)
- `npm run build` in `web/` succeeded (built in 377ms, output in `web/dist/`)
- The Vite default page builds cleanly — we have not yet started porting any prototype UI

---

## Next steps (pick up here next session)

Tasks are tracked in the in-session task list, but in case that is lost, here are Phase 0 tasks in order:

- [x] #1 Move `index.html` to `reference/`
- [x] #2 `git init` + initial commit
- [x] #3 Scaffold Vite + React 19 + TS 6 in `web/`
- [x] #3b Commit the Vite scaffold (done 2026-04-16 as part of re-init at `bloombrewvs`)
- [ ] #4 Create directory structure in `web/src/`: `pages/`, `components/`, `lib/`, `data/`, `styles/`, `types/`
- [ ] #5 Define TypeScript data models in `web/src/types/`: `Recipe`, `Bean`, `Grinder`, `JournalEntry`, `RatingAxes`, `PrepStep`, `UserSettings`, `Method`, `BrewingMethodCategory`
- [ ] #6 Port static data from `reference/index.html` into `web/src/data/`: 24 recipes, 6 grinders, 12 glossary terms, 8 Indian roasters, 6 Bangalore cafes
- [ ] #7 Port pure logic to `web/src/lib/`: `grinderMath`, `flavorMatch`, `tweakEngine`, `recipeScaling` — add `vitest` unit tests
- [ ] #8 Build `web/src/lib/storage.ts` — typed localStorage wrapper with a schema version field (so the Supabase swap in Phase 3 is one file's worth of change)
- [ ] #9 Port shared components to `web/src/components/`: `Timer`, `SVGScene`, `PrepChecklist`, `Sliders`, `RatingBars`, `BottomNav`, `Sidebar`, `SettingsModal`
- [ ] #10 Port pages to `web/src/pages/`: Dashboard, MethodPicker, Setup, RecipeList, PreBrew, Brewing, Rating, Journal, Tweak, Discover, Cafes, Glossary, Community, SubmitRecipe, BeanLog. Install `react-router-dom` and wire routing.
- [ ] #11 Port CSS to `web/src/styles/` — keep every CSS variable name identical; split by concern (base, layout, components)
- [ ] #12 ESLint + Prettier + Husky pre-commit; add npm scripts `lint`, `format`, `typecheck`
- [ ] #13 Visual-parity check against `reference/index.html` in desktop and mobile widths
- [ ] #14 Deploy to Vercel (only once parity is confirmed)

**Exit criteria for Phase 0:** deployed URL looks pixel-identical to opening `reference/index.html` locally, and refreshing no longer wipes the journal.

---

## How to run the project locally

```bash
cd /Users/praveenkumarv/bloombrewvs
nvm use                    # -> Node 22 via .nvmrc
cd web
npm run dev                # Vite dev server on http://localhost:5173
```

To compare against the original:

```bash
open reference/index.html  # opens the prototype in your default browser
```

To build:

```bash
cd web
npm run build
npm run preview            # serve the production build
```

---

## Current tech versions (as of 2026-04-16)

| Tool | Version | Notes |
|---|---|---|
| Node | 22.17.0 | via `nvm use` in project dir |
| npm | 10.9.2 | ships with Node 22 |
| Vite | 8.0.8 | |
| React | 19.2.4 | |
| TypeScript | 6.0.2 | |
| ESLint | 9.39.4 | Vite default config; will tighten in task #12 |

---

## Open questions to revisit

1. **GitHub remote** — when to create it; keep monorepo in one repo or split when mobile is added.
2. **zsh auto-switch hook** — do we ever want it? (5 lines in `~/.zshrc`)
3. **Custom domain** — eventual production URL (e.g. `bloomandbrew.app`); buy early so DNS propagation is not a launch-week problem.
4. **Admin UI for recipe submissions** — MVP assumes manual SQL promotion; decide by end of Phase 3 whether to build a simple admin view before launch.
5. **Monetization / Pro tier** — not required for launch, but if it is on the roadmap, Stripe integration slots into Phase 6 or 7.

---

## How this file stays useful

- Update the **Session summary**, **What is on disk**, and **Next steps** sections at the end of each working session.
- Move completed tasks into a dated "done" section rather than deleting them — future you will want to see the timeline.
- When phase boundaries cross, add a new **Phase N summary** section above the next steps.
- If a decision changes, record the reversal *and the reason* so future you does not re-litigate it.
