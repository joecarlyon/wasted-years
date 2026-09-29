import { Recipe, WaterProfile } from '@/types'
import { recipeParents } from '@/data/lineage'
import { ingredientKey, recipeIngredients } from '@/lib/recipe'

export interface FamilyMember {
  recipe: Recipe
  parent?: Recipe
}

// Undated recipes are the newest Brewfather ones, so they sort last
function byBrewDate(a: Recipe, b: Recipe): number {
  const ad = a.brewDate ?? '9999'
  const bd = b.brewDate ?? '9999'
  return ad.localeCompare(bd) || a.name.localeCompare(b.name)
}

// Every recipe related to `uuid` through `recipeParents`, parents before
// children and siblings by date. Old BeerSmith versions often share their
// parent's date, so a plain date sort could list a child first. Empty when
// the recipe has no parent and no children.
export function recipeFamily(
  uuid: string,
  recipes: Recipe[],
  parents: Record<string, string> = recipeParents
): FamilyMember[] {
  const byUuid = new Map(recipes.map((r) => [r.uuid, r]))
  const parentOf = (r: Recipe) => byUuid.get(parents[r.uuid] ?? '')

  const start = byUuid.get(uuid)
  if (!start) return []
  let root = start
  const climbed = new Set([root.uuid])
  for (let p = parentOf(root); p && !climbed.has(p.uuid); p = parentOf(p)) {
    climbed.add(p.uuid)
    root = p
  }

  const members: FamilyMember[] = []
  const seen = new Set<string>()
  const visit = (r: Recipe) => {
    if (seen.has(r.uuid)) return
    seen.add(r.uuid)
    members.push({ recipe: r, parent: r === root ? undefined : parentOf(r) })
    recipes
      .filter((c) => parents[c.uuid] === r.uuid)
      .sort(byBrewDate)
      .forEach(visit)
  }
  visit(root)
  return members.length > 1 ? members : []
}

// `from` is undefined for an addition, `to` for a removal
export interface AmountChange {
  name: string
  from?: number
  to?: number
}

export interface RecipeDiff {
  // Set when the batch sizes differ: hop amounts are compared at this size
  scaledTo?: number
  vitals: { label: string; from: string; to: string }[]
  fermentables: AmountChange[] // % of the grist
  hops: AmountChange[] // oz, grouped by hop and use
  yeast?: { from: string; to: string }
  water: { label: string; from: number; to: number }[]
}

const round = (n: number, places: number) =>
  Math.round(n * 10 ** places) / 10 ** places

// Walks `from` for changes and removals, then `to` for additions
function diffAmounts(
  from: Map<string, { name: string; amount: number }>,
  to: Map<string, { name: string; amount: number }>,
  threshold: number,
  places: number
): AmountChange[] {
  const changes: AmountChange[] = []
  from.forEach((f, key) => {
    const t = to.get(key)
    if (!t) changes.push({ name: f.name, from: round(f.amount, places) })
    else if (Math.abs(t.amount - f.amount) >= threshold)
      changes.push({
        name: t.name,
        from: round(f.amount, places),
        to: round(t.amount, places),
      })
  })
  to.forEach((t, key) => {
    if (!from.has(key))
      changes.push({ name: t.name, to: round(t.amount, places) })
  })
  return changes
}

function grist(recipe: Recipe) {
  const totals = new Map<string, { name: string; amount: number }>()
  for (const f of recipeIngredients(recipe).fermentables) {
    const key = ingredientKey(f.name)
    const prev = totals.get(key)?.amount ?? 0
    totals.set(key, { name: f.name, amount: prev + (f.percentage ?? 0) })
  }
  return totals
}

function hopTotals(recipe: Recipe, scale: number) {
  const totals = new Map<string, { name: string; amount: number }>()
  for (const h of recipeIngredients(recipe).hops) {
    const key = `${ingredientKey(h.name)}|${h.use.toLowerCase()}`
    const prev = totals.get(key)?.amount ?? 0
    totals.set(key, {
      name: `${h.name} (${h.use})`,
      amount: prev + h.amount * scale,
    })
  }
  return totals
}

const yeastName = (r: Recipe) => r.yeastDetail?.name ?? r.yeast

// BeerSmith prefixes the lab and product number ("Wyeast Labs 1010 American
// Wheat Ale") where Brewfather has just the strain ("American Wheat")
function sameYeast(a: string, b: string): boolean {
  const x = a.trim().toLowerCase()
  const y = b.trim().toLowerCase()
  return x.includes(y) || y.includes(x)
}

const WATER_IONS: [keyof WaterProfile, string][] = [
  ['calcium', 'Ca'],
  ['magnesium', 'Mg'],
  ['sodium', 'Na'],
  ['chloride', 'Cl'],
  ['sulfate', 'SO4'],
  ['bicarbonate', 'HCO3'],
]

// What changed from one version of a recipe to the next. Grain bills compare
// as percentages and hops at the newer batch size, so rescaling a 10 gal
// recipe to 5 gal doesn't show up as every ingredient changing.
export function diffRecipes(from: Recipe, to: Recipe): RecipeDiff {
  const resized =
    !!from.batchSize && !!to.batchSize && from.batchSize !== to.batchSize
  const scale = resized ? to.batchSize! / from.batchSize! : 1

  const vitals: RecipeDiff['vitals'] = []
  const vital = (label: string, a: string, b: string) => {
    if (a !== b) vitals.push({ label, from: a, to: b })
  }
  vital('OG', from.og.toFixed(3), to.og.toFixed(3))
  vital('FG', from.fg.toFixed(3), to.fg.toFixed(3))
  vital('ABV', `${from.abv.toFixed(1)}%`, `${to.abv.toFixed(1)}%`)
  vital('IBU', String(Math.round(from.ibu)), String(Math.round(to.ibu)))
  if (from.color !== undefined && to.color !== undefined)
    vital('SRM', String(Math.round(from.color)), String(Math.round(to.color)))
  if (resized) vital('Batch', `${from.batchSize} gal`, `${to.batchSize} gal`)

  const yeast = sameYeast(yeastName(from), yeastName(to))
    ? undefined
    : { from: yeastName(from), to: yeastName(to) }

  const water: RecipeDiff['water'] = []
  if (from.waterProfile && to.waterProfile) {
    for (const [ion, label] of WATER_IONS) {
      const a = from.waterProfile[ion]
      const b = to.waterProfile[ion]
      if (a !== undefined && b !== undefined && Math.abs(a - b) >= 1)
        water.push({ label, from: Math.round(a), to: Math.round(b) })
    }
  }

  return {
    ...(resized && { scaledTo: to.batchSize }),
    vitals,
    fermentables: diffAmounts(grist(from), grist(to), 0.5, 1),
    hops: diffAmounts(hopTotals(from, scale), hopTotals(to, 1), 0.05, 2),
    yeast,
    water,
  }
}
