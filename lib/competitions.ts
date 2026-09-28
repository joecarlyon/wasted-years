import { CompetitionEntry, JudgeScore } from '@/types'

export type Medal = 'gold' | 'silver' | 'bronze'

export const MEDAL_COLORS: Record<Medal, { color: string; bg: string }> = {
  gold: { color: '#FFD700', bg: 'rgba(255,215,0,0.15)' },
  silver: { color: '#C0C0C0', bg: 'rgba(192,192,192,0.15)' },
  bronze: { color: '#CD7F32', bg: 'rgba(205,127,50,0.15)' },
}

// Five-point star used for medal badges
export const STAR_PATH =
  'M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z'

// Placements are free text ("Mini B.O.S. (Silver)"); the medal is whichever
// metal the text names.
export function medalFor(placement: string | undefined): Medal | null {
  const p = placement?.toLowerCase() ?? ''
  if (p.includes('gold')) return 'gold'
  if (p.includes('silver')) return 'silver'
  if (p.includes('bronze')) return 'bronze'
  return null
}

export const SCORE_CATEGORIES = [
  'aroma',
  'appearance',
  'flavor',
  'mouthfeel',
  'overall',
] as const

// Average share of available points each scoresheet category earned, across
// every judge on every entry — where points are won and lost.
export function categoryAverages(entries: CompetitionEntry[]) {
  const judges = entries.flatMap((e) => e.judges)
  return SCORE_CATEGORIES.map((category) => {
    const earned = judges.reduce((sum, j) => sum + j.scores[category][0], 0)
    const possible = judges.reduce((sum, j) => sum + j.scores[category][1], 0)
    const max = judges[0]?.scores[category][1] ?? 0
    return {
      category,
      average: judges.length > 0 ? earned / judges.length : 0,
      max,
      share: possible > 0 ? earned / possible : 0,
    }
  })
}

// Judges write flaws as "Oxidized (M), Astringent (L)". Tally how often each
// one shows up and how intense it was each time.
export function flawTally(entries: CompetitionEntry[]) {
  const tally = new Map<string, { count: number; intensities: string[] }>()
  const judges: JudgeScore[] = entries.flatMap((e) => e.judges)
  for (const judge of judges) {
    for (const raw of judge.flaws?.split(',') ?? []) {
      const match = raw.trim().match(/^(.+?)\s*(?:\((\w+)\))?$/)
      if (!match || !match[1]) continue
      const name = match[1]
      const entry = tally.get(name) ?? { count: 0, intensities: [] }
      entry.count += 1
      if (match[2]) entry.intensities.push(match[2])
      tally.set(name, entry)
    }
  }
  return Array.from(tally, ([name, v]) => ({ name, ...v })).sort(
    (a, b) => b.count - a.count || a.name.localeCompare(b.name)
  )
}
