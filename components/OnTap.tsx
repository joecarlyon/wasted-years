import Link from 'next/link'
import { Batch } from '@/types'
import { batches } from '@/data/batches'
import { recipes } from '@/data/recipes'
import { taps } from '@/data/taps'
import { deriveBatchVitals, findMatchingRecipe, formatDate } from '@/lib/utils'
import DryTap from './DryTap'
import DaysSince from './DaysSince'

export default function OnTap() {
  const byBatchNo = new Map(batches.map((b) => [b.batchNo, b]))
  const pouring = taps
    .filter((t) => !t.kicked)
    .flatMap((t) => {
      const batch = byBatchNo.get(t.batchNo)
      return batch ? [{ batch, tapped: t.tapped || batch.bottlingDate }] : []
    })

  if (pouring.length > 0) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {pouring.map(({ batch, tapped }) => (
          <TapCard key={batch.batchNo} batch={batch} tapped={tapped} />
        ))}
      </div>
    )
  }

  const lastKicked = taps
    .filter((t) => t.kicked)
    .sort((a, b) => b.kicked!.localeCompare(a.kicked!))[0]
  const lastBatch = lastKicked && byBatchNo.get(lastKicked.batchNo)
  const inProgress = batches.filter(
    (b) => b.status === 'Fermenting' || b.status === 'Conditioning'
  )

  return (
    <div className="flex flex-col items-center gap-6 border border-dashed border-border bg-bg-card px-6 py-10 text-center sm:flex-row sm:px-10 sm:text-left">
      <DryTap className="w-24 shrink-0 sm:w-28" />
      <div>
        <p className="text-2xl font-bold text-text-primary">
          The taps are dry.
        </p>
        {lastKicked?.kicked && lastBatch && (
          <p className="mt-2 text-text-secondary">
            Last pour:{' '}
            <Link
              href={`/brews/${lastBatch.batchNo}`}
              className="text-accent transition-colors hover:text-accent-light"
            >
              {lastBatch.name}
            </Link>
            , kicked {formatDate(lastKicked.kicked)}.{' '}
            <span className="text-lavender">
              <DaysSince date={lastKicked.kicked} prefix="Dry " suffix="." />
            </span>
          </p>
        )}
        {inProgress.length > 0 ? (
          <p className="mt-3 text-sm text-text-secondary">
            Coming soon:{' '}
            {inProgress.map((b, idx) => (
              <span key={b.batchNo}>
                {idx > 0 && ', '}
                <Link
                  href={`/brews/${b.batchNo}`}
                  className="text-lavender transition-colors hover:text-accent"
                >
                  {b.name}
                </Link>{' '}
                ({b.status.toLowerCase()})
              </span>
            ))}
          </p>
        ) : (
          <p className="mt-3 text-sm italic text-lavender-dark">
            Nothing in the fermenter either. Somebody should brew.
          </p>
        )}
      </div>
    </div>
  )
}

function TapCard({ batch, tapped }: { batch: Batch; tapped: string }) {
  const recipe = findMatchingRecipe(batch, recipes)
  const vitals = deriveBatchVitals(batch, recipe)
  const style =
    batch.style && batch.style !== 'Unknown'
      ? batch.style
      : (recipe?.style ?? batch.style)

  return (
    <Link
      href={`/brews/${batch.batchNo}`}
      className="block border border-border bg-bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent"
    >
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-status-success">
        <span className="h-2 w-2 animate-pulse rounded-full bg-status-success" />
        Pouring
      </div>
      <h4 className="mt-2 text-lg text-text-primary">{batch.name}</h4>
      <p className="text-sm uppercase tracking-wide text-accent">{style}</p>
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
          <span className="font-semibold text-lavender">#{batch.batchNo}</span>
        </div>
      </div>
      {tapped && (
        <p className="mt-3 text-xs text-lavender">
          On tap since {formatDate(tapped)}
        </p>
      )}
    </Link>
  )
}
