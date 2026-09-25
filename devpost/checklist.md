---
doc: checklist
status: approved
---

# Build Checklist

Build mode: learn

## Slices

- [x] **1. You can add a show manually and see it in a family queue**
  Becomes usable: A live app connected to a real database — open it, add a show by typing its title (other fields optional), and see it appear in a list. An empty queue shows the welcome message instead of a blank screen.
  Why now: Every later slice depends on this pipeline (browser → app → database → back). This is where project bootstrapping belongs — getting real data flowing end to end first means every later slice has real ground to build on.
  PRD ref: `prd.md > The Core Journey` (steps 1-5), `prd.md > Adding a Show`, `prd.md > States and Boundaries` (empty state)
  Spec ref: `spec.md > Stack`, `spec.md > File Structure`, `spec.md > Data Model` (`shows` table), `spec.md > Components` (Family View, Add Show — manual path only), `spec.md > Look and Feel`
  Build: Scaffold the Next.js app in this repo, install `@supabase/supabase-js`, walk through creating a free Supabase project and the `shows` table, wire up `.env.local` (gitignored) and `lib/supabase.js`, build a manual Add Show form (title required, everything else optional) and a Family view that lists all shows or shows the empty-state welcome copy, styled per the warm/orange direction.
  Verify (mechanical): `npm run dev` starts with no errors; add a show through the form and confirm it appears in the Family view and as a new row in Supabase's `shows` table.
  Learner check: Open the app, add a show manually with just a title, and see it show up in the list.
  Commit: `Scaffold app, connect Supabase, add manual show entry and family list`

- [x] **2. Pick your name and rate a show**
  Becomes usable: Each person can pick their name once (remembered on their device) and give a 1-5 star rating to a show, saved for everyone to eventually see.
  Why now: This is the raw material of the unique kernel — individual, per-person ratings — and it needs to exist before either sorted view can mean anything.
  PRD ref: `prd.md > Identity`, `prd.md > Rating`, `prd.md > Main Row vs. Detail View`
  Spec ref: `spec.md > Data Model` (`ratings` table), `spec.md > Components` (Name Picker, Show Detail, Star Rating Control), `spec.md > File Structure` (`lib/identity.js`, `components/StarRating.js`, `app/show/[id]/page.js`)
  Build: Create the `ratings` table in Supabase, build `lib/identity.js` (localStorage-backed name picker shown once), the Show Detail page, and a tap-to-set Star Rating control labeled as an interest gauge ("How interested are you in watching this?") that writes/updates that person's row in `ratings`.
  Verify (mechanical): Clear the saved name, reload, and confirm the name picker appears and a chosen name persists across reload; open a show, set a rating, and confirm a row appears/updates in the `ratings` table in Supabase.
  Learner check: Pick your name, open a show, rate it, and check that your rating shows.
  Commit: `Add identity, show detail, and star rating`

- [x] **3. The family queue sorts itself, live**
  Becomes usable: The Family view re-sorts to put shows everyone's on board with at the top, updates within seconds as anyone rates (even from another tab or phone), and lets you filter to what you personally haven't rated.
  Why now: This is the first half of the kernel actually paying off — ratings visibly driving agreement. Proving live updates now, with only one view, is simpler than debugging it alongside the personal view too.
  PRD ref: `prd.md > Family View Sorting`, `prd.md > Finding What You Haven't Rated`
  Spec ref: `spec.md > Components` (Family View — sorting, polling), `spec.md > File Structure` (`lib/sorting.js`), `spec.md > What Was Simplified and Why` (10-second polling)
  Build: Implement the family sort rule in `lib/sorting.js` (lowest rating first, tiebreak by average, unrated at the very bottom), wire the Family view to use it and re-fetch from Supabase every 10 seconds, add the "unrated by me" toggle, show each family member's individual stars on the row.
  Verify (mechanical): Seed ratings across a few shows that should produce a known order and confirm the Family view matches it; rate a show in one browser tab and confirm a second tab re-sorts within about 10 seconds with no manual reload.
  Learner check: Rate a couple of shows as if you were different people (switch the saved name between them) and watch the family list reorder to put the one you'd all enjoy at the top.
  Commit: `Sort family view by predicted agreement with live polling`

- [x] **4. Your personal view surfaces solo picks**
  Becomes usable: Switching to the Personal view shows shows you'd enjoy that the rest of the family isn't into — a genuine solo pick, not just "everything I've rated."
  Why now: Completes the unique kernel — the whole reason for per-person ratings — while the sorting logic and data are still fresh from slice 3.
  PRD ref: `prd.md > Personal View`
  Spec ref: `spec.md > Components` (Personal View), `spec.md > File Structure` (`app/personal/page.js`)
  Build: Add the Personal view page reusing `ShowRow`, implement the personal filter/sort rule in `lib/sorting.js` (only shows you've rated, excluding anything nobody else has rated, sorted by your rating first then by others' lowest rating ascending), add the view tab.
  Verify (mechanical): Seed ratings so one show is a clear "you love it, they don't" case and another has zero ratings from anyone else; confirm the first appears in Personal view and the second doesn't.
  Learner check: Switch to your Personal view and check whether a show you rated highly (that nobody else has rated) shows up there — and that one with no other ratings at all doesn't.
  Commit: `Add personal view with solo-pick sorting`

- [x] **5. Add a show by pasting a Rotten Tomatoes link**
  Becomes usable: Pasting a Rotten Tomatoes URL auto-fills title, cover image, genre, synopsis, both scores, and platform(s) into an editable preview before saving — with a clear error and manual-entry fallback if the link can't be read.
  Why now: The one real technical risk in this build (reading data from an external page). Tackling it once the core kernel already works means a parsing hiccup doesn't block anything else, and the manual-entry fallback already exists from slice 1.
  PRD ref: `prd.md > Adding a Show`, `prd.md > States and Boundaries` (Rotten Tomatoes link error)
  Spec ref: `spec.md > Components` (Link Parser, Add Show), `spec.md > File Structure` (`app/api/parse-link/route.js`), `spec.md > Important Failure Modes`, `spec.md > Decisions and Open Issues` (Rotten Tomatoes feasibility)
  Build: Build `app/api/parse-link` to fetch a pasted Rotten Tomatoes URL and extract whatever fields are available, add the link path to the Add Show screen feeding into the same editable preview as manual entry, handle fetch/parse failure with an error message and a jump to manual entry.
  Verify (mechanical): Test the parser against at least two real Rotten Tomatoes pages (a movie and a TV show) and confirm the fields it finds are correct; test an invalid or unreachable URL and confirm the error-and-manual-fallback path works.
  Learner check: Paste a real Rotten Tomatoes link for a show you actually want to add, check the preview looks right, and save it.
  Commit: `Add Rotten Tomatoes link parsing with editable preview`

- [x] **6. Mark a show watched or delete it**
  Becomes usable: Swiping a row reveals Delete and Mark Watched; watched shows move to a simple read-only archive off the main queue.
  Why now: The last piece of the core loop from `scope.md > The Core Loop` — closes the loop from "add" to "watched" — and is low-risk now that the harder data and sorting work is done.
  PRD ref: `prd.md > Marking Watched / Deleting`, `prd.md > Watched Archive`
  Spec ref: `spec.md > Components` (Swipe Actions, Watched Archive), `spec.md > File Structure` (`components/SwipeActions.js`, `app/watched/page.js`), `spec.md > What Was Simplified and Why` (status flag)
  Build: Add `SwipeActions` to `ShowRow` (Delete removes the row from `shows`; Mark Watched flips `status` to `watched`), filter watched shows out of Family/Personal views, add the read-only Watched Archive page and its link/count on the Family view.
  Verify (mechanical): Swipe a show and mark it watched — confirm it disappears from Family/Personal views and appears in the Watched Archive; swipe and delete another — confirm it's gone from Supabase entirely.
  Learner check: Swipe a show you're done with, mark it watched, and check it shows up in the Watched Archive instead of the main list.
  Commit: `Add swipe actions and watched archive`

- [x] **7. The family can use it on their own phones**
  Becomes usable: The real, deployed app at a public-but-unlisted URL, reachable from each family member's own phone.
  Why now: This is the learner's actual stated goal beyond the hackathon (`scope.md > Why This Matters to the Learner`) — deploying while the build is fresh means the demo video can show the real deployed version, and `6-ship` doesn't need to start from zero on it.
  PRD ref: — (deployment isn't a product behavior; carried from the spec)
  Spec ref: `spec.md > Where It Runs and How Someone Tries It`, `spec.md > External Services and Dependencies` (Vercel), `spec.md > Decisions and Open Issues` (deployment target)
  Build: Push this repo to a GitHub repository, connect it to a new Vercel project, add the Supabase URL/key as Vercel environment variables, deploy, and write a short README with setup and deploy notes.
  Verify (mechanical): Visit the deployed Vercel URL and re-run the core checks from slices 1 and 5 (add a show, see it listed; paste a Rotten Tomatoes link) against the live site instead of localhost.
  Learner check: Open the deployed link on your own phone (and have your husband and kid open it on theirs), optionally add it to your home screen, and confirm you can each pick your name and see the same queue.
  Commit: `Add project README with setup and deploy notes`

- [x] **8. Lock down data access behind server-side routes**
  Becomes usable: The browser no longer talks to Supabase directly — every read and write goes through your own Next.js server, which is the only thing holding the powerful Supabase key. Row Level Security is turned on with no public policies, so even someone who finds your Supabase project URL can't read or change your family's shows or ratings.
  Why now: A `6-ship` security check found that the Supabase anon key embedded in the deployed site lets anyone with your project URL read and write your `shows` and `ratings` tables directly, bypassing the app entirely. You chose the real fix over a cosmetic one.
  PRD ref: — (not a product behavior; a security/architecture change carried from a `6-ship` finding)
  Spec ref: `spec.md > How This Works, In Plain Language`, `spec.md > File Structure`, `spec.md > Data Model`, `spec.md > External Services and Dependencies` (revised as part of this slice)
  Build: Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` as server-only env vars (no `NEXT_PUBLIC_` prefix); update `lib/supabase.js` to use them; add `app/api/shows/route.js` (GET list by status, POST create), `app/api/shows/[id]/route.js` (GET one show + my rating, PATCH status, DELETE), and `app/api/ratings/route.js` (POST upsert rating); update `lib/useShowsAndRatings.js`, `app/page.js`, `app/personal/page.js`, `app/watched/page.js`, `app/add/page.js`, and `app/show/[id]/page.js` to call these routes with `fetch` instead of importing `@/lib/supabase` directly; in Supabase's SQL editor, enable Row Level Security on `shows` and `ratings` with no policies (the service role key used server-side bypasses RLS automatically).
  Verify (mechanical): `npm run dev` starts with no errors; exercise every route locally (add a show, rate it, mark it watched, delete one) and confirm each still works through the browser; re-run the same direct-to-Supabase read request used during the `6-ship` check with the old anon key and confirm it's now rejected (401/403) instead of returning data.
  Learner check: Use the app locally exactly like normal — add a show, rate it, mark one watched, delete one — and confirm nothing feels different to use.
  Commit: `Move Supabase access behind server routes and lock down RLS`

## Hands-on Checkpoints

- [x] Early usable behavior explored — after slice 1 (first working screen; a chance to confirm the warm/orange visual direction before more screens get built)
- [x] Final kick-the-tires exploration and feedback completed — learner and family used the live deployed app for real; no problems found

## Final Review

- [x] Final review complete — feedback resolved and learner confirms ready to ship (no changes needed; family is already using it)

## Code Tour and App Map

- [x] Learning activity complete — guided route for a newcomer
- [x] Optional edit and transfer reflection addressed — edit declined ("it's perfect the way it is"); transfer question skipped since she'd already expressed the takeaway
- [x] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: Traced rating a show end to end — components/StarRating.js (tap) → app/show/[id]/page.js `handleSubmit` (writes to the ratings table) → lib/sorting.js `sortFamilyView` (recomputes the Family Queue order). Connects to the learner's goal of understanding how an agent turns an idea into working code.
Route and stops: components/StarRating.js; app/show/[id]/page.js `handleSubmit` (line 50); lib/sorting.js `sortFamilyView` (line 14) — all three walked through live in chat.
Edit outcome: declined — learner said the app is "perfect the way it is."
Reflection: not asked — learner had already expressed satisfaction/the takeaway unprompted.
Activity mode: live conversational walkthrough with real file/line references (no shared editor session)

## Revisions

- Personal View sorting changed (`prd.md > Personal View`) — now requires the current person's own rating to be 4 or 5 (not just rated at all) to appear, and sorts by the average of everyone else's ratings ascending (not the lowest individual rating). Trying the built feature against real family data surfaced that "own rating first" put a show everyone already loves above a real solo pick nobody else wanted — the learner redefined the rule live during slice 4.
- Personal View no longer excludes shows nobody else has rated (reverses the original `scope.md`/`prd.md` decision) — they're treated as a neutral average of 3, landing between the "family doesn't want it" and "family also likes it" groups instead of being hidden. Decided live during slice 5 while trying the app against real data.
- Added slice 8 (data-access lockdown) after the checklist was already complete — a `6-ship` security check found the deployed site's public Supabase key let anyone with the project URL read and write the family's shows and ratings directly, bypassing the app. Moved all database access behind Next.js API routes using a server-only secret key, and enabled Row Level Security with no policies on both tables. `spec.md > How This Works`, `> File Structure`, and `> External Services and Dependencies` updated to match. `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY` replaced by server-only `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` in `.env.local` and `.env.example`.
