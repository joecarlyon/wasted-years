import { batches } from '@/data/batches'
import { recipes } from '@/data/recipes'
import { mostBrewed } from '@/lib/stats'
import { ogCard } from '@/lib/og'

export const alt = 'Wasted Years Brewing by the numbers'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const gallons = batches.reduce((sum, b) => sum + (b.batchSize || 0), 0)
  const favorite = mostBrewed(batches, recipes, 1)[0]
  return ogCard({
    eyebrow: 'BY THE NUMBERS',
    title: 'Every batch, counted.',
    subtitle: favorite
      ? `Most brewed: ${favorite.name}, ${favorite.brews} times`
      : undefined,
    stats: [
      { label: 'BATCHES', value: batches.length.toString() },
      { label: 'GALLONS', value: Math.round(gallons).toLocaleString() },
      { label: 'RECIPES', value: recipes.length.toString() },
    ],
  })
}
