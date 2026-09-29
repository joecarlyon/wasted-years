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
npm run dev        # Run locally
npm run build      # Build for production (static export to out/)
npm test           # Node test runner via tsx ({lib,data}/**/*.test.ts)
npm run sync       # Pull recipes/batches from Brewfather (needs .env.local)
npm run add-photo -- <batchNo> <image...> [--caption "text"]  # Add batch photos
```

## Architecture

```
app/
├── layout.tsx              # Root layout with nav/footer; metadataBase + default OG/Twitter metadata
├── page.tsx                # Home page (hero + On Tap + recent brews)
├── globals.css             # Tailwind imports + base styles
├── not-found.tsx           # Custom 404 (exported as 404.html)
├── icon.svg                # Favicon (horned pint)
├── apple-icon.tsx          # Apple touch icon (rendered at build from icon.svg)
├── opengraph-image.tsx     # Default social preview card
├── sitemap.ts / robots.ts  # sitemap.xml + robots.txt
├── recipes/
│   ├── page.tsx            # Recipes list with category filtering
│   └── [id]/
│       ├── page.tsx        # Recipe detail (routed by UUID) with scaler + BeerXML download
│       └── opengraph-image.tsx
├── brews/
│   ├── page.tsx            # Brew log list (supports ?source= and ?filter=competition)
│   └── [id]/
│       ├── page.tsx        # Batch detail (routed by batchNo)
│       └── opengraph-image.tsx
├── competitions/
│   ├── page.tsx            # Medal wall, score vs category average, flaws, all scoresheets
│   └── opengraph-image.tsx
├── stats/
│   ├── page.tsx            # "By the Numbers": brews/year, efficiency trend, most brewed, pantry, records
│   └── opengraph-image.tsx
├── equipment/
│   └── page.tsx            # Equipment setups with specs and gear
└── about/
    └── page.tsx            # Origin story

components/
├── Navbar.tsx              # Navigation with active state (links in NAV_LINKS; hamburger below lg — 7 links don't fit at md)
├── Footer.tsx              # Site footer
├── RecipeCard.tsx          # Recipe card (shows competition award badges)
├── BrewEntry.tsx           # Brew log entry row
├── RecentBrewCard.tsx      # Compact brew card for home
├── FilterButtons.tsx       # Client component with filter state
├── StatusBadge.tsx         # Colored status indicator
├── ImageLightbox.tsx       # Clickable image with fullscreen lightbox
├── BatchSearch.tsx         # Batch search with ?source= filter support
├── LinkifyText.tsx         # Converts URLs in text to clickable links with readable labels
├── FermentationChart.tsx   # Tilt gravity/temperature chart (recharts)
├── OnTap.tsx               # Home "On Tap" section, with a sad empty state
├── DryTap.tsx              # Animated dry tap + sad empty pint (On Tap empty state)
├── SpilledPint.tsx         # Animated knocked-over pint (404 page)
├── DaysSince.tsx           # Client-side "for N days" counter (static pages go stale)
├── JudgeCard.tsx           # One BJCP scoresheet
├── StatTile.tsx            # Headline number tile (competitions, stats)
├── SectionTitle.tsx        # Uppercase section heading with rule
├── EfficiencyChart.tsx     # Mash/brewhouse efficiency by batch (recharts)
├── RecipeIngredients.tsx   # Client: fermentables/hops with batch-size scaling + BeerXML export
└── RecipeLineage.tsx       # Recipe family timeline with scores + "what changed" diff

data/
├── recipes.ts              # Recipe data (Brewfather + BeerSmith)
├── batches.ts              # Batch data with brew dates/measurements (includes mashEfficiency)
├── competitions.ts         # Competition entries, judge scores, placements
├── taps.ts                 # What's on the kegerator (hand-maintained)
├── recipe-links.ts         # Explicit batchNo → recipe UUID links (hand-maintained)
├── lineage.ts              # Recipe UUID → parent recipe UUID (hand-maintained)
├── equipment.ts            # Brewing setup profiles (BrewingSetup[]) with specs and gear
├── beersmith-recipes.json  # Raw BeerSmith export
└── brewfather-notes.json   # Brewfather brewing/tasting notes

scripts/
├── sync-brewfather.ts      # Automated Brewfather data sync
├── add-batch-photo.ts      # Optimize + strip EXIF + register batch photos
├── fetch-brewfather-notes.js
├── add-brewfather-notes.js
├── import-beersmith.js
├── create-beersmith-batches.js
└── parse-beersmith.js

lib/
├── utils.ts                # formatDate, findMatchingRecipe, deriveBatchVitals, getStatusClasses
├── competitions.ts         # medalFor, MEDAL_COLORS, recipeAwards, score/flaw aggregation
├── recipe.ts               # recipeIngredients (detailed or parsed legacy strings), scaling, ingredientKey
├── lineage.ts              # recipeFamily, diffRecipes (version-to-version changes)
├── stats.ts                # /stats aggregates (brews by year/month, efficiency, top ingredients, records)
├── beerxml.ts              # BeerXML 1.0 export
├── og.tsx                  # Shared social preview card renderer (next/og)
└── site.ts                 # SITE_URL, openGraph() metadata helper

assets/fonts/               # Inter TTFs for social cards (next/og can't read woff2)

types/
└── index.ts                # Recipe, Batch, BrewingSetup, CompetitionEntry, JudgeScore interfaces

public/images/recipes/      # Recipe artwork (JPG, metadata stripped)
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

Batches can carry an optional `images?: BatchImage[]` where each `BatchImage` is `{ src: string; caption?: string }` (paths under `public/`). The brew detail page renders them as a "Photos" gallery via `ImageLightbox`, with captions shown below each thumbnail. To add a photo:

```bash
npm run add-photo -- 104 ~/Desktop/IMG_1234.HEIC --caption "First time cold crashing"
npm run add-photo -- 104 photo1.jpg photo2.jpg   # several at once, no captions
```

The script resizes to max 1600px on the long edge at ~80% JPEG quality, **strips all metadata** (phone photos carry GPS coordinates), writes `public/images/batches/<batchNo>/NN.jpg`, and appends to the batch's `images` in `data/batches.ts`. Needs macOS `sips` and `ffmpeg`. Any image committed by hand (including recipe artwork) must get the same treatment:

```bash
sips -Z 1600 -s format jpeg -s formatOptions 80 input.jpg --out /tmp/resized.jpg
ffmpeg -y -i /tmp/resized.jpg -map_metadata -1 -q:v 3 output.jpg
```

`mergeBatch` in `scripts/sync-brewfather.ts` preserves `existing.images` since Brewfather payloads don't include this field — don't remove that preservation or sync will clobber manual photo additions.

### Recipe Lineage

`data/lineage.ts` maps a recipe's UUID to the UUID of the version it evolved from. Recipe pages in a family get a "Lineage" section: every version (parents before children, siblings by date) with ABV/IBU, brew count, and competition scores, plus "What changed from <parent>" — vitals, grain bill as % of grist, hops in oz compared at the newer batch size (so a 10→5 gal rescale isn't a change), yeast, and water. Diffs match ingredients by `ingredientKey` in `lib/recipe.ts`, which treats BeerSmith and Brewfather names for the same thing as equal ("Pale Malt (2 Row) US" = "Pale Ale Malt 2-Row"); add to `INGREDIENT_ALIASES` when a rename shows up as a remove + add.

### By the Numbers (`/stats`)

Everything is computed at build time by `lib/stats.ts` from the data files. Spirit washes (batch or recipe `category: 'spirit'`) are left out of the efficiency trend and beer records — a sugar wash logs >100% efficiency. "Most brewed" counts a whole lineage family together. Ingredient and yeast counts fall back to the linked recipe's list for batches without their own, matching names via `ingredientKey` and `yeastLabel`. The efficiency chart's two colors were checked as a pair against the card surface; keep that pair if you restyle it.

### On Tap

`data/taps.ts` lists kegs by `batchNo`. An entry without `kicked` is pouring (`tapped` defaults to the batch's kegged date); set `kicked: 'YYYY-MM-DD'` when it runs dry. With nothing pouring, the home page shows a dry tap over a sad empty pint, the most recently kicked keg, and anything Fermenting/Conditioning.

### Social Preview Images

Each `opengraph-image.tsx` renders a 1200×630 PNG at build time via `ogCard` in `lib/og.tsx`. Static export writes them without a file extension, so `vercel.json` sets `Content-Type: image/png` for them (and `apple-icon`). Dynamic ones need their own `generateStaticParams`. Pages that set `openGraph` metadata must use `openGraph()` from `lib/site.ts` — a page's `openGraph` replaces the layout's rather than merging.

## Data Flow

Recipe, batch, and competition data are stored as typed TypeScript arrays in the `data/` directory. Components import and render this data directly. Static export means no server-side data fetching.

### Data Sources

- **Brewfather** - Primary source for recipes/batches from 2020 onward (Electric Brewing / Anvil setup). Synced via `scripts/sync-brewfather.ts` and a GitHub Actions workflow (`.github/workflows/sync-brewfather.yml`). Requires `BREWFATHER_USER_ID` and `BREWFATHER_API_KEY` in `.env.local`. Sync calculates `mashEfficiency` from pre-boil gravity/volume data when available.
  - **Don't add `include=` to the batches request.** `complete=true` already returns every field; an `include=` list acts as a whitelist and silently drops measured gravities, style, and the recipe's ingredients.
  - **Tilt readings are capped at the next brewed batch's brew date.** There's one Tilt; Brewfather keeps logging to whichever batch it's assigned to, so readings after the next brew day are really the new wort. The first reading only counts as OG if it's within 2 days of brew day.
- **BeerSmith** - Legacy recipes/batches from pre-2020 (Caveman Fire setup). Imported via scripts in `scripts/`.

### Linking

- **Recipe ↔ Batch**: Linked via `findMatchingRecipe` (no foreign key — Brewfather's batch payload has no source-recipe ID). An entry in `data/recipe-links.ts` (batchNo → recipe UUID) wins; add one when a batch's name doesn't match its recipe's (typos, renames). `data/data.test.ts` fails if a link points at a UUID that no longer exists. Otherwise a batch matches a recipe with the same name, or one its name _extends_ at a word boundary ("Zombie Dust London" → "Zombie Dust"); the longest match wins, then same `source`. The recipe page's "Brew History" lists batches that resolve to it, so it always agrees with each batch page's recipe link.
- **Batch ↔ Competition**: Linked by `batchNo` field in competition entries (each also has a `year`). Batch detail pages and `/competitions` show medals and judge scoresheets.
- **Recipe ↔ Awards**: Derived, not hand-maintained — `recipeAwards` in `lib/competitions.ts` follows each placing entry's batch to its recipe. The recipes page computes it server-side and passes it to `RecipeCard` (inside the client `FilterButtons`) so the brew log isn't shipped to the browser.
- **Batch ↔ Equipment**: Linked by `source` field (`brewfather` → Electric Brewing, `beersmith` → Caveman Fire). Equipment page links to `/brews?source=` for filtered brew log views.
