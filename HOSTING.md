# Bloom & Brew — Hosting Guide

A quick-start for putting your app on the internet so you can share it.

---

## What you have

A single file: **`bloom-and-brew.html`**

It's self-contained — React, all the code, all the styling, every feature — bundled into one HTML file. That makes hosting stupidly easy.

---

## Option 1 — Netlify Drop (fastest, ~60 seconds)

Best for quick sharing. No account, no terminal, no Git.

1. Go to **https://app.netlify.com/drop**
2. Drag `bloom-and-brew.html` into the browser window
3. You'll get a URL like `https://random-name-12345.netlify.app` — it's live
4. Share that URL with anyone

**One catch:** The file must be named `index.html` for the URL to load the app directly at the root. So before dragging:
- Rename `bloom-and-brew.html` → `index.html`
- Or, put it in a folder named `bloom-and-brew` and drag the folder — the URL will be `...netlify.app/bloom-and-brew.html`

That's it. No account needed for the first deploy. If you want to update it later, sign up (free) and you'll be able to drag new versions to the same URL.

---

## Option 2 — Vercel (best for "real" hosting)

If you want a proper setup with your own URL, version history, and automatic updates when you change code.

### 1. Put your code in GitHub

- Sign up at **https://github.com** if you haven't.
- Click **"New repository"**, name it `bloom-and-brew`, make it public, click Create.
- On the next page, look for **"uploading an existing file"** — click it.
- Drag `bloom-and-brew.html` in. **Rename it to `index.html`** when GitHub shows the filename.
- Click **Commit changes**.

### 2. Connect Vercel

- Go to **https://vercel.com** and sign up with your GitHub account (one click).
- Click **Add New → Project**.
- Find your `bloom-and-brew` repo and click **Import**.
- Leave all settings as default. Click **Deploy**.
- ~30 seconds later you'll have a URL like `bloom-and-brew.vercel.app`.

### 3. Updating the site

Whenever you want to change the app:
- Edit `index.html` on GitHub directly (click the pencil icon on the file page), or
- Upload a new version from your computer (same "Add file → Upload files" flow)
- Vercel will automatically rebuild and redeploy in ~30 seconds

### 4. Custom domain (optional)

If you want `bloomandbrew.com` instead of `.vercel.app`:
- Buy the domain on Namecheap, Google Domains, or Cloudflare (~$10-15/year)
- In Vercel: Project → Settings → Domains → add your domain
- Follow Vercel's instructions to update DNS records at your registrar

---

## Option 3 — GitHub Pages (free, a bit slower to deploy)

If you're already using GitHub and want everything in one place.

1. Follow Step 1 from the Vercel guide (put `index.html` in a GitHub repo).
2. In the repo, go to **Settings → Pages** (left sidebar).
3. Under "Source," select **Deploy from a branch**.
4. Pick `main` branch, root folder. Click Save.
5. After a few minutes, your site will be at `https://yourusername.github.io/bloom-and-brew/`

Updates take 1-3 minutes to show up after you push changes.

---

## My recommendation

- **Just want to share with friends today?** → Netlify Drop. 60 seconds.
- **Want to iterate and keep building?** → Vercel + GitHub. Best workflow for developers.
- **Already live in the GitHub ecosystem?** → GitHub Pages.

---

## Important caveats

### This is still a prototype

The app currently stores everything in browser memory — your journal entries, beans, settings reset when the user refreshes the page. This is fine for a demo, not for a real product.

**Next steps when you're ready to make it real:**

1. **Add `localStorage`** so data persists between sessions. This is a small code change — I can walk you through it.
2. **Move to Vite + React** (proper project, not a single HTML file). This gives you faster loads, code splitting, and the ability to safely use API keys.
3. **Add Supabase** for user accounts + cloud-synced data. See the "Build-out plan" we discussed earlier.
4. **Swap rule-based AI for real AI.** The tweak engine and flavor matcher currently use hardcoded logic. Real OpenAI/Claude API calls would go through your backend once you have Supabase set up.

### Performance note

The current HTML file uses Babel-in-the-browser to run JSX. This works but is slow on first load (takes ~2 seconds to compile). Good enough for sharing, not ideal for public launch. Moving to Vite fixes this — the code gets pre-compiled at build time and loads instantly.

### Asset size

At ~180KB the file is larger than a typical webpage but still loads in a second or two even on slow connections. No optimization needed until you have real users.

---

## Testing before sharing

Before you send the URL around:

- Open it in Chrome, Safari, and Firefox — confirm it looks right in each
- Try on your phone — the responsive layout should kick in
- Click through every screen: Home → Methods → Setup → Recipes → Brew → Log → Journal → Tweak → Cafes → Glossary → Discover
- If anything breaks, open the browser console (right-click → Inspect → Console) and screenshot the red error before asking me

---

## Sharing etiquette

When sending to friends:

- Mention it's a prototype so they set expectations accordingly
- Ask what broke, not whether they liked it — specific bugs are more actionable than vibes
- Keep a running list of their feedback in a note somewhere; that's how version 2 writes itself

Enjoy brewing.
