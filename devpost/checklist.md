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

- [ ] **4. Your personal view surfaces solo picks**
  Becomes usable: Switching to the Personal view shows shows you'd enjoy that the rest of the family isn't into — a genuine solo pick, not just "everything I've rated."
  Why now: Completes the unique kernel — the whole reason for per-person ratings — while the sorting logic and data are still fresh from slice 3.
  PRD ref: `prd.md > Personal View`
  Spec ref: `spec.md > Components` (Personal View), `spec.md > File Structure` (`app/personal/page.js`)
  Build: Add the Personal view page reusing `ShowRow`, implement the personal filter/sort rule in `lib/sorting.js` (only shows you've rated, excluding anything nobody else has rated, sorted by your rating first then by others' lowest rating ascending), add the view tab.
  Verify (mechanical): Seed ratings so one show is a clear "you love it, they don't" case and another has zero ratings from anyone else; confirm the first appears in Personal view and the second doesn't.
  Learner check: Switch to your Personal view and check whether a show you rated highly (that nobody else has rated) shows up there — and that one with no other ratings at all doesn't.
  Commit: `Add personal view with solo-pick sorting`

- [ ] **5. Add a show by pasting a Rotten Tomatoes link**
  Becomes usable: Pasting a Rotten Tomatoes URL auto-fills title, cover image, genre, synopsis, both scores, and platform(s) into an editable preview before saving — with a clear error and manual-entry fallback if the link can't be read.
  Why now: The one real technical risk in this build (reading data from an external page). Tackling it once the core kernel already works means a parsing hiccup doesn't block anything else, and the manual-entry fallback already exists from slice 1.
  PRD ref: `prd.md > Adding a Show`, `prd.md > States and Boundaries` (Rotten Tomatoes link error)
  Spec ref: `spec.md > Components` (Link Parser, Add Show), `spec.md > File Structure` (`app/api/parse-link/route.js`), `spec.md > Important Failure Modes`, `spec.md > Decisions and Open Issues` (Rotten Tomatoes feasibility)
  Build: Build `app/api/parse-link` to fetch a pasted Rotten Tomatoes URL and extract whatever fields are available, add the link path to the Add Show screen feeding into the same editable preview as manual entry, handle fetch/parse failure with an error message and a jump to manual entry.
  Verify (mechanical): Test the parser against at least two real Rotten Tomatoes pages (a movie and a TV show) and confirm the fields it finds are correct; test an invalid or unreachable URL and confirm the error-and-manual-fallback path works.
  Learner check: Paste a real Rotten Tomatoes link for a show you actually want to add, check the preview looks right, and save it.
  Commit: `Add Rotten Tomatoes link parsing with editable preview`

- [ ] **6. Mark a show watched or delete it**
  Becomes usable: Swiping a row reveals Delete and Mark Watched; watched shows move to a simple read-only archive off the main queue.
  Why now: The last piece of the core loop from `scope.md > The Core Loop` — closes the loop from "add" to "watched" — and is low-risk now that the harder data and sorting work is done.
  PRD ref: `prd.md > Marking Watched / Deleting`, `prd.md > Watched Archive`
  Spec ref: `spec.md > Components` (Swipe Actions, Watched Archive), `spec.md > File Structure` (`components/SwipeActions.js`, `app/watched/page.js`), `spec.md > What Was Simplified and Why` (status flag)
  Build: Add `SwipeActions` to `ShowRow` (Delete removes the row from `shows`; Mark Watched flips `status` to `watched`), filter watched shows out of Family/Personal views, add the read-only Watched Archive page and its link/count on the Family view.
  Verify (mechanical): Swipe a show and mark it watched — confirm it disappears from Family/Personal views and appears in the Watched Archive; swipe and delete another — confirm it's gone from Supabase entirely.
  Learner check: Swipe a show you're done with, mark it watched, and check it shows up in the Watched Archive instead of the main list.
  Commit: `Add swipe actions and watched archive`

- [ ] **7. The family can use it on their own phones**
  Becomes usable: The real, deployed app at a public-but-unlisted URL, reachable from each family member's own phone.
  Why now: This is the learner's actual stated goal beyond the hackathon (`scope.md > Why This Matters to the Learner`) — deploying while the build is fresh means the demo video can show the real deployed version, and `6-ship` doesn't need to start from zero on it.
  PRD ref: — (deployment isn't a product behavior; carried from the spec)
  Spec ref: `spec.md > Where It Runs and How Someone Tries It`, `spec.md > External Services and Dependencies` (Vercel), `spec.md > Decisions and Open Issues` (deployment target)
  Build: Push this repo to a GitHub repository, connect it to a new Vercel project, add the Supabase URL/key as Vercel environment variables, deploy, and write a short README with setup and deploy notes.
  Verify (mechanical): Visit the deployed Vercel URL and re-run the core checks from slices 1 and 5 (add a show, see it listed; paste a Rotten Tomatoes link) against the live site instead of localhost.
  Learner check: Open the deployed link on your own phone (and have your husband and kid open it on theirs), optionally add it to your home screen, and confirm you can each pick your name and see the same queue.
  Commit: `Add project README with setup and deploy notes`

## Hands-on Checkpoints

- [x] Early usable behavior explored — after slice 1 (first working screen; a chance to confirm the warm/orange visual direction before more screens get built)
- [ ] Final kick-the-tires exploration and feedback completed

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: [what actually happened; real document/test/code references; unfinished work if interrupted]
Route and stops: [actual paths and symbols; guided stops completed, or reference-only route]
Edit outcome: [tried/kept/reverted/declined/not applicable; verification if changed]
Reflection: [offered/answered/declined/already covered — personal answer belongs only in the ignored profile]
Activity mode: [live app and editor, explicit static fallback, focused alternative, prior practice, or recap]

## Revisions
