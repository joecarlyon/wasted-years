# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Wasted Years is a static homebrewing recipe and brew log website built with Next.js. It displays recipes, batch history, and competition results imported from Brewfather and BeerSmith brewing software.

## Tech Stack

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- Static export for deployment

## Development

```bash
npm run dev     # Run locally
npm run build   # Build for production (static export to out/)
```

## Architecture

```
app/
├── layout.tsx              # Root layout with nav/footer
├── page.tsx                # Home page (hero + recent brews)
├── globals.css             # Tailwind imports + base styles
├── recipes/
│   ├── page.tsx            # Recipes list with category filtering
│   └── [id]/page.tsx       # Recipe detail (routed by UUID)
└── brews/
    ├── page.tsx            # Brew log list
    └── [id]/page.tsx       # Batch detail (routed by batchNo)

components/
├── Navbar.tsx              # Navigation with active state
├── Footer.tsx              # Site footer
├── RecipeCard.tsx          # Recipe card (shows competition award badges)
├── BrewEntry.tsx           # Brew log entry row
├── RecentBrewCard.tsx      # Compact brew card for home
├── FilterButtons.tsx       # Client component with filter state
├── StatusBadge.tsx         # Colored status indicator
├── ImageLightbox.tsx       # Clickable image with fullscreen lightbox
└── BatchSearch.tsx         # Batch search component

data/
├── recipes.ts              # Recipe data (Brewfather + BeerSmith)
├── batches.ts              # Batch data with brew dates/measurements
├── competitions.ts         # Competition entries, judge scores, awards
├── beersmith-recipes.json  # Raw BeerSmith export
└── brewfather-notes.json   # Brewfather brewing/tasting notes

scripts/
├── sync-brewfather.ts      # Automated Brewfather data sync
├── fetch-brewfather-notes.js
├── add-brewfather-notes.js
├── import-beersmith.js
├── create-beersmith-batches.js
└── parse-beersmith.js

lib/
└── utils.ts                # formatDate, getStatusClasses

types/
└── index.ts                # Recipe, Batch, CompetitionEntry, JudgeScore interfaces

public/images/recipes/      # Recipe artwork (JPG)
```

### Key Files

- **`data/recipes.ts`** - Recipe objects with name, style, category, OG/FG/ABV/IBU, ingredients, artwork paths
- **`data/batches.ts`** - Batch objects from Brewfather and BeerSmith with brew dates and measurements
- **`data/competitions.ts`** - Competition entries with BJCP judge scoresheets, scores, and placements. Also exports `awardWinningRecipes` map for recipe card badges.
- **`tailwind.config.ts`** - Custom colors (dark bg #0d0d0d, accent gold #d4a03c)

### Recipe Categories

Recipes are filtered by category: `ale`, `lager`, `spirit`. Filter buttons on the recipes page toggle between categories.

## Data Flow

Recipe, batch, and competition data are stored as typed TypeScript arrays in the `data/` directory. Components import and render this data directly. Static export means no server-side data fetching.

### Data Sources

- **Brewfather** - Primary source for recent recipes/batches. Synced via `scripts/sync-brewfather.ts` and a GitHub Actions workflow (`.github/workflows/sync-brewfather.yml`). Requires `BREWFATHER_API_USER_ID` and `BREWFATHER_API_KEY` in `.env.local`.
- **BeerSmith** - Legacy recipes/batches imported via scripts in `scripts/`.

### Linking

- **Recipe ↔ Batch**: Linked by case-insensitive name matching (no foreign key). A recipe detail page shows "Brew History" with all matching batches.
- **Batch ↔ Competition**: Linked by `batchNo` field in competition entries. Batch detail pages show competition medals and judge scoresheets.
- **Recipe ↔ Awards**: `awardWinningRecipes` in `competitions.ts` maps recipe names to award badges shown on `RecipeCard`.
