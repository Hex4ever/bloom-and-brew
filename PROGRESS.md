# Bloom & Brew — Progress & Handoff

This file is the live log of what has been done, what is next, and how to resume. Read this first when opening the project in a new session.

**Last updated:** 2026-04-21 (session 15)
**Current phase:** Phase 5 — Jazz audio (5c) · then Phase 6 PWA
**Plan of record:** `BUILD_PLAN.md`
**Model rules:** `MODELS.md`
**Live URL:** https://bloom-and-brew-lemon.vercel.app/
**GitHub:** https://github.com/Hex4ever/bloom-and-brew
**Head of `main`:** fix(brew): post-brew done → home + background brew timer + BrewPill

---

## Quick resume checklist

When you open a new session:

1. `cd /Users/praveenkumarv/bloombrewvs`
2. `nvm use` (picks up `.nvmrc` → Node 22.17.0; system default stays on Node 18)
3. Read this file, then `BUILD_PLAN.md` for the full plan.
4. Jump to the **Next up** section below.
5. Model: **Sonnet 4.6** for coding. Escalate to **Opus 4.6** only for hard architectural decisions. Haiku is not in the loop for code.

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
- [x] **#10 Port pages to `web/src/pages/`** — all 15 pages ported (Dashboard, MethodPicker, Setup, RecipeList, Brew, Rating, Journal, Tweak, Discover, Cafes, Glossary, Community, SubmitRecipe, BeanLog, ScanBean). `react-router-dom` v6 installed, `createBrowserRouter + RouterProvider` wired in `App.tsx`, `AppContext` provides write-through localStorage persistence via `storage.ts`, `initStorage()` called on startup in `main.tsx`.
- [x] **#11 Port CSS to `web/src/styles/`** — `tokens.css` (CSS custom properties mirroring `T`), `base.css` (reset + html/body/button), `animations.css` (all 10 keyframes + `.fade-up`, `.scrollx`); `index.css` now imports all three; old Vite defaults removed; `App.css` cleared; `noUnusedLocals` fix in `Journal.tsx` (stale `SCORE_AXES` import + spurious `axes` prop).
- [x] **#12 ESLint + Prettier + Husky pre-commit** — Prettier installed (`printWidth:100`, double quotes, trailing commas); `.prettierrc` + `.prettierignore`; `format`, `format:check`, `typecheck` scripts added; ESLint tightened (`no-console` warn, `consistent-type-imports` error); `lint-staged` installed; `.husky/pre-commit` runs `typecheck` then `lint`; `git config core.hooksPath .husky` wired via `prepare` script. Fixed 6 pre-existing lint violations (sync setState in effect in Cafes, `Math.random` in render in Dashboard + Glossary, react-refresh in AppContext + BrewTimer).
- [x] **#13 Visual-parity check** — Fixed 7 layout gaps vs reference: (1) mobile 440px centering wrapper + side borders, (2) `letterSpacing: 0.01em` on root, (3) desktop `maxWidth: 1100` content constraint, (4) BottomNav hidden on `/` and `/brew`, (5) `paddingBottom: 80` on mobile container, (6) `fade-up` CSS class on route transitions, (7) `<title>` corrected to "Bloom & Brew".
- [x] **#14 Deploy to Vercel** — Live at https://bloom-and-brew-lemon.vercel.app/ · GitHub at https://github.com/Hex4ever/bloom-and-brew · `vercel.json` handles SPA rewrites + `--legacy-peer-deps` build flag · `vite.config.ts` / `vitest.config.ts` split to fix vite@8 vs vitest@3 type clash that was blocking `tsc -b`.

**Exit criteria for Phase 0:** ✅ deployed URL looks pixel-identical to opening `reference/index.html` locally, and refreshing no longer wipes the journal.

---

## Phase 1 task checklist

- [x] Create Supabase project (free tier) — `rizncfkqyajsivjsrpoi.supabase.co`
- [x] Install `@supabase/supabase-js` in `web/`
- [x] `web/src/lib/supabase.ts` — typed client singleton
- [x] `web/src/types/database.ts` — full TypeScript types for all 11 DB tables
- [x] `supabase/migrations/001_initial_schema.sql` — all tables, RLS policies, auto-profile trigger
- [x] `supabase/seed.sql` — 26 curated recipes, 6 grinders, 8 Indian beans
- [x] `web/.env` + `web/.env.example` — env wiring
- [x] Smoke test: REST API confirms curated recipes + grinders queryable

**Exit criteria for Phase 1:** ✅ DB schema live, RLS enforced, seeds loaded, client can query curated recipes.

---

## Phase 2 task checklist

- [x] `web/src/AuthContext.tsx` — Supabase session wrapper; `useAuth()` hook exposes `user`, `session`, `loading`, `signIn`, `signUp`, `signInWithMagicLink`, `signOut`, `resetPassword`
- [x] `web/src/pages/auth/SignIn.tsx` — email+password tab + magic-link tab; matches dark design language
- [x] `web/src/pages/auth/SignUp.tsx` — name + email + password; confirmation email flow
- [x] `web/src/pages/auth/ForgotPassword.tsx` — email → reset link
- [x] `web/src/components/RequireAuth.tsx` — route guard; redirects to `/signin` if no session
- [x] `App.tsx` — `AuthProvider` wraps everything; `/signin`, `/signup`, `/forgot-password` routes added; all app routes wrapped in `RequireAuth`
- [x] `AppContext.tsx` — on login, fetches `profiles` row and hydrates settings; `setSettings` upserts to `profiles` when user is present
- [x] `web/src/types/database.ts` — added `Relationships: []` to all tables (required by Supabase's `GenericTable` constraint)
- [x] `tsc --noEmit` clean; 138 tests passing

**Exit criteria for Phase 2:** ✅ Two test accounts can sign in and see only their own data; settings survive reload via profiles table.

---

## Phase 3 task checklist

- [x] `supabase/migrations/002_phase3.sql` — `name` on `beans`, `grinder_type` on `grinders`, 8 denormalized display columns on `journal_entries`, `poster_name` on `community_posts`
- [x] `web/src/types/database.ts` — updated to match migration
- [x] `AppContext.tsx` — on login fetches journal/beans/grinders from DB; exposes `saveJournalEntry`, `addBean`, `deleteBean`, `availableGrinders`, `dbLoading`; write-through to DB for all mutations; optimistic UI with rollback on insert failure
- [x] `Rating.tsx` — calls `saveJournalEntry` (DB insert) instead of local `setBrewLog`; fixed stale `dbError` check (now checks return value — `null` = DB error)
- [x] `Brew.tsx` — quick save ("Save to profile") now routes through `saveJournalEntry` instead of directly mutating `setBrewLog`; previously never wrote to Supabase
- [x] `BeanLog.tsx` — delete (X button) + manual add form; uses `addBean` / `deleteBean` from context
- [x] `ScanBean.tsx` — save calls `addBean` (DB insert); no longer mutates beanLog directly
- [x] `SubmitRecipe.tsx` — inserts to `recipe_submissions` with `status='pending'` on submit
- [x] `Community.tsx` — fetches posts from DB; creates posts via DB; optimistic like/unlike with `post_likes` toggle + `likes_count` update
- [x] `RecipeList.tsx` — shows approved community recipes from `recipe_submissions` below curated list
- [x] `Setup.tsx` — uses `availableGrinders` from context (DB-backed; falls back to static GRINDERS)
- [x] `web/vercel.json` — SPA rewrite rule moved into `web/` (root `vercel.json` was ignored by Vercel since project root is `web/`); fixes 404 on page refresh

**Exit criteria for Phase 3:** ✅ sign in on two devices, log a brew on one, see it appear on the other — confirmed working 2026-04-20.

**Bugs fixed post-session (2026-04-20):**
- Journal entries were never reaching Supabase: `Rating.tsx` checked stale React state (`if (dbError)`) after async save; code always navigated away even on DB failure → entries lived only in localStorage and vanished on refresh.
- Quick save in `Brew.tsx` called `setBrewLog` directly, bypassing `saveJournalEntry` entirely.
- `web/vercel.json` was missing — root-level file ignored when Vercel root dir = `web/`; all route refreshes returned 404.

---

## Phase 4 task checklist

- [x] `supabase/functions/tweak-coach/index.ts` — Deno Edge Function: auth check, rate limit (50/day), find-or-create thread, load history, stream Claude Sonnet 4.6 via SSE, persist turn to `tweak_messages`; system prompt marked `cache_control: ephemeral` for prompt caching
- [x] `web/src/pages/Tweak.tsx` — Q&A section wired to Edge Function; SSE streaming with live typing cursor; rate-limit banner; graceful fallback to local `answerQuestionLocally` when offline/Edge Function error; rules-based diagnosis + suggestions panel unchanged
- [x] Set `ANTHROPIC_API_KEY` secret in Supabase dashboard → Edge Functions → Secrets
- [x] Deploy Edge Function: `supabase functions deploy tweak-coach --no-verify-jwt`
- [x] Smoke test end-to-end: confirmed Claude streams real responses on a rated journal entry — 2026-04-20

**Decision:** Flavor finder stays keyword-based — no AI, no Edge Function needed.

**Exit criteria for Phase 4:** ✅ Claude streams real responses end-to-end; API key not in client bundle; flavor finder unchanged — confirmed 2026-04-20.

---

## Phase 5 task checklist

- [x] `supabase/functions/scan-bean/index.ts` — Claude Vision Edge Function: auth check, accepts base64 image + mediaType, calls `claude-sonnet-4-6` with vision, returns `{ name, roaster, origin, roast, notes }` JSON; strips markdown fences from response; graceful 422 on parse failure
- [x] `ScanBean.tsx` — rewritten: reads initial mode from React Router `location.state`; mode=scan shows camera picker, mode=manual goes straight to blank form, scanning shows animated loader; confirm-and-edit form for both paths; error banner on API failure falls back to empty form
- [x] `BeanLog.tsx` — replaced header icon buttons + inline add form with two side-by-side cards: "Scan packaging" and "Enter manually"; both navigate to `/scan` with correct state
- [x] `Setup.tsx` — bean picker in brew flow updated to show "Scan packaging" + "Enter manually" side by side (was single scan button only)
- [x] Edge Function deployed: `supabase functions deploy scan-bean --no-verify-jwt`
- [x] 5b — Cafes Near Me: `supabase/functions/cafes-nearby/index.ts` → Google Places Nearby Search (New API) → deployed; `Cafes.tsx` calls Edge Function on geolocation grant, falls back to `CAFES` demo data on denial or error; 24h `cafes_cache` grid-bucketed; `GOOGLE_PLACES_API_KEY` set in Supabase secrets — confirmed working 2026-04-20
- [ ] 5c — Jazz audio: wire toggle to actual playback (royalty-free stream or embedded player)

**Exit criteria for Phase 5:** photograph a real coffee bag → fields auto-populate; cafes show real nearby results; jazz plays.

**5a confirmed working:** Claude Vision reads real coffee bag labels and populates bean form fields — 2026-04-20.
**5b confirmed working:** Real nearby cafes returned from Google Places — 2026-04-20.

## Session 15 UX fixes — done (2026-04-21)

Two UX improvements shipped:

### Fix 1 — Post-brew "Done" routed to home instead of /recipes

`Brew.tsx` `DoneScreen` prop `onReset` was calling `navigate(-1)` which walked back through browser history to `/recipes` (the previous stop in the Setup → Recipes → Brew flow). Changed to `navigate("/")` so both "Done" (after quick-save) and "Skip" always land on the home dashboard.

### Fix 2 — Background brew timer + BrewPill status pill

Users could lose their entire brew progress if they tapped a nav item mid-brew.

**Architecture:** The brew timer was moved from local `Brew.tsx` state into `AppContext`, where it keeps ticking regardless of which page is rendered.

- `AppContext.tsx` — new `ActiveBrewSession` interface (`phase`, `paused`, `elapsed`, `totalTime`, `cups`). A single `useEffect` interval runs there. Three new context actions: `startBrewSession`, `toggleBrewPause`, `clearBrewSession`.
- `Brew.tsx` — local timer `useEffect` removed. `elapsed` reads from `activeBrewSession.elapsed`. On mount the component reads an existing session to restore `phase` and `cups` (returning from another page mid-brew resumes seamlessly). "Start brewing" now calls `startBrewSession(totalTime, cups)`.
- `BrewPill.tsx` (new component) — floating pill hidden on `/brew` itself; visible on every other page while a brew is active. Shows a circular SVG progress ring, recipe title, time remaining, and a pause/resume toggle. Tapping the pill body navigates back to `/brew`. Positioned to account for the 240px sidebar on desktop.
- `App.tsx` — `BrewPill` rendered in both the desktop and mobile layout branches.

**iOS note:** This `activeBrewSession` context state is the natural feed for a native Live Activity / Dynamic Island notification when the app is wrapped in Capacitor (Phase 7).

---

## Next up: Phase 5c — Jazz audio

Wire the vinyl toggle in `SettingsModal` to actual audio playback. Options:
1. Embed a royalty-free lo-fi / jazz stream (e.g. a public internet radio URL or a self-hosted mp3)
2. Use the HTML5 `<audio>` element with `loop`; manage play/pause from the `autoPlayMusic` settings toggle
3. Show the vinyl widget animating while playing; pause on low-battery or tab-hidden events

After 5c: move to Phase 6 — PWA manifest + service worker + notifications.

---

## What's on disk now (as of 2026-04-20 end of session 14)

```
bloombrewvs/
  .git/                          main branch, all phases 0–4 committed
  .gitignore
  .nvmrc                         "22" → Node 22.17.0
  BUILD_PLAN.md                  9-phase plan (updated)
  MODELS.md                      Opus/Sonnet/Haiku routing rules
  PROGRESS.md                    this file
  README.md                      needs update (still reflects old prototype)
  FEATURES.md                    needs update (reflects old prototype state)
  HOSTING.md                     original notes
  projectcontext.md              original brief
  reference/
    index.html                   design-locked prototype, 181KB
  supabase/
    migrations/
      001_initial_schema.sql     all tables, RLS, auto-profile trigger
      002_phase3.sql             denormalized display columns, bean name, grinder type
    seed.sql                     26 recipes, 6 grinders, 8 Indian beans
    functions/
      tweak-coach/index.ts       ✅ deployed — Claude SSE streaming, rate limit, thread persistence
      scan-bean/index.ts         ✅ deployed — Claude Vision, returns structured bean JSON
      cafes-nearby/index.ts      ✅ deployed — Google Places Nearby Search (New), 24h cache; needs GOOGLE_PLACES_API_KEY secret
  web/
    vercel.json                  SPA rewrite rule (must live here, not repo root)
    package.json                 Vite 8, React 19, TS 6
    .env                         VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY (gitignored)
    .env.example                 committed template
    src/
      App.tsx                    router + AuthProvider + AppProvider + RequireAuth guards
      main.tsx                   mounts app, calls initStorage()
      AuthContext.tsx             Supabase session wrapper
      AppContext.tsx              global state + all DB mutations (journal, beans, grinders, settings)
      types/                     method, recipe, grinder, bean, journal, prep, settings, database
      data/                      methods, grinders, recipes, glossary, indianBeans, cafes, content, preBrew, feed
      lib/                       grinderMath, recipeScaling, flavorMatch, tweakEngine, storage (all with tests)
      styles/                    theme.ts, tokens.css, base.css, animations.css
      components/                BottomNav, Sidebar, SettingsModal, PrepChecklist, ScoreSlider,
                                 RatingBars, BrewScene, BrewTimer, BrewPill, RequireAuth, Header, Pill, ui.tsx
      pages/
        Dashboard.tsx            home; This Week card is fully dynamic (brews, avg score, methods, bar chart)
        MethodPicker.tsx         navigates to /recipes after method select (updated flow)
        Setup.tsx                beans first (1/2) then grinder (2/2); ends at /methods
        RecipeList.tsx           curated + approved community recipes
        Brew.tsx                 timer + scene + quick save (DB-backed)
        Rating.tsx               detailed 5-axis log (DB-backed, error shown on failure)
        Journal.tsx              list + stats + Tweak button
        Tweak.tsx                rules diagnosis + Claude Q&A (Edge Function live)
        Discover.tsx             curated Indian beans
        Cafes.tsx                ✅ calls cafes-nearby Edge Function on geolocation grant; demo fallback
        Glossary.tsx
        Community.tsx            DB-backed posts + likes
        SubmitRecipe.tsx         inserts to recipe_submissions
        BeanLog.tsx              scan + manual entry cards; bean list with delete
        ScanBean.tsx             ✅ Claude Vision scan + manual entry; mode driven by router state
        auth/SignIn.tsx + SignUp.tsx + ForgotPassword.tsx
```

Working tree is clean. Everything committed.

---

## Sessions log

### Session 15 (2026-04-21) — UX fixes: post-brew navigation + background brew timer + BrewPill

See "Session 15 UX fixes" block above for full detail.

### Session 14 (2026-04-20) — Phase 5b: Cafes Near Me

- Created `supabase/functions/cafes-nearby/index.ts` — Deno Edge Function:
  - Auth check via Supabase user client
  - Accepts `{ lat, lng }` POST body
  - Checks `cafes_cache` for a fresh entry (< 24h) bucketed to a ~1km grid cell (`GRID_PRECISION=2`)
  - On cache miss, calls Google Places Nearby Search (New API) for `cafe` + `coffee_shop` types within 5km, ranked by distance
  - Extracts `name`, `area` (second-last address component), `dist` (haversine), `rating`, `tags` (inferred from editorial summary + type), `place_id`, `lat`, `lng`
  - Upserts result array to `cafes_cache` keyed on `grid_{lat}_{lng}`
  - Returns 503 with descriptive error if `GOOGLE_PLACES_API_KEY` secret is missing
- Updated `Cafes.tsx`:
  - On geolocation grant: calls Edge Function with live lat/lng; shows real results sorted by distance; maps link uses exact coordinates + `place_id`
  - On API error or empty results: falls back to `CAFES` static demo list with inline banner
  - On geolocation denial: falls back to demo list (same as before)
  - `isRealResults` flag drives subtitle copy ("Sorted by distance" vs "Demo locations")
- Deployed: `supabase functions deploy cafes-nearby --no-verify-jwt`
- `tsc --noEmit` clean after changes

**Blocking for live use:** `GOOGLE_PLACES_API_KEY` secret must be set in Supabase dashboard (see "Next up" above).

### Session 13 (2026-04-20) — UX flow reorder + dynamic dashboard stats

- **New-brew flow reordered**: was Method → Grinder → Beans → Recipes; now **Beans → Grinder → Method → Recipes** (matches how a user naturally starts from what they have, not what they want to make).
  - `Dashboard.tsx` "New brew" button now navigates to `/setup` instead of `/methods`.
  - `Setup.tsx` reordered stages: beans (1/2) → grinder (2/2); method guard removed; final CTA "Choose a method" navigates to `/methods`.
  - `MethodPicker.tsx` navigates to `/recipes` after method select (was `/setup`).
- **This Week card made dynamic**: brews count, average score, methods used, and daily bar chart all computed from real `brewLog` data for the current Mon–Sun week.
  - Added `createdAt?: string` to `JournalEntry` type (no DB schema change — `created_at` already existed in Supabase).
  - `AppContext.tsx` `dbJournalToLocal` now forwards `created_at` → `createdAt`.
  - `Dashboard.tsx` `WeekStats` uses `useMemo` to filter this week's entries; today's bar and day label highlighted in amber; empty days show a faint stub.
- Commits: `aef317e` (flow reorder), `782c60a` (dynamic stats).

### Session 12 (2026-04-20) — Phase 5a bean scanner complete

- Created `supabase/functions/scan-bean/index.ts` — Claude Vision Edge Function; deployed.
- Rewrote `ScanBean.tsx`: mode driven by React Router state (`scan` or `manual`); no more hardcoded mock; scan path calls Edge Function, manual path goes straight to blank form; error banner falls back gracefully to empty form.
- `BeanLog.tsx` refactored: replaced header icon buttons + inline add form with two prominent side-by-side cards ("Scan packaging" / "Enter manually").
- `Setup.tsx` bean picker updated: "Scan packaging" + "Enter manually" now appear side by side (was scan-only).
- Confirmed Claude Vision correctly reads real coffee bag labels in production.

### Session 11 (2026-04-20) — Phase 3 bug fixes + Phase 4 go-live
- Diagnosed and fixed three silent Phase 3 bugs:
  - `Rating.tsx` checked stale `dbError` React state after `await saveJournalEntry()` → always navigated away even on DB failure; journal entries never reached Supabase. Fixed: `saveJournalEntry` now returns `null` on error; caller checks return value.
  - `Brew.tsx` quick-save called `setBrewLog` directly, bypassing `saveJournalEntry` and Supabase entirely. Fixed: now async via `saveJournalEntry`.
  - `web/vercel.json` missing — the root-level `vercel.json` is ignored by Vercel when project root is `web/`. All route refreshes returned 404. Fixed: added `web/vercel.json` with SPA rewrite rule.
- Deployed `tweak-coach` Edge Function (`supabase functions deploy tweak-coach --no-verify-jwt`).
- Confirmed Phase 4 exit criteria: Claude streams real AI responses end-to-end on rated journal entries.
- `ScanBean.tsx` confirmed as hardcoded mock — identified as Phase 5 priority.
- Updated PROGRESS.md and BUILD_PLAN.md to reflect current state.

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
| ESLint | 9.39.4 | |
| Vitest | 3.x | `.test.tsx` in jsdom, `.test.ts` in node |
| Supabase JS | 2.x | |
| Claude model | claude-sonnet-4-6 | used in tweak-coach Edge Function |

---

## Open questions to revisit

1. **Custom domain** — buy `bloomandbrew.app` early; DNS propagation is a launch-week problem if left late.
2. **Admin UI for recipe submissions** — currently manual SQL promotion. Needed before launch if volume picks up.
3. **Monetization / Pro tier** — unlimited tweaks, premium beans discovery, etc. If on roadmap, Stripe slots into Phase 6/7.
4. **README + FEATURES.md** — both still describe the old prototype. Update before any public launch or sharing.
5. **Mobile app** — Phase 7 decision: Capacitor wrap (fast) vs React Native rewrite (native feel). Revisit after Phase 6 PWA work.

---

## How this file stays useful

- Update **Sessions log**, **What's on disk**, and **Phase 0 task checklist** at the end of each working session.
- When a task completes, check it off inline and move the detailed breakdown out of "Next up" into the sessions log entry for that day.
- When phase boundaries cross, add a new **Phase N handoff** section below the current Next-up block.
- If a decision changes, record the reversal *and the reason* so future you does not re-litigate it.
