# Bloom & Brew — Build Plan

A phased plan to take the current single-file HTML prototype to a fully deployed web + iOS + Android product. Frontend design in `reference/index.html` is locked for now; this plan is about everything *behind* and *around* that design.

> **Live status:** see `PROGRESS.md` for the current phase, what is done, and the next step to pick up. This document is the stable plan; `PROGRESS.md` is the journal.

---

## Guiding principles

- **Do not change the frontend design** until the working model behind it is complete. Improvements come after.
- **Ship in phases.** Each phase ends with something demonstrable and deployable.
- **Free-tier first.** Supabase (DB + Auth + Storage), Vercel (web hosting), Expo EAS free tier (mobile builds). Upgrade only when real usage forces it.
- **One codebase, three surfaces.** Web (React) + iOS + Android via React Native (or Capacitor wrapping the web app — decision in Phase 7).
- **Secrets never ship to the client.** All third-party API calls (Claude, Google Places, Vision) go through Supabase Edge Functions.

---

## Phase 0 — Project foundation (week 1)

Goal: turn the single HTML file into a real project without changing what the user sees.

1. **Scaffold Vite + React + TypeScript**
   - `npm create vite@latest bloom-and-brew -- --template react-ts`
   - Keep the existing `index.html` as a reference; extract the JSX tree into components over the week.
2. **Split `index.html` into modules** (no design changes)
   - `src/App.tsx` as the root
   - `src/pages/` — Dashboard, MethodPicker, Setup, RecipeList, PreBrew, Brewing, Rating, Journal, Tweak, Discover, Cafes, Glossary, Community, SubmitRecipe, BeanLog, Settings
   - `src/components/` — shared widgets (Timer, SVGScene, PrepChecklist, Sliders, RatingBars, etc.)
   - `src/lib/` — pure logic (grinderMath, flavorMatch, tweakEngine, recipeScaling)
   - `src/data/` — static data (recipes, grinders, glossary, beans)
   - `src/styles/` — extract CSS to `index.css` + per-component files; keep CSS variables exactly as they are
3. **Type the data models** — `Recipe`, `Bean`, `Grinder`, `JournalEntry`, `RatingAxes`, `PrepStep`, `UserSettings`
4. **Interim persistence with `localStorage`** — wrap reads/writes in a small `storage.ts` so the switch to Supabase later is a one-file change
5. **ESLint + Prettier + Husky pre-commit** — basic hygiene
6. **Deploy the Vite build to Vercel** — confirm parity with the original single-file version

Exit criteria: the app looks identical to `index.html`, runs on a deployed URL, and refreshing no longer wipes the journal.

---

## Phase 1 — Supabase setup + schema (week 2)

Goal: backend exists and the schema is designed for every feature in `FEATURES.md`.

1. **Create the Supabase project** (free tier)
2. **Install the SDK** — `@supabase/supabase-js` in the client
3. **Schema (initial tables)**
   - `profiles` — `id` (uuid, fk auth.users), `display_name`, `units` (metric/imperial), `temperature_unit` (c/f), `auto_play_music` (bool), `step_notifications` (bool), `created_at`
   - `beans` — `id`, `user_id`, `roaster`, `origin`, `roast_level`, `tasting_notes`, `source` (scan/manual/curated), `image_url`, `created_at`
   - `grinders` — `id`, `user_id`, `name`, `clicks_per_1000um`, `detent_style` (half/whole), `is_default` — seeded with the 6 curated grinders plus user-custom rows
   - `recipes` — `id`, `author_id` (null for curated), `method`, `title`, `dose_g`, `water_g`, `temp_c`, `ratio`, `brew_time_s`, `difficulty`, `steps` (jsonb), `flavor_profile` (jsonb: sweetness/acidity/body/bitterness/aftertaste), `source_author` (Hoffmann/Kasuya/etc.), `is_curated` (bool), `created_at`
   - `journal_entries` — `id`, `user_id`, `recipe_id`, `bean_id`, `grinder_id`, `servings`, `sweetness`, `acidity`, `body`, `bitterness`, `aftertaste`, `overall`, `notes`, `quick_logged` (bool), `created_at`
   - `tweak_threads` — `id`, `journal_entry_id`, `created_at`
   - `tweak_messages` — `id`, `thread_id`, `role` (user/assistant/system), `content`, `token_usage` (int), `created_at`
   - `community_posts` — `id`, `user_id`, `caption`, `image_url`, `recipe_id` (nullable), `likes_count`, `created_at`
   - `post_likes` — composite pk (`post_id`, `user_id`)
   - `post_comments` — `id`, `post_id`, `user_id`, `content`, `created_at`
   - `recipe_submissions` — `id`, `user_id`, `method`, `title`, `dose_g`, `water_g`, `temp_c`, `notes`, `status` (pending/approved/rejected), `created_at`
   - `cafes_cache` — `id`, `lat`, `lng`, `place_id` (google), `data` (jsonb), `cached_at` — optional server-side cache so we do not hammer Google Places
4. **RLS policies** — on every user-scoped table: `user_id = auth.uid()` for select/insert/update/delete; curated rows readable by all, writable by none
5. **Seed scripts** — load the 24 curated recipes, 8 Indian roasters, 6 grinders, 12 glossary entries as seed data
6. **Environment wiring** — `.env` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`; `.env.example` committed

Exit criteria: DB schema live, RLS enforced, seeds loaded, client can query curated recipes.

---

## Phase 2 — Authentication (week 3)

Goal: users can sign up, sign in, sign out, and see their own data.

1. **Email + password auth** via Supabase Auth
2. **Magic link** fallback
3. **OAuth** — Google and Apple (Apple is required for the iOS app store later)
4. **Auth screens** — sign in, sign up, password reset; match the existing design language (cream CTA, amber accents, same typography)
5. **Protected routes** — wrap the app so unauthenticated users hit a welcome screen
6. **Auto-create a `profiles` row** via a `auth.users` insert trigger
7. **Settings screen wired to `profiles`** — display name, units, temp unit, notifications toggle all round-trip to Supabase
8. **Session persistence** — Supabase handles this; confirm it survives reload and app background on mobile

Exit criteria: two test accounts can sign in on the deployed site and only see their own data.

---

## Phase 3 — Core data flows (weeks 4-5)

Goal: every in-memory feature from `FEATURES.md` is backed by Supabase.

1. **Journal** — insert on rate-and-save; list, filter, and aggregate in `JournalPage`; stats panel reads from a `profile_stats` view
2. **Bean Log** — add manually (form), list, delete; `source` field distinguishes scanned/manual/curated
3. **Grinder selection** — default to the user's last-used grinder; let them save custom grinders
4. **Recipe list** — curated recipes from DB; user-submitted approved recipes mixed in
5. **Recipe submission** — form writes to `recipe_submissions` with `status='pending'`; no admin UI yet (manual promotion via SQL is fine for MVP)
6. **Community posts** — list, create, like, comment; images uploaded to Supabase Storage `post-images` bucket
7. **Settings** — all five toggles persist to `profiles`
8. **Optimistic UI** — mutations reflect immediately; roll back on error

Exit criteria: you can sign in on two devices, log a brew on one, and see it appear on the other.

---

## Phase 4 — AI integration (week 6) ✅ COMPLETE

Goal: the tweak coach uses the Claude API to give personalised brew adjustments. The flavor finder stays keyword-based (no AI).

1. ✅ **Supabase Edge Function: `tweak-coach`** — deployed at `rizncfkqyajsivjsrpoi.supabase.co/functions/v1/tweak-coach`
   - Auth check + rate limit (50/day per user)
   - Finds or creates a `tweak_threads` row for the journal entry
   - Streams Claude `claude-sonnet-4-6` response via SSE
   - Persists each turn to `tweak_messages`
   - System prompt uses `cache_control: ephemeral` for prompt caching
2. ✅ **`web/src/pages/Tweak.tsx`** — SSE streaming with live cursor, rate-limit banner, local rules-based fallback
3. ✅ **`ANTHROPIC_API_KEY`** set in Supabase Edge Function secrets
4. ✅ **Flavor finder stays keyword-based** — no Edge Function, no AI cost

Exit criteria: ✅ confirmed 2026-04-20 — Claude streams real responses end-to-end; API key not in client bundle.

---

## Phase 5 — External integrations (week 7)

1. ✅ **Bean scanner — Claude Vision**
   - `supabase/functions/scan-bean/index.ts` deployed — accepts base64 image, calls `claude-sonnet-4-6` vision, returns `{ name, roaster, origin, roast, notes }`
   - `ScanBean.tsx` rewritten — mode driven by React Router state; scan path calls Edge Function, manual path opens blank form; both land on confirm-and-edit form
   - `BeanLog.tsx` + `Setup.tsx` both show "Scan packaging" + "Enter manually" side by side
   - Skipped Tesseract.js — Claude Vision handles stylised coffee packaging better with zero added complexity

1b. ✅ **New-brew flow reordered** (UX improvement, 2026-04-20)
   - Flow is now: **Beans → Grinder → Method → Recipes → Brew** (was Method → Grinder+Beans → Recipes)
   - `Dashboard.tsx` "New brew" → `/setup`; `Setup.tsx` beans first then grinder; `MethodPicker.tsx` → `/recipes`

1c. ✅ **Dashboard "This Week" card — real data** (2026-04-20)
   - Brews count, average score, methods used, and daily bar chart computed from live `brewLog`
   - `JournalEntry` type gains `createdAt?`; `dbJournalToLocal` forwards `created_at`; no DB schema change
   - Today's bar and label highlighted; empty days show a faint stub

2. ✅ **Google Places for "Cafes Near Me"**
   - `supabase/functions/cafes-nearby/index.ts` deployed — Nearby Search (New API), ranked by distance, 24h grid-bucketed cache in `cafes_cache`
   - `Cafes.tsx` calls Edge Function on geolocation grant; falls back to demo list on denial/error
   - `GOOGLE_PLACES_API_KEY` secret set in Supabase dashboard — confirmed working 2026-04-20

3. **Jazz audio** (low priority)
   - Wire the toggle to actual audio (royalty-free stream or embedded player)
   - Keep the existing vinyl visual widget; just make it actually play

Exit criteria: ✅ bean scanner working. Remaining: cafes show real nearby results; jazz plays.

---

## Phase 6 — Notifications & PWA polish (week 8)

1. **Browser push notifications** for step changes during long brews (Web Push API + Supabase Edge Function dispatcher)
2. **PWA manifest + service worker** — installable on desktop and Android home screen; offline cache for curated recipes and glossary
3. **Imperial units** — currently cosmetic; wire the toggle end-to-end so grams become ounces in prep cards, schedule, and journal
4. **Temperature unit** — same as above for C <-> F
5. **Accessibility pass** — keyboard navigation, ARIA labels on SVG icons, focus rings, prefers-reduced-motion for animations

---

## Phase 7 — Mobile apps (weeks 9-11)

Decision point at start of phase — pick one:

**Option A: Capacitor wrap of the existing React web app**
- Fastest path. Single codebase.
- Native features (camera, push, haptics) via Capacitor plugins.
- 90% web feel; works for this app since the UI is already responsive.
- Recommended unless native-native polish is critical.

**Option B: React Native rewrite with Expo**
- Truer native feel, better animations, better camera.
- More work — reimplement every screen.
- Only worth it if we hit performance or UX walls with Capacitor.

**Assuming Option A:**

1. `npm i @capacitor/core @capacitor/ios @capacitor/android`
2. `npx cap add ios && npx cap add android`
3. Replace web-only APIs with Capacitor plugins: Camera, Geolocation, Haptics, LocalNotifications, Preferences (for faster startup reads)
4. Configure deep links for magic-link auth on mobile
5. Test on real devices — TestFlight for iOS, Google Play Internal Testing for Android
6. App icons, splash screens, store listings (screenshots, descriptions — Haiku generates the copy)

Exit criteria: same user can sign in on web, iOS, and Android and see the same journal.

---

## Phase 8 — Deployment & launch (week 12)

1. **Web** — Vercel, production domain (e.g. `bloomandbrew.app`), analytics (Plausible or Vercel Analytics)
2. **iOS** — App Store submission; prepare privacy disclosures (geolocation, camera, notifications)
3. **Android** — Google Play submission; same disclosures
4. **Monitoring**
   - Sentry for frontend error tracking
   - Supabase logs for backend
   - Uptime monitor (UptimeRobot free tier) on the web URL and Edge Function endpoints
5. **Legal**
   - Privacy policy (GDPR-aware; brew data is personal preference, not sensitive, but geolocation needs consent)
   - Terms of service
   - Cookie banner if targeting EU
6. **Pre-launch QA**
   - Full manual walkthrough on Chrome, Safari, Firefox, iOS Safari, Android Chrome
   - Edge cases: offline, denied permissions, flaky network, empty state on every screen
   - Load test the Edge Functions (even a small launch can spike AI calls)

---

## Cross-cutting concerns

### Cost controls
- Supabase free tier: 500MB DB, 1GB storage, 2GB egress/month, 500K Edge Function invocations
- Anthropic API: the biggest variable. Budget rule of thumb: $0.01/user/month at moderate use with Sonnet for tweak coach only. Cap with per-user rate limits. Flavor finder is free (client-side keywords).
- Google Places: $200/month free credit — more than enough for < 10K cafe searches

### Testing strategy
- Unit tests (`vitest`) for pure logic: `grinderMath`, `recipeScaling`, `flavorMatch`, `tweakEngine` fallbacks
- Integration tests for Supabase queries (with a test project)
- Playwright smoke tests for the five critical flows: sign up, log a brew, open journal, run tweak coach, find a cafe
- Manual exploratory QA before each release

### Data migration
- When the schema changes in production, use Supabase migrations (`supabase migration new <name>`) committed to the repo
- Never edit the production DB by hand once we have real users

### Observability
- Structured logs in Edge Functions (`console.log` JSON blobs with `user_id`, `feature`, `duration_ms`)
- Sentry breadcrumbs around every mutation
- A weekly dashboard query: active users, brews logged, tweaks invoked, top recipes, error rate

---

## Dependency order (what blocks what)

```
Phase 0 (Vite)
  -> Phase 1 (Supabase schema)
       -> Phase 2 (Auth)
            -> Phase 3 (Data flows)
                 -> Phase 4 (AI)   -> Phase 6 (Notifications/PWA)   -> Phase 8 (Launch)
                 -> Phase 5 (External APIs)                       ->
            -> Phase 7 (Mobile) can start in parallel with Phase 5
```

---

## Open questions to resolve before starting

1. **Free tier is enough for launch — do we have a soft cap on users we want to enforce?** Supabase free tier breaks around 50K MAU; we should know the line.
2. **Who approves community-submitted recipes?** MVP assumes manual SQL. Do we need an admin UI by launch?
3. **Is a Pro tier on the roadmap?** (unlimited tweaks, cloud-synced audio playlists, etc.) If yes, Stripe integration becomes a Phase 6/7 item.
4. **Target launch geography.** Bangalore-only vs global changes the cafe data strategy and the privacy-policy scope.

---

## What to build first, concretely

This week (Phase 0):
1. Spin up the Vite + React + TS project
2. Port `index.html` piece by piece into components, preserving every pixel
3. Wire `localStorage` persistence
4. Deploy to Vercel
5. Confirm visual parity with the current file

Do not open any Supabase work until Phase 0 is green.
