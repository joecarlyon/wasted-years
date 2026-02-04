import { Batch } from '@/types'
import { formatDate } from '@/lib/utils'

interface RecentBrewCardProps {
  batch: Batch
}

export default function RecentBrewCard({ batch }: RecentBrewCardProps) {
  return (
    <div className="border border-border bg-bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent">
      <h4 className="mb-1 text-lg">{batch.name}</h4>
      <p className="mb-3 text-sm uppercase tracking-wide text-accent">
        {batch.style}
      </p>
      <p className="mb-3 text-sm text-lavender">{formatDate(batch.brewDate)}</p>

      <div className="mt-4 flex gap-4 border-t border-border pt-4 text-sm">
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-wide text-lavender-dark">
            ABV
          </span>
          <span className="font-semibold text-accent">{batch.abv}%</span>
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
    </div>
  )
}
