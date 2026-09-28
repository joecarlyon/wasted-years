import { Recipe, RecipeFermentable, RecipeHop } from '@/types'

export interface RecipeIngredients {
  fermentables: RecipeFermentable[] // amounts in lb
  hops: RecipeHop[] // amounts in oz
}

// Legacy BeerSmith recipes only carry display strings:
//   "13.00 lb Brewers Malt 2-Row (Briess)"
//   "1.0 oz Columbus (Tomahawk) (Dry Hop)"  ← the use is the last parenthetical
const GRAIN_RE = /^(\d+(?:\.\d+)?) lb (.+)$/
const HOP_RE = /^(\d+(?:\.\d+)?) oz (.+) \(([^()]+)\)$/

// One structured ingredient list for every recipe: the detailed Brewfather
// fields when present, otherwise parsed from the legacy display strings.
// Grain-bill percentages are filled in when the source doesn't have them.
export function recipeIngredients(
  recipe: Pick<Recipe, 'grains' | 'hops' | 'fermentablesDetail' | 'hopsDetail'>
): RecipeIngredients {
  const fermentables: RecipeFermentable[] = recipe.fermentablesDetail?.length
    ? recipe.fermentablesDetail
    : recipe.grains.flatMap((g) => {
        const m = g.match(GRAIN_RE)
        return m ? [{ name: m[2], amount: parseFloat(m[1]) }] : []
      })

  const total = fermentables.reduce((sum, f) => sum + f.amount, 0)
  const withPercentages = fermentables.map((f) => ({
    ...f,
    percentage:
      f.percentage ?? (total > 0 ? (f.amount / total) * 100 : undefined),
  }))

  const hops: RecipeHop[] = recipe.hopsDetail?.length
    ? recipe.hopsDetail
    : recipe.hops.flatMap((h) => {
        const m = h.match(HOP_RE)
        return m ? [{ name: m[2], amount: parseFloat(m[1]), use: m[3] }] : []
      })

  return { fermentables: withPercentages, hops }
}

// Linear scaling by batch volume. Percentages, times, and alpha acids don't
// change; IBU and OG hold as long as the brewhouse efficiency does.
export function scaleIngredients(
  ingredients: RecipeIngredients,
  factor: number
): RecipeIngredients {
  return {
    fermentables: ingredients.fermentables.map((f) => ({
      ...f,
      amount: f.amount * factor,
    })),
    hops: ingredients.hops.map((h) => ({ ...h, amount: h.amount * factor })),
  }
}

export function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'recipe'
  )
}
