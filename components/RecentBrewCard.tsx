import Link from 'next/link'
import { Batch } from '@/types'
import { competitions } from '@/data/competitions'
import { recipes } from '@/data/recipes'
import { formatDate, findMatchingRecipe, deriveBatchVitals } from '@/lib/utils'
import { MEDAL_COLORS, STAR_PATH, medalFor } from '@/lib/competitions'

interface RecentBrewCardProps {
  batch: Batch
}

export default function RecentBrewCard({ batch }: RecentBrewCardProps) {
  const matchingRecipe = findMatchingRecipe(batch, recipes)
  const vitals = deriveBatchVitals(batch, matchingRecipe)
  const styleDisplay =
    batch.style && batch.style !== 'Unknown'
      ? batch.style
      : (matchingRecipe?.style ?? batch.style)
  const placedEntry = competitions
    .filter((c) => c.batchNo === batch.batchNo)
    .find((c) => c.placement)
  const medal = medalFor(placedEntry?.placement)

  return (
    <Link href={`/brews/${batch.batchNo}`}>
      <div className="border border-border bg-bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent">
        <div className="mb-1 flex items-start justify-between gap-3">
          <h4 className="text-lg">{batch.name}</h4>
          {medal && placedEntry && (
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: MEDAL_COLORS[medal].bg }}
              title={placedEntry.placement}
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
                style={{ color: MEDAL_COLORS[medal].color }}
              >
                <path d={STAR_PATH} />
              </svg>
            </div>
          )}
        </div>
        <p className="mb-3 text-sm uppercase tracking-wide text-accent">
          {styleDisplay}
        </p>
        <p className="mb-3 text-sm text-lavender">
          {formatDate(batch.brewDate)}
        </p>

        <div className="mt-4 flex gap-4 border-t border-border pt-4 text-sm">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wide text-lavender-dark">
              ABV
            </span>
            <span className="font-semibold text-accent">{vitals.abv}%</span>
          </div>
          {batch.ibu !== null && (
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wide text-lavender-dark">
                IBU
              </span>
              <span className="font-semibold text-accent">{batch.ibu}</span>
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wide text-lavender-dark">
              Batch
            </span>
            <span className="font-semibold text-lavender">
              #{batch.batchNo}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
