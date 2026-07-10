import { Batch, Fermentable, Hop, Recipe, TiltReading } from '@/types'

// A Tilt hydrometer can spike wildly when the sensor ends up sitting in a pile
// of yeast — e.g. while draining the fermenter — reporting gravities far above
// the original gravity, which is physically impossible for fermenting beer.
// Anything above OG (plus a little sensor-noise slack) is such an artifact.
const GRAVITY_SPIKE_TOLERANCE = 0.01

/**
 * Drop Tilt readings whose gravity spikes above the original gravity. Beer
 * gravity only ever falls during and after fermentation, so a reading above OG
 * is a sensor artifact (yeast pile, jostling) and should be ignored entirely.
 * When `og` is unknown, the first reading is used as the baseline.
 */
export function sanitizeTiltReadings(
  readings: TiltReading[],
  og?: number
): TiltReading[] {
  const baseline =
    og && og > 0 ? og : readings.length > 0 ? readings[0].gravity : 0
  if (!(baseline > 0)) return readings
  const ceiling = baseline + GRAVITY_SPIKE_TOLERANCE
  return readings.filter((r) => r.gravity <= ceiling)
}

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
// Color/efficiency fall back to the recipe; efficiency further falls back
// to the brewing setup's default brew efficiency when supplied.
export function deriveBatchVitals(
  batch: Pick<Batch, 'og' | 'fg' | 'abv' | 'color' | 'efficiency'> & {
    tiltReadings?: TiltReading[]
  },
  recipe:
    | Pick<Recipe, 'og' | 'fg' | 'abv' | 'color' | 'equipmentProfile'>
    | undefined,
  options?: { defaultEfficiency?: number }
): {
  og: number
  fg: number
  abv: number
  color: number
  efficiency: number
} {
  const og = batch.og > 0 ? batch.og : (recipe?.og ?? 0)
  let fg = batch.fg > 0 ? batch.fg : (recipe?.fg ?? 0)
  // A stored FG above OG is physically impossible — it means the Tilt spiked
  // (sensor sitting in yeast). Prefer the plateau of the de-spiked readings,
  // then fall back to the recipe estimate.
  if (og > 0 && fg > og) {
    const clean = sanitizeTiltReadings(batch.tiltReadings ?? [], og)
    fg = clean.length > 0 ? clean[clean.length - 1].gravity : (recipe?.fg ?? 0)
  }
  let abv = batch.abv
  if (!(abv > 0)) {
    abv =
      og > 0 && fg > 0
        ? Math.round((og - fg) * 131.25 * 10) / 10
        : (recipe?.abv ?? 0)
  }
  const color = batch.color > 0 ? batch.color : (recipe?.color ?? 0)
  const efficiency =
    batch.efficiency > 0
      ? batch.efficiency
      : (recipe?.equipmentProfile?.efficiency ??
        options?.defaultEfficiency ??
        0)
  return { og, fg, abv, color, efficiency }
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
