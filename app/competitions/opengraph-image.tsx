import { competitions } from '@/data/competitions'
import { medalFor } from '@/lib/competitions'
import { ogCard } from '@/lib/og'

export const alt = 'Wasted Years Brewing competition results'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const medals = competitions.filter((c) => medalFor(c.placement)).length
  const avg =
    competitions.reduce((sum, c) => sum + c.score, 0) / competitions.length
  const best = Math.max(...competitions.map((c) => c.score))
  return ogCard({
    eyebrow: 'COMPETITIONS',
    title: 'Every entry. Every scoresheet.',
    subtitle: 'National Homebrew Competition',
    stats: [
      { label: 'ENTRIES', value: competitions.length.toString() },
      { label: 'MEDALS', value: medals.toString() },
      { label: 'AVG SCORE', value: avg.toFixed(1) },
      { label: 'BEST', value: best.toString() },
    ],
  })
}
