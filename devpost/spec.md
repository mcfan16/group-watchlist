---
doc: spec
status: approved
---

# GroupWatchlist — Technical Spec

## How This Works, In Plain Language

Three pieces work together. **The website** is what you actually see and tap on your phone — the queue, star ratings, add-show screen. **A small helper function** runs behind the scenes only when needed — right now, just for fetching a pasted Rotten Tomatoes page and reading out its details, since a phone's browser can't safely reach out to another website directly. **A shared database** is a spreadsheet living in the cloud that all three of your phones read from and write to, so when your husband rates something, you see it too.

We're building the website and the helper function together using **Next.js**, and using **Supabase** as the shared spreadsheet. **Vercel** takes the finished code from your GitHub repo and puts it on the internet so all three phones can reach it from anywhere — no server to set up or maintain yourselves.

This shape was chosen because it needs only two outside accounts (Supabase, Vercel) beyond GitHub, all three are free for a project this size, and Next.js + Vercel is an extremely well-documented combination — meaning when something breaks while building, there are real answers to find.

## The Core Journey Through the System

Traces `prd.md > The Core Journey`:

1. You open the site on your phone. The app checks your browser's saved name (`lib/identity.js`, reading from `localStorage`). No saved name → shows the one-time name picker, which saves your choice.
2. The app fetches the current shows and ratings from Supabase and shows the **Family view**, sorted per `prd.md > Family View Sorting`.
3. Empty queue → the welcome message and "add your first show" prompt (`prd.md > States and Boundaries`).
4. You tap "add new" → the **Add Show** page. Paste a Rotten Tomatoes URL → your browser sends it to `app/api/parse-link` → that helper function fetches the page and reads out title, cover image, genre, synopsis, Tomatometer, Popcornmeter, and platform(s) → sends back whatever it found → you see an editable preview → you save → a new row is written to the `shows` table in Supabase.
5. The new show appears at the bottom of the Family view (unrated).
6. Anyone taps into a show (`app/show/[id]`) and adds their 1–5 star rating → a row is written to the `ratings` table.
7. The Family and Personal views quietly re-check Supabase for new data every 10 seconds while open (polling), so ratings from other family members show up and re-sort without anyone needing to manually refresh.
8. Swipe a row → **Delete** (removes the row from `shows`) or **Mark Watched** (flips its status to "watched," which routes it into the read-only Watched Archive and off the active views).
9. Anyone can switch to the **Personal view** tab, filtered and sorted per `prd.md > Personal View Sorting`.

## Stack

- **Next.js** (App Router, latest stable at setup time) — one project holds both the pages you see and the small server-side helper function, so there's only one codebase to learn and deploy. Docs: https://nextjs.org/docs
- **Supabase** (hosted Postgres + a JavaScript client library) — the shared database; free tier is generous enough for a household's queue. Docs: https://supabase.com/docs
- **Vercel** — hosting; connects directly to the GitHub repo and redeploys automatically on every push. Docs: https://vercel.com/docs
- **Plain CSS** (no UI framework) for styling — keeps the "warm, clean, minimalist" look direct and avoids an extra dependency to learn.

*Unverified, flag to check early in the build:* exact current version numbers for Next.js and the Supabase JS client — use `npx create-next-app@latest` and `npm install @supabase/supabase-js` at setup time to get whatever is current, rather than pinning versions here from memory.

## Where It Runs and How Someone Tries It

- **Local development:** `npm run dev`, then open `http://localhost:3000` in a browser — this is what to record for the required demo video.
- **Real family use (the learner's actual goal beyond the hackathon):** deployed on Vercel, connected to the GitHub repo, so each family member opens the same public-but-unlisted URL from their own phone. Each person can use their phone's "Add to Home Screen" option to get an icon that opens it full-screen, like a real app — no app store needed.
- **Environment requirements:** Node.js (any recent LTS version), a free Supabase project (provides a URL + API key), a free Vercel account connected to GitHub. Supabase keys go in `.env.local`, which is gitignored — never committed.
- Submission requires a short demo video and a public GitHub repository; the Vercel deployment is a bonus for real use, not a substitute for either.
- **Recommended demo approach:** record using the deployed Vercel version, ideally showing it on multiple actual phones — that demonstrates the real kernel (separate people, separate devices, agreement forming live) far more convincingly than one browser window standing in for three people. Test the deployed version thoroughly a day or two beforehand; keep the localhost version as a fallback in case of last-minute hosting issues. `6-ship` will help plan and shoot the actual recording.

## Look and Feel

Warm and clean/minimalist, matching `prd.md > Look and Feel`. A warm terracotta orange as the primary accent, paired with a soft teal and a muted rose as complements — avoiding a single flat color. System font stack (no custom web font to load — keeps things simple and fast). Generous white space, rounded cards, calm rather than busy. Plain CSS can fully express this; nothing about the stack constrains it.

**Interface copy:** warm and casual, like a note to family, not a form. One important correction the learner caught: the star control isn't a post-watch "rating" — it's a pre-watch gauge of interest, so it should be labeled and prompted that way (e.g., "How interested are you in watching this?" rather than "Rate this show"). Apply that same "how interested/excited are you" framing anywhere the interface refers to what a star means. Beyond this specific fix and the already-agreed empty-state copy (`prd.md > States and Boundaries`), the rest of the interface text should follow the same warm, casual voice rather than generic labels like "Submit" or "Item" — `5-build` should write it consistently in that voice as each screen gets built, checking in with the learner if a specific wording choice is worth confirming.

## Components

### Name Picker
One-time screen shown when no name is saved on this device. Saves the chosen name to `localStorage` via `lib/identity.js`.
PRD ref: `prd.md > Identity`.

### Family View (`app/page.js`)
Fetches shows + ratings from Supabase, sorts via `lib/sorting.js`, renders each show as a `ShowRow`. Includes the Personal view tab, "add new" button, "unrated by me" toggle, and the Watched Archive link. Polls Supabase every 10 seconds while open and re-sorts if anything changed.
PRD ref: `prd.md > Family View Sorting`, `prd.md > Finding What You Haven't Rated`.

### Personal View (`app/personal/page.js`)
Same data and `ShowRow` component, filtered and sorted per the personal rules in `lib/sorting.js`. Also polls every 10 seconds while open.
PRD ref: `prd.md > Personal View`.

### Add Show (`app/add/page.js`)
Two entry paths (RT link or manual) on one screen. Calls `app/api/parse-link` for the RT path; either path lands on the same editable preview before saving to `shows`.
PRD ref: `prd.md > Adding a Show`.

### Link Parser (`app/api/parse-link`)
Server-side function: fetches the pasted Rotten Tomatoes URL, extracts title, cover image, genre, synopsis, Tomatometer, Popcornmeter, and platform(s) from the page content, returns whatever it finds (partial results are expected and fine). Returns a clear error if the URL can't be fetched or parsed at all.
PRD ref: `prd.md > Adding a Show`, PRD's Open Question about Rotten Tomatoes data availability.

### Show Detail (`app/show/[id]/page.js`)
Platform(s), genre, synopsis, both scores, the link, and the rating control.
PRD ref: `prd.md > Main Row vs. Detail View`.

### Star Rating Control
Tap-to-set 1–5 stars; writes/updates the current person's row in `ratings`. Labeled as a gauge of interest ("How interested are you in watching this?"), not a post-watch review — see Look and Feel above.
PRD ref: `prd.md > Rating`.

### Swipe Actions
Swipe gesture on a `ShowRow` reveals Delete and Mark Watched.
PRD ref: `prd.md > Marking Watched / Deleting`.

### Watched Archive (`app/watched/page.js`)
Read-only list of shows with status "watched." No swipe actions.
PRD ref: `prd.md > Watched Archive`.

## Data Model

**`shows` table** (one row per show):
- `id`, `title`, `cover_image_url`, `platforms` (list of text, since a show can be on more than one), `genre`, `synopsis`, `tomatometer`, `popcornmeter`, `link_url`, `status` (`queued` or `watched`), `created_at`.

**`ratings` table** (one row per person-and-show):
- `id`, `show_id` (links to `shows`), `person` (mom/dad/kid), `stars` (1–5), `updated_at`.

Both tables live in Supabase and are shared by all three phones. A show's data is written once when added (and edited during the preview step); a rating is written or updated whenever that person changes their stars for that show. Nothing is deleted when someone closes the app — everything persists in Supabase between sessions, for everyone.

Identity is the one piece of data that is *not* shared: each phone's chosen name lives only in that phone's `localStorage`.

## File Structure

```
groupwatchlist/
├── app/
│   ├── page.js              # Family view (landing page)
│   ├── personal/page.js     # Personal view
│   ├── add/page.js          # Add Show — RT link or manual, with editable preview
│   ├── show/[id]/page.js    # Show Detail view
│   ├── watched/page.js      # Watched Archive (read-only)
│   ├── api/parse-link/route.js  # Fetches & reads a pasted RT page
│   ├── layout.js            # Shared page frame; checks for a saved name
│   └── globals.css          # Warm/orange styling
├── components/
│   ├── ShowRow.js           # Row: cover image, title, everyone's stars
│   ├── NamePicker.js        # One-time name picker (saves to localStorage)
│   ├── StarRating.js        # Tap-to-rate control
│   └── SwipeActions.js      # Swipe-to-reveal Delete / Mark Watched
├── lib/
│   ├── supabase.js          # Connects to the shared database
│   ├── sorting.js           # Family & personal sort rules
│   └── identity.js          # Reads/writes the saved name (localStorage)
├── devpost/                 # Planning docs (scope, PRD, this spec)
├── .env.local               # Supabase URL/key — gitignored, never committed
├── .gitignore
└── package.json
```

## External Services and Dependencies

- **Supabase** — hosted Postgres database + JS client library (`@supabase/supabase-js`). Free tier. Requires creating a project (gets you a URL + API key) and creating the two tables above. Docs: https://supabase.com/docs
- **Vercel** — hosting, connected to the GitHub repo, auto-deploys on push. Free tier for a project this size. Docs: https://vercel.com/docs
- **Rotten Tomatoes** — not a formal API; the link parser fetches the public page directly. No key, no rate limit documented (since it isn't an official integration), so fetch politely (one request per add, not repeated automatically) and expect occasional pages that don't parse cleanly.

## Important Failure Modes

- **A pasted Rotten Tomatoes link can't be fetched or parsed** → show an error message, offer to retry the link or jump to manual entry (`prd.md > States and Boundaries`).
- **The link parses only partially** (e.g., no Popcornmeter found) → the editable preview simply leaves that field blank for the learner to fill in; nothing blocks saving.
- **Empty queue** → the welcome message and add-first-show prompt, not a blank or broken-looking screen.

## What Was Simplified and Why

- **Simple 10-second polling instead of true real-time sync** — the app quietly re-checks Supabase for new data every 10 seconds while a view is open, rather than an instant push-based connection. This gets nearly the same felt experience (ratings show up within seconds) without websockets or Supabase's realtime feature, which are harder to build and debug reliably. The learner opted into this lightweight version rather than leaving updates fully manual.
- **A status flag instead of a separate "watched" table** — marking a show watched just flips `status` to `watched` rather than moving its data elsewhere. Same result (it disappears from active views, appears in the archive), far simpler to build and query.
- **No accounts/authentication** — per `prd.md > Non-Goals`; a one-time name picker saved to `localStorage` covers identity for three known household members.
- **Plain CSS instead of a UI framework/component library** — one fewer thing to learn for a first build, and the visual direction (warm, minimal) doesn't need a heavy design system to express.

## Decisions and Open Issues

- **Deployment target: Vercel, not local-only** — the learner's stated goal is for her family to actually use this on their own phones after the hackathon, not just demo it once. Tradeoff accepted: two free accounts to set up (Supabase, Vercel) instead of zero.
- **No app-store distribution** — a deployed website, opened via each phone's browser and optionally added to the home screen, gives the family a real app-like experience without the cost (paid developer account), review-approval waitlist, and native-app development that real app-store submission would require. Explicitly out of scope for this proof of concept; noted below as a possible later enhancement.
- **Family score = minimum rating (PRD-level decision, carried into the sort logic here)** — implemented in `lib/sorting.js`, computed from whatever ratings exist in the `ratings` table at load time; not stored as a precomputed value, so it's always current.
- **One genuine uncertainty, investigated during this conversation:** how much show data Rotten Tomatoes pages actually expose to a simple fetch (no official API exists). Tested against two real pages (`monsters_inc`, `friends`) using a fetch-and-read tool — both returned title, synopsis, genre, Tomatometer, Popcornmeter, streaming platform(s), and poster image URL, all present in the page content rather than hidden behind client-side JavaScript. This is a strong signal the plan will work, though the actual parsing code (finding each value by its exact position in the HTML) still needs to be written and tested against more real pages early in the build — some titles or page-layout variations may parse less completely, which is exactly what the editable preview exists to catch.
- **Carried from `prd.md > Open Questions`:** the exact Rotten Tomatoes field list may need small adjustments once the parsing code is actually written against a wider range of pages (TV shows with many seasons, older titles, titles with sparse pages) — not expected to change the architecture, only which fields reliably auto-fill versus need manual entry.

## Possible Later Enhancements

- **True real-time updates** — Supabase's built-in realtime feature (instant push instead of 10-second polling). Not crucial to the learner now that lightweight polling is in the plan; a good next thing to try once the core proof of concept works.
- **Real app-store distribution** — a native app or a wrapped web app (e.g. via Capacitor), submitted to Apple's/Google's app stores. Requires a paid developer account and an approval process; "Add to Home Screen" covers the day-to-day need for now.
