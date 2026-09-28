import { batches } from '@/data/batches'
import { recipes } from '@/data/recipes'
import { competitions } from '@/data/competitions'
import { medalFor } from '@/lib/competitions'
import { ogCard } from '@/lib/og'

export const alt = 'Wasted Years Brewing — Craft Beer. Heavy Metal.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const medals = competitions.filter((c) => medalFor(c.placement)).length
  return ogCard({
    eyebrow: 'HOMEBREW RECIPES & BREW LOG',
    title: 'Craft Beer. Heavy Metal.',
    subtitle: 'Recipes born in fire',
    stats: [
      { label: 'BATCHES', value: batches.length.toString() },
      { label: 'RECIPES', value: recipes.length.toString() },
      { label: 'MEDALS', value: medals.toString() },
    ],
  })
}
