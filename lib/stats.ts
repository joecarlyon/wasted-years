import { Batch, Recipe } from '@/types'
import { recipeParents } from '@/data/lineage'
import { deriveBatchVitals, findMatchingRecipe } from '@/lib/utils'
import { ingredientKey, recipeIngredients } from '@/lib/recipe'
import { recipeFamily } from '@/lib/lineage'

// Build-time aggregates for the /stats page. Everything takes the data as
// arguments so it can be tested without the real brew log.

export interface Count {
  label: string
  count: number
}

// Rum, vodka, and whiskey washes: no hops, no color that means anything, and
// a sugar wash's "efficiency" can top 100%
function isSpirit(batch: Batch, recipe: Recipe | undefined): boolean {
  return batch.category === 'spirit' || recipe?.category === 'spirit'
}

// Every year from the first brew to the last, including the empty ones
export function brewsByYear(batches: Batch[]): {
  years: Count[]
  undated: number
} {
  const dated = batches.filter((b) => b.brewDate)
  const counts = new Map<number, number>()
  for (const b of dated) {
    const year = Number(b.brewDate.slice(0, 4))
    counts.set(year, (counts.get(year) ?? 0) + 1)
  }
  const all = Array.from(counts.keys())
  const years: Count[] = []
  for (let y = Math.min(...all); y <= Math.max(...all); y++)
    years.push({ label: String(y), count: counts.get(y) ?? 0 })
  return { years, undated: batches.length - dated.length }
}

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

export function brewsByMonth(batches: Batch[]): Count[] {
  const counts = MONTHS.map((label) => ({ label, count: 0 }))
  for (const b of batches) {
    if (b.brewDate) counts[Number(b.brewDate.slice(5, 7)) - 1].count += 1
  }
  return counts
}

export interface EfficiencyPoint {
  batchNo: number
  name: string
  brewDate: string
  brew?: number
  mash?: number
}

// Brewhouse and mash efficiency per batch, in brew order
export function efficiencyTrend(
  batches: Batch[],
  recipes: Recipe[]
): EfficiencyPoint[] {
  return batches
    .filter((b) => !isSpirit(b, findMatchingRecipe(b, recipes)))
    .filter((b) => b.efficiency > 0 || b.mashEfficiency)
    .sort((a, b) => a.batchNo - b.batchNo)
    .map((b) => ({
      batchNo: b.batchNo,
      name: b.name,
      brewDate: b.brewDate,
      ...(b.efficiency > 0 && { brew: b.efficiency }),
      ...(b.mashEfficiency && { mash: b.mashEfficiency }),
    }))
}

export interface NamedCount {
  name: string
  count: number
}

// Tally how many batches used each key, labelled with the name most batches
// used for it. Both count once per batch — a recipe listing the same hop for
// boil and dry hop is still one batch.
function tally(perBatch: { key: string; name: string }[][], limit: number) {
  const counts = new Map<
    string,
    { count: number; names: Map<string, number> }
  >()
  for (const items of perBatch) {
    const seen = new Set<string>()
    for (const { key, name } of items) {
      if (seen.has(key)) continue
      seen.add(key)
      const entry = counts.get(key) ?? { count: 0, names: new Map() }
      entry.count += 1
      entry.names.set(name, (entry.names.get(name) ?? 0) + 1)
      counts.set(key, entry)
    }
  }
  return Array.from(counts.values())
    .map(({ count, names }) => ({
      name: Array.from(names).sort((a, b) => b[1] - a[1])[0][0],
      count,
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, limit)
}

// Batches that used each fermentable or hop. A batch without its own
// ingredient list (most BeerSmith imports) uses its recipe's.
export function topIngredients(
  batches: Batch[],
  recipes: Recipe[],
  kind: 'fermentables' | 'hops',
  limit: number
): NamedCount[] {
  const perBatch = batches.map((b) => {
    const own = kind === 'hops' ? b.hops : b.fermentables
    const recipe = findMatchingRecipe(b, recipes)
    const names =
      own.length > 0
        ? own.map((i) => i.name)
        : recipe
          ? recipeIngredients(recipe)[kind].map((i) => i.name)
          : []
    return names.map((name) => ({ key: ingredientKey(name), name }))
  })
  return tally(perBatch, limit)
}

const YEAST_LAB =
  /^(wyeast labs|white labs|dcl\/fermentis|fermentis|omega|imperial|lallemand)\s+/i

// BeerSmith recipes spell yeast as "<lab> <product #> <strain>"; batches
// carry just the strain
export function yeastLabel(name: string): string {
  return name
    .trim()
    .replace(YEAST_LAB, '')
    .replace(/^(wlp)?\d+\s+/i, '')
    .replace(/\s+yeast$/i, '')
}

export function topYeasts(
  batches: Batch[],
  recipes: Recipe[],
  limit: number
): NamedCount[] {
  const perBatch = batches.map((b) => {
    const recipe = findMatchingRecipe(b, recipes)
    const fromRecipe = recipe?.yeastDetail?.name ?? recipe?.yeast
    const names =
      b.yeast.length > 0
        ? b.yeast.map((y) => y.name)
        : fromRecipe && fromRecipe !== 'Not specified'
          ? [fromRecipe]
          : []
    return names.map((n) => {
      const name = yeastLabel(n)
      return { key: name.toLowerCase(), name }
    })
  })
  return tally(perBatch, limit)
}

export interface MostBrewed {
  name: string
  uuid: string // the newest version, to link to
  brews: number
  versions: number
}

// Brews per recipe family (a recipe on its own is a family of one). A family
// goes by the name its versions share, else its original recipe's name.
export function mostBrewed(
  batches: Batch[],
  recipes: Recipe[],
  limit: number,
  parents: Record<string, string> = recipeParents
): MostBrewed[] {
  const families = new Map<string, MostBrewed>()
  for (const b of batches) {
    const recipe = findMatchingRecipe(b, recipes)
    if (!recipe) continue
    const members = recipeFamily(recipe.uuid, recipes, parents).map(
      (m) => m.recipe
    )
    const family = members.length > 0 ? members : [recipe]
    const key = family[0].uuid
    const existing = families.get(key)
    if (existing) {
      existing.brews += 1
      continue
    }
    const newest = [...family].sort(
      (a, b) =>
        (a.brewDate ?? '9999').localeCompare(b.brewDate ?? '9999') ||
        a.name.localeCompare(b.name)
    )[family.length - 1]
    families.set(key, {
      name: familyName(family),
      uuid: newest.uuid,
      brews: 1,
      versions: family.length,
    })
  }
  return Array.from(families.values())
    .sort((a, b) => b.brews - a.brews || a.name.localeCompare(b.name))
    .slice(0, limit)
}

function familyName(members: Recipe[]): string {
  const counts = new Map<string, number>()
  for (const m of members) counts.set(m.name, (counts.get(m.name) ?? 0) + 1)
  const repeated = Array.from(counts).find(([, n]) => n > 1)
  return repeated ? repeated[0] : members[0].name
}

export interface BatchRecord {
  batch: Batch
  value: number
}

// Beer only — the spirit washes would win "strongest" on a technicality
export function beerRecords(batches: Batch[], recipes: Recipe[]) {
  const beers = batches.flatMap((b) => {
    const recipe = findMatchingRecipe(b, recipes)
    return isSpirit(b, recipe)
      ? []
      : [{ batch: b, vitals: deriveBatchVitals(b, recipe) }]
  })
  const best = (value: (x: (typeof beers)[number]) => number | undefined) =>
    beers.reduce<BatchRecord | undefined>((top, x) => {
      const v = value(x)
      return v && (!top || v > top.value) ? { batch: x.batch, value: v } : top
    }, undefined)
  return {
    strongest: best((x) => x.vitals.abv),
    bitterest: best((x) => x.batch.ibu ?? undefined),
    darkest: best((x) => x.vitals.color),
    bestMash: best((x) => x.batch.mashEfficiency),
  }
}
