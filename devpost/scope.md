---
doc: scope
status: approved
---

# Family Watch Queue

A shared queue where you, your husband, and your kid each rate shows you're considering, so the list surfaces what you're most likely to agree on watching tonight.

## The Unique Kernel
Everyone in the family rates a show individually — not one shared "we all like this" score, but *your* rating, *his* rating, *theirs*. Because ratings are tracked per person, the same queue can be viewed two ways: a **family view** sorted by predicted agreement (the safest bet for everyone to watch together), and a **personal view** for solo watching (shows you'd rate highly that nobody else is likely to want, useful for watching alone during exercise). No scrolling and negotiating from scratch every time.

## Who It's For
A specific family of three: mom, dad, and one kid, who watch TV together most evenings across Netflix, YouTube, Hulu, and Amazon Prime. Today, show ideas that come up during the day (a friend's recommendation, a news article) get jotted into the Notes app — a plain list with no ratings, no platform info, and no way to see whether everyone would actually enjoy it.

## The Core Loop
Someone hears about a show during the day and adds it to the queue: title, platform, plus genre/synopsis/rating auto-filled from a lookup. Later, when the family sits down to watch, each person opens the queue and rates the shows they have an opinion on. The list is sorted by predicted agreement, so the top of the list is the night's answer. After watching, mark it watched (or delete it if it turns out nobody's interested). They come back to it every time they need to decide what to watch — which, for this family, is most evenings.

## Inspiration & Identity
Directly inspired by Netflix's "My List" queue feature — but platform-agnostic, since this family watches across Netflix, YouTube, Hulu, and Amazon Prime, not just one service. No particular visual reference given; keep it simple and functional for now, revisit look and feel in `3-prd`.

## Why This Matters to the Learner
She's a cell biologist and longtime social entrepreneur (co-founder of Addgene, 22 years as CEO/CSO) who recently stepped back into an advisory role specifically to make room for learning new things. This project is a low-stakes, personally meaningful way to learn how to work with an AI coding agent — and it solves a real, recurring friction point for evenings with her husband and kid, turning "what do we watch" into what she hopes feels like genuine, low-friction family time.

## What "Working" Looks Like
A one-minute demo: (1) add a show by pasting a Rotten Tomatoes link and watch its genre/synopsis/rating/platform auto-populate, then add a second show manually (one not on Rotten Tomatoes) to show that path too; (2) each family member picks their name, sees which shows they haven't rated yet, and adds their own star/rank rating to a show; (3) the family queue view shows the list sorted with the show predicted to be most agreed-upon at the top, and switching to the personal view instead surfaces a show she'd love that nobody else wants — perfect for a solo exercise-watching session. Mark-watched and delete are both visible and working.

## The POC Boundary
- Add a show with two ways to fill it in: paste a Rotten Tomatoes link and have genre, synopsis, rating, and platform(s) auto-populate when that data is available — or enter everything manually (including platform) for anything not on Rotten Tomatoes, or when RT doesn't list where to watch it
- A show can have more than one platform (Netflix/YouTube/Hulu/Amazon Prime), since the same title is often available in multiple places
- Each of the three family members can select their name (no accounts/login) and give their own star/rank rating per show
- A way to see or filter which shows you personally haven't rated yet, so new additions are easy to find
- A family queue view sorted by predicted agreement across everyone's ratings
- A personal queue view for solo watching, surfacing shows rated highly by you but low by everyone else
- Mark a show watched
- Delete a show
- Data (the actual queue and ratings) stays local/private even though the code repo is public — kept out of git via `.gitignore`, same as API keys

## Later
- Sharing the app with friends or other families beyond this household

## Explicitly Cut
- Real user accounts/authentication — unnecessary complexity for a closed group of three known people; a simple name picker covers it for this proof of concept.
