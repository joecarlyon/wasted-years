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

// BeerSmith and Brewfather name the same ingredient differently ("Pale Malt
// (2 Row) US" vs "Pale Ale Malt 2-Row", "Amarillo Gold" vs "Amarillo").
// Normalizing strips supplier tags, the word "malt", and punctuation; these
// cover what's left. Genuinely different ingredients (German wheat vs US
// white wheat, Munich I vs II) keep separate keys.
const INGREDIENT_ALIASES: Record<string, string> = {
  'pale 2 row us': 'pale 2 row',
  'pale ale 2 row': 'pale 2 row',
  'brewers 2 row': 'pale 2 row',
  'organic 2row pale': 'pale 2 row',
  'cara pils dextrine': 'carapils',
  'carapils dextrine us': 'carapils',
  'flaked barley': 'barley flaked',
  'white wheat': 'wheat white',
  melanoiden: 'melanoidin',
  'victory biscuit': 'victory',
  acid: 'acidulated',
  'pilsner 2 row': 'pilsner',
  pilsen: 'pilsner',
  'pilsen 2 row': 'pilsner',
  'finest maris otter ale': 'maris otter',
  'pale ale finest maris otter': 'maris otter',
  'pale maris otter': 'maris otter',
  'amarillo gold': 'amarillo',
  'goldings east kent': 'east kent goldings',
  hallertauer: 'hallertau',
  fuggles: 'fuggle',
  'german hull melon': 'huell melon',
}

const SUPPLIER_TAG =
  /\((briess|cargill|weyermann|rahr|simpsons|crisp|proximity|ekg|tomahawk)\)/g

// A key that's equal for every name of the same fermentable or hop
export function ingredientKey(name: string): string {
  const normalized = name
    .toLowerCase()
    .replace(/[®™]/g, '')
    .replace(SUPPLIER_TAG, '')
    .replace('caramel/crystal', 'caramel')
    .replace(/\bmalt\b/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/^crystal (\d+l)$/, 'caramel $1')
  return INGREDIENT_ALIASES[normalized] ?? normalized
}

export function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'recipe'
  )
}
