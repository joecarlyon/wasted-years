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
├── brews/
│   ├── page.tsx            # Brew log list (supports ?source= filtering)
│   └── [id]/page.tsx       # Batch detail (routed by batchNo)
└── equipment/
    └── page.tsx            # Equipment setups with specs and gear

components/
├── Navbar.tsx              # Navigation with active state
├── Footer.tsx              # Site footer
├── RecipeCard.tsx          # Recipe card (shows competition award badges)
├── BrewEntry.tsx           # Brew log entry row
├── RecentBrewCard.tsx      # Compact brew card for home
├── FilterButtons.tsx       # Client component with filter state
├── StatusBadge.tsx         # Colored status indicator
├── ImageLightbox.tsx       # Clickable image with fullscreen lightbox
├── BatchSearch.tsx         # Batch search with ?source= filter support
└── LinkifyText.tsx         # Converts URLs in text to clickable links with readable labels

data/
├── recipes.ts              # Recipe data (Brewfather + BeerSmith)
├── batches.ts              # Batch data with brew dates/measurements (includes mashEfficiency)
├── competitions.ts         # Competition entries, judge scores, awards
├── equipment.ts            # Brewing setup profiles (BrewingSetup[]) with specs and gear
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
└── index.ts                # Recipe, Batch, BrewingSetup, CompetitionEntry, JudgeScore interfaces

public/images/recipes/      # Recipe artwork (JPG)
public/images/batches/<batchNo>/  # Per-batch photo galleries (JPG)
```

### Key Files

- **`data/recipes.ts`** - Recipe objects with name, style, category, OG/FG/ABV/IBU, ingredients, artwork paths
- **`data/batches.ts`** - Batch objects from Brewfather and BeerSmith with brew dates, measurements, and optional `mashEfficiency`
- **`data/equipment.ts`** - Brewing setup profiles with equipment lists and specs (brew/mash efficiency, batch size, etc.)
- **`data/competitions.ts`** - Competition entries with BJCP judge scoresheets, scores, and placements. Also exports `awardWinningRecipes` map for recipe card badges.
- **`tailwind.config.ts`** - Custom colors (dark bg #0d0d0d, accent gold #d4a03c)

### Recipe Categories

Recipes are filtered by category: `ale`, `lager`, `spirit`. Filter buttons on the recipes page toggle between categories.

### Batch Photos

Batches can carry an optional `images?: string[]` (paths under `public/`). The brew detail page renders them as a "Photos" gallery via `ImageLightbox`. To add a photo:

1. Drop the source image and optimize it for web — target max 1600px on the long edge, ~80% JPEG quality, **and strip EXIF** (phone photos carry GPS coordinates):
   ```bash
   sips -Z 1600 -s format jpeg -s formatOptions 80 input.jpg --out /tmp/resized.jpg
   ffmpeg -y -i /tmp/resized.jpg -map_metadata -1 -q:v 3 public/images/batches/<batchNo>/<n>.jpg
   ```
2. Add the path to the batch's `images` array in `data/batches.ts`.

`mergeBatch` in `scripts/sync-brewfather.ts` preserves `existing.images` since Brewfather payloads don't include this field — don't remove that preservation or sync will clobber manual photo additions.

## Data Flow

Recipe, batch, and competition data are stored as typed TypeScript arrays in the `data/` directory. Components import and render this data directly. Static export means no server-side data fetching.

### Data Sources

- **Brewfather** - Primary source for recipes/batches from 2020 onward (Electric Brewing / Anvil setup). Synced via `scripts/sync-brewfather.ts` and a GitHub Actions workflow (`.github/workflows/sync-brewfather.yml`). Requires `BREWFATHER_API_USER_ID` and `BREWFATHER_API_KEY` in `.env.local`. Sync calculates `mashEfficiency` from pre-boil gravity/volume data when available.
- **BeerSmith** - Legacy recipes/batches from pre-2020 (Caveman Fire setup). Imported via scripts in `scripts/`.

### Linking

- **Recipe ↔ Batch**: Linked by case-insensitive name matching (no foreign key). A recipe detail page shows "Brew History" with all matching batches.
- **Batch ↔ Competition**: Linked by `batchNo` field in competition entries. Batch detail pages show competition medals and judge scoresheets.
- **Recipe ↔ Awards**: `awardWinningRecipes` in `competitions.ts` maps recipe names to award badges shown on `RecipeCard`.
- **Batch ↔ Equipment**: Linked by `source` field (`brewfather` → Electric Brewing, `beersmith` → Caveman Fire). Equipment page links to `/brews?source=` for filtered brew log views.
