import { Suspense } from 'react'
import { batches } from '@/data/batches'
import BatchSearch from '@/components/BatchSearch'

export default function BrewsPage() {
  const sortedBatches = [...batches].sort((a, b) => {
    // Sort by brew date, newest first; then by batch number as tiebreaker
    const dateA = a.brewDate ? new Date(a.brewDate).getTime() : 0
    const dateB = b.brewDate ? new Date(b.brewDate).getTime() : 0
    if (dateA !== dateB) return dateB - dateA
    return b.batchNo - a.batchNo // Higher batch number = newer
  })

  return (
    <main className="mx-auto max-w-6xl px-8 py-8">
      <div className="mb-8 border-b border-border py-8 text-center">
        <h2 className="mb-2 text-3xl uppercase tracking-widest text-accent">Brew Log</h2>
        <p className="text-text-secondary">
          Complete history of all batches brewed
        </p>
      </div>

      <Suspense>
        <BatchSearch batches={sortedBatches} />
      </Suspense>
    </main>
  )
}
