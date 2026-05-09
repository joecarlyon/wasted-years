import { Batch, Fermentable, Hop, Recipe } from '@/types'

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function findMatchingRecipe(
  batch: Pick<Batch, 'name'>,
  recipes: Recipe[]
): Recipe | undefined {
  const batchLower = batch.name.toLowerCase()
  const exact = recipes.find((r) => r.name.toLowerCase() === batchLower)
  if (exact) return exact
  return recipes.find((r) => {
    const recipeLower = r.name.toLowerCase()
    return (
      batchLower.startsWith(recipeLower) || recipeLower.startsWith(batchLower)
    )
  })
}

// Fall back to the recipe's structured ingredients when the batch's
// own ingredient lists are empty.
export function deriveBatchIngredients(
  batch: Pick<Batch, 'fermentables' | 'hops'>,
  recipe: Recipe | undefined
): { fermentables: Fermentable[]; hops: Hop[] } {
  const fermentables =
    batch.fermentables.length > 0
      ? batch.fermentables
      : (recipe?.fermentablesDetail ?? []).map((f) => ({
          name: f.name,
          amount: f.amount,
        }))
  const hops =
    batch.hops.length > 0
      ? batch.hops
      : (recipe?.hopsDetail ?? []).map((h) => ({
          name: h.name,
          amount: h.amount,
          usage: h.use || 'Boil',
          ...(h.time !== undefined && { time: h.time }),
        }))
  return { fermentables, hops }
}

// Falls back to the recipe target when a batch field is unset (0).
// ABV is computed from the resolved OG/FG when both are available so a
// recipe-FG fallback combined with a measured OG produces a sensible number.
export function deriveBatchVitals(
  batch: Pick<Batch, 'og' | 'fg' | 'abv'>,
  recipe: Pick<Recipe, 'og' | 'fg' | 'abv'> | undefined
): { og: number; fg: number; abv: number } {
  const og = batch.og > 0 ? batch.og : (recipe?.og ?? 0)
  const fg = batch.fg > 0 ? batch.fg : (recipe?.fg ?? 0)
  let abv = batch.abv
  if (!(abv > 0)) {
    abv =
      og > 0 && fg > 0
        ? Math.round((og - fg) * 131.25 * 10) / 10
        : (recipe?.abv ?? 0)
  }
  return { og, fg, abv }
}

export function getStatusClasses(status: string): string {
  const baseClasses =
    'inline-block px-3 py-1 text-xs font-medium uppercase tracking-wide rounded-full'

  switch (status.toLowerCase()) {
    case 'completed':
      return `${baseClasses} bg-status-success text-text-primary`
    case 'fermenting':
      return `${baseClasses} bg-lavender-dark text-bg-dark`
    case 'conditioning':
      return `${baseClasses} bg-lavender text-bg-dark`
    case 'planning':
      return `${baseClasses} bg-accent text-bg-dark`
    default:
      return `${baseClasses} bg-border text-text-secondary`
  }
}
