# GroupWatchlist

A shared movie/TV queue for a family — everyone rates shows individually, so
the app can surface what the group will actually agree to watch tonight, or
what you'd enjoy watching solo. Built with Next.js and Supabase.

Live at: https://group-watchlist.vercel.app/

## Running it locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and fill in your own Supabase project's
   URL and anon key (Project Settings → Data API / API Keys in Supabase):

   ```bash
   cp .env.example .env.local
   ```

3. In your Supabase project's SQL Editor, create the two tables this app
   needs — see `devpost/spec.md > Data Model` for the full schema (`shows`
   and `ratings`).

4. Start the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Deploying

This repo deploys to [Vercel](https://vercel.com) directly from GitHub —
push to `main` and Vercel redeploys automatically. The same two environment
variables from `.env.local` need to be set in the Vercel project's
Settings → Environment Variables (Production and Preview).

## Project docs

See `devpost/` for the full scope, product requirements, technical spec, and
build checklist this project was planned and built from.
