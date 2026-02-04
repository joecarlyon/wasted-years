# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Wasted Years is a static homebrewing recipe and brew log website built with Next.js. It displays recipes and batch history imported from Brewfather brewing software.

## Tech Stack

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- Static export for deployment

## Development

**Run locally:**

```bash
npm run dev
```

**Build for production:**

```bash
npm run build
```

## Architecture

```
app/
├── layout.tsx          # Root layout with nav/footer
├── page.tsx            # Home page (hero + recent brews)
├── globals.css         # Tailwind imports + base styles
├── recipes/
│   └── page.tsx        # Recipes page with filtering
└── brews/
    └── page.tsx        # Brew log page

components/
├── Navbar.tsx          # Navigation with active state
├── Footer.tsx          # Site footer
├── RecipeCard.tsx      # Recipe display card
├── BrewEntry.tsx       # Brew log entry
├── RecentBrewCard.tsx  # Compact brew card for home
├── FilterButtons.tsx   # Client component with filter state
└── StatusBadge.tsx     # Colored status indicator

data/
├── recipes.ts          # Recipe data with types
└── batches.ts          # Batch data with types

lib/
└── utils.ts            # formatDate, getStatusClasses

types/
└── index.ts            # Recipe, Batch interfaces
```

### Key Files

- **`data/recipes.ts`** - Recipe objects with name, style, category, OG/FG/ABV/IBU, ingredients
- **`data/batches.ts`** - Batch objects exported from Brewfather with brew dates and measurements
- **`tailwind.config.ts`** - Custom colors (dark bg #0d0d0d, accent gold #d4a03c)

### Recipe Categories

Recipes are filtered by category: `ale`, `lager`, `spirit`. Filter buttons on the recipes page toggle between categories.

## Data Flow

Recipe and batch data are stored as typed TypeScript arrays in the `data/` directory. Components import and render this data directly. Static export means no server-side data fetching.
