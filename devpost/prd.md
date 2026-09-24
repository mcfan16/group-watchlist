---
doc: prd
status: approved
---

# GroupWatchlist — Product Requirements

A shared movie/TV queue for one family (mom, dad, kid) where everyone rates shows individually, so the app can surface what the group will actually agree to watch tonight — or, on your own, what you'd enjoy watching solo.
Source: `scope.md > The Unique Kernel`, `scope.md > The Core Loop`.

## The Core Journey

1. Someone opens the app on their own phone. The app remembers who they are on that device (picked once, no re-entering their name every time).
2. They land on the **Family view**: a list of shows sorted by predicted family agreement (see below), with a tab to switch to their **Personal view**, and an "add new" button.
3. If the queue is empty, they see a welcome message and a prompt to add the first show.
4. They tap "add new" and either paste a Rotten Tomatoes link (auto-fills title, cover image, genre, synopsis, platform(s), Tomatometer, and Popcornmeter) or jump straight to manual entry. Either way, they see a preview of the filled-in fields and can edit before saving.
5. The new show appears in the Family view, sorted to the bottom until someone rates it.
6. Anyone can tap into a show to see its detail and add or edit their own 1–5 star rating.
7. As ratings come in, the Family view re-sorts: shows where everyone's on board rise to the top.
8. When the family watches something, they swipe it and mark it watched — it moves off the main list into a lightweight watched archive. If a show turns out to be nobody's thing, they swipe and delete it instead.
9. Separately, when someone (e.g., during solo exercise) wants a personal pick, they switch to their Personal view: shows they've rated highly that the rest of the family isn't into, so they can watch guilt-free without "wasting" a family pick.

Success looks like: a show gets added, everyone rates it independently, and the Family view visibly reorders to put the show they'll all enjoy at the top — while the Personal view separately surfaces a solo pick that nobody else wants.

## Screens and Layout

- **Family view** (default landing screen): the shared queue, sorted by predicted family agreement. Includes a tab to Personal view, an "add new" button, a "show only unrated by me" toggle, and a small "Watched" link/icon in a corner for the archive.
- **Personal view**: a tab away from Family view. Same row/detail pattern, filtered and sorted per that person.
- **Add Show screen**: reached from "add new." Two paths from the same first screen — paste a Rotten Tomatoes link, or a link straight to manual entry fields. After a successful link lookup, shows an editable preview before saving.
- **Show Detail view**: reached by tapping any row in either list. Shows the fields not on the row, plus the control to add/edit your own rating.
- **Watched Archive**: reached via the small link/icon on Family view. Read-only list, same basic show info, no swipe actions.

## Look and Feel

Warm and clean/minimalist. Orange as the primary accent, with a complementary palette built around it (rather than a single flat color). Avoid generic default AI-app styling (e.g. default purple). No specific reference app given — the "warm, inviting" feel should come through in color and tone, not heavy decoration.

## Features and Behavior

### Identity

- Each person picks their name once on their own device; the app remembers them across future opens (no accounts/login — just the three known family members).
- Product decision: since each family member uses their own phone, there's no need to support switching identities mid-session for this proof of concept.

### Adding a Show

- Entry point offers two paths side by side: paste a Rotten Tomatoes URL, or go straight to manual entry.
- Required: either the Rotten Tomatoes URL or a title — nothing else is mandatory.
- Fields (auto-filled from the Rotten Tomatoes link when available, editable, or entered manually): title, cover image, platform(s) — a show can have more than one — genre, synopsis, Tomatometer rating, Popcornmeter rating, and a link (the Rotten Tomatoes URL, or a manually-entered link such as a YouTube page).
- After a Rotten Tomatoes link loads successfully, the learner sees an editable preview of everything that was pulled in before it saves — nothing saves silently.
- If the Rotten Tomatoes link fails to load or parse: show an error, let them fix the link, and offer an "add manual entry" option that jumps to the manual fields (same option available up front on the initial add screen too).
- Cover image: pulled from Rotten Tomatoes when available; manually-entered shows without an image show a placeholder graphic instead.

### Rating

- Each person rates a show with 1–5 stars.
- A show can be partially rated (not everyone has to rate it for ratings to count).

### Family View Sorting (the kernel, family half)

- Each show's family score is the **lowest individual rating among the family members who have rated it so far** — one low rating pulls the whole show down, because everyone needs to be on board.
- Sort order: highest family score first.
- Tiebreaker when two shows share the same lowest rating: sort by **average rating** among those who've rated it, highest average first.
- A show with **zero ratings** sinks to the very bottom, below every rated show, regardless of tie logic.
- Sorting is always computed from whichever ratings exist right now — a show doesn't need to be rated by all three people to be sorted.

### Personal View (the kernel, personal half)

- Shows only appear here if the current person rated it **4 or 5 stars** — a solo pick should be something you're genuinely excited about, not just something you rated.
- Shows with **zero ratings from anyone else** never appear in Personal view — "nobody's rated it" is not the same as "nobody wants it," so it doesn't count as a safe solo pick.
- Sort: by the **average rating from everyone else**, ascending — the shows the rest of the family wants least (the safest solo bets, since nobody's missing out) bubble up first. Ties broken by the current person's own rating, highest first.

### Finding What You Haven't Rated

- A toggle/filter on the Family view — "show only unrated by me" — rather than a separate screen, so the learner keeps full context (other ratings, show info) while working through new additions.

### Marking Watched / Deleting

- Swipe a row to reveal two actions: **Delete** and **Mark Watched**.
- Marking watched moves the show off the active Family/Personal views into the Watched Archive.
- Delete removes it entirely.

### Watched Archive

- A small text link or icon in the corner of the Family view (e.g., "Watched (12)") opens a simple, read-only list of watched shows — same basic info, no editing or swipe actions. Kept intentionally minimal so it doesn't compete with the main queue.

### Main Row vs. Detail View

- **Main row** (both Family and Personal views): title, cover image (or placeholder), and each family member's individual star rating.
- **Detail view** (tap into a show): platform(s), genre, synopsis, Tomatometer and Popcornmeter scores, the link (Rotten Tomatoes or manual), and the control to add/edit your own rating.

## States and Boundaries

- **Empty state (first use, no shows yet):** Welcome text — "Welcome to your shared video queue! This is an easy way for you and your friends/family to share shows that you are interested in and decide on what to watch next." — followed by a short gap and a link/button: "Start by adding your first movie or show."
- **Unrated show:** appears at the bottom of the Family view; never appears in anyone's Personal view.
- **Partially-rated show:** sorts normally in the Family view using only the ratings that exist.
- **Rotten Tomatoes link error:** show an error message, let the learner retry the link, and offer a direct path to manual entry.
- **Watched:** removed from active views, viewable only in the minimal read-only Watched Archive.
- **Deleted:** removed entirely, no archive.
- **Persistence:** each person's identity is remembered on their own device between visits — no re-entry needed each time. Queue data (shows, ratings) persists between sessions and stays private, kept out of the public code repository.

## Product Decisions

- **Individual ratings, not one shared score** — so the app can show both family agreement and personal-only picks from the same data (`scope.md > The Unique Kernel`).
- **Remember identity per device, not per session** — the family each has their own phone, so there's no need to re-enter a name every time or support switching users mid-session for this proof of concept.
- **Family score = minimum rating, not average** — the learner was explicit that "everyone needs to be on board," so a single low rating should sink a show even if others loved it.
- **Personal view excludes anything nobody else has rated** — the learner reasoned that "nobody's rated it" isn't evidence the family doesn't want it, so it shouldn't count as a safe solo pick.
- **Watched shows move to a minimal, unbrowsable-by-default archive** rather than staying visible or being deleted — the learner wants a record but doesn't want it cluttering the main queue.
- **A toggle/filter, not a third screen, for "unrated by me"** — agreed as a build-effort tradeoff that keeps the same context visible.

## What We're Building

- Identity: pick-your-name-once, remembered per device (3 family members).
- Add a show via Rotten Tomatoes link (with editable preview) or manual entry, including a multi-platform field, cover image, genre, synopsis, Tomatometer/Popcornmeter ratings, and a link field.
- Error handling and manual-entry fallback for a bad Rotten Tomatoes link.
- 1–5 star rating per person per show.
- Family view sorted by minimum rating (tiebreak: average), unrated shows at the bottom.
- Personal view filtered and sorted per the rules above.
- "Unrated by me" toggle/filter on the Family view.
- Swipe-to-reveal Delete and Mark Watched actions.
- Minimal read-only Watched Archive.
- Main row / detail view split as specified.
- Empty-state welcome copy.
- Warm, clean, orange-based visual direction.

## Deferred From the POC

- **Sharing with friends or other families** — the welcome copy mentions "friends/family" as aspirational framing, but the actual app in this proof of concept only supports the three known household members (`scope.md > Later`).
- **A browsable, full-featured Watched Archive** (search, sort, filtering) — kept to a minimal read-only list for now.

## Possible Later Enhancements

- Sharing the queue (or a public version of it) with friends or other families.
- A richer Watched Archive experience.
- Automatic platform-availability updates if a show's streaming availability changes after it's added.

## Non-Goals

- **Real user accounts / authentication** — unnecessary for a closed group of three known people; a simple per-device name pick covers it (`scope.md > Explicitly Cut`).
- **Switching identities mid-session on a shared device** — not needed since each family member has their own phone.

## Open Questions

- Exactly how the Rotten Tomatoes link gets parsed (what's actually available to pull programmatically, and how reliably) is a technical feasibility question for `4-spec`, not a product one — flag for `4-spec` to investigate before committing to the exact field list above.
