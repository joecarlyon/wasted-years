import { Batch } from '@/types'
import { formatDate } from '@/lib/utils'
import StatusBadge from './StatusBadge'

interface BrewEntryProps {
  batch: Batch
}

export default function BrewEntry({ batch }: BrewEntryProps) {
  const yeastDisplay =
    batch.yeast.length > 0
      ? batch.yeast.map((y) => `${y.name} (${y.laboratory})`).join(', ')
      : 'Not specified'

  return (
    <div className="grid grid-cols-[120px_1fr] gap-6 border border-border bg-bg-card p-6 max-md:grid-cols-1">
      <div className="border-r border-border pr-6 max-md:flex max-md:items-center max-md:gap-4 max-md:border-b max-md:border-r-0 max-md:pb-4 max-md:pr-0">
        <div className="text-xs uppercase tracking-wide text-lavender-dark">
          Batch
        </div>
        <div className="text-4xl font-bold text-accent">#{batch.batchNo}</div>
        <div className="mt-2 text-sm text-lavender max-md:mt-0">
          {formatDate(batch.brewDate)}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-start justify-between gap-4">
          <div>
            <h4 className="text-xl">{batch.name}</h4>
            <p className="text-sm uppercase tracking-wide text-accent">
              {batch.style}
            </p>
          </div>
          <StatusBadge status={batch.status} />
        </div>

        <div className="mt-4 flex flex-wrap gap-6 text-sm">
          <div>
            <span className="mr-2 text-lavender-dark">OG:</span>
            <span className="text-lavender">{batch.og.toFixed(3)}</span>
          </div>
          <div>
            <span className="mr-2 text-lavender-dark">FG:</span>
            <span className="text-lavender">{batch.fg.toFixed(3)}</span>
          </div>
          <div>
            <span className="mr-2 text-lavender-dark">ABV:</span>
            <span className="font-semibold text-accent">{batch.abv}%</span>
          </div>
          {batch.ibu !== null && (
            <div>
              <span className="mr-2 text-lavender-dark">IBU:</span>
              <span className="font-semibold text-accent">{batch.ibu}</span>
            </div>
          )}
        </div>

        <div className="mt-3 text-sm">
          <span className="mr-2 text-lavender-dark">Yeast:</span>
          <span className="text-text-secondary">{yeastDisplay}</span>
        </div>

        <div className="mt-2 text-sm">
          <span className="mr-2 text-lavender-dark">Bottled:</span>
          <span className="text-text-secondary">
            {formatDate(batch.bottlingDate)}
          </span>
        </div>
      </div>
    </div>
  )
}
