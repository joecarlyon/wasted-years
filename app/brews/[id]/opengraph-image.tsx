import { batches } from '@/data/batches'
import { recipes } from '@/data/recipes'
import { competitions } from '@/data/competitions'
import { MEDAL_COLORS, medalFor } from '@/lib/competitions'
import { deriveBatchVitals, findMatchingRecipe, formatDate } from '@/lib/utils'
import { ogCard, publicImage } from '@/lib/og'

export const alt = 'Wasted Years Brewing batch'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export function generateStaticParams() {
  return batches.map((b) => ({ id: b.batchNo.toString() }))
}

export default async function Image({ params }: { params: { id: string } }) {
  const batch = batches.find((b) => b.batchNo.toString() === params.id)
  if (!batch) return ogCard({ title: 'Batch not found' })

  const recipe = findMatchingRecipe(batch, recipes)
  const vitals = deriveBatchVitals(batch, recipe)
  const style =
    batch.style && batch.style !== 'Unknown' ? batch.style : recipe?.style
  const placed = competitions
    .filter((c) => c.batchNo === batch.batchNo && medalFor(c.placement))
    .sort((a, b) => b.score - a.score)[0]
  const medal = placed && medalFor(placed.placement)
  // Prefer the recipe's label art, then the batch's own first photo
  const imagePath = recipe?.artwork ?? batch.images?.[0]?.src

  return ogCard({
    eyebrow: `BATCH #${batch.batchNo}${
      batch.brewDate
        ? ` · BREWED ${formatDate(batch.brewDate).toUpperCase()}`
        : ''
    }`,
    title: batch.name,
    subtitle: style,
    stats: [
      ...(vitals.og > 0 ? [{ label: 'OG', value: vitals.og.toFixed(3) }] : []),
      ...(vitals.fg > 0 ? [{ label: 'FG', value: vitals.fg.toFixed(3) }] : []),
      ...(vitals.abv > 0
        ? [{ label: 'ABV', value: `${vitals.abv.toFixed(1)}%` }]
        : []),
      ...(batch.ibu ? [{ label: 'IBU', value: `${batch.ibu}` }] : []),
    ],
    image: imagePath ? await publicImage(imagePath) : undefined,
    medal:
      placed && medal
        ? {
            color: MEDAL_COLORS[medal].color,
            label: `NHC ${placed.year} · ${placed.placement}`,
          }
        : undefined,
  })
}
