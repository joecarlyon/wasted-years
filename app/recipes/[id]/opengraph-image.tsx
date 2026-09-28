import { recipes } from '@/data/recipes'
import { batches } from '@/data/batches'
import { competitions } from '@/data/competitions'
import { MEDAL_COLORS, medalFor } from '@/lib/competitions'
import { findMatchingRecipe } from '@/lib/utils'
import { ogCard, publicImage } from '@/lib/og'

export const alt = 'Wasted Years Brewing recipe'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export function generateStaticParams() {
  return recipes.map((r) => ({ id: r.uuid }))
}

export default async function Image({ params }: { params: { id: string } }) {
  const recipe = recipes.find((r) => r.uuid === params.id)
  if (!recipe) return ogCard({ title: 'Recipe not found' })

  // Best finish by any batch brewed from this recipe
  const batchNos = new Set(
    batches
      .filter((b) => findMatchingRecipe(b, recipes)?.uuid === recipe.uuid)
      .map((b) => b.batchNo)
  )
  const placed = competitions
    .filter((c) => batchNos.has(c.batchNo) && medalFor(c.placement))
    .sort((a, b) => b.score - a.score)[0]
  const medal = placed && medalFor(placed.placement)

  return ogCard({
    eyebrow: 'RECIPE',
    title: recipe.name,
    subtitle: recipe.style,
    stats: [
      ...(recipe.og > 0 ? [{ label: 'OG', value: recipe.og.toFixed(3) }] : []),
      ...(recipe.abv > 0
        ? [{ label: 'ABV', value: `${recipe.abv.toFixed(1)}%` }]
        : []),
      ...(recipe.ibu > 0 ? [{ label: 'IBU', value: `${recipe.ibu}` }] : []),
      ...(recipe.batchSize
        ? [{ label: 'BATCH', value: `${recipe.batchSize} gal` }]
        : []),
    ],
    image: recipe.artwork ? await publicImage(recipe.artwork) : undefined,
    medal:
      placed && medal
        ? {
            color: MEDAL_COLORS[medal].color,
            label: `NHC ${placed.year} · ${placed.placement}`,
          }
        : undefined,
  })
}
