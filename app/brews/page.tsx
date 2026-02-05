import { batches } from '@/data/batches'
import BrewEntry from '@/components/BrewEntry'

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
        <h2 className="mb-2 text-3xl uppercase tracking-widest">Brew Log</h2>
        <p className="text-text-secondary">
          Complete history of all batches brewed
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {sortedBatches.map((batch) => (
          <BrewEntry key={batch.batchNo} batch={batch} />
        ))}
      </div>

      {sortedBatches.length === 0 && (
        <div className="border border-dashed border-border py-12 text-center text-text-secondary">
          <p>No brews recorded yet.</p>
          <p className="mt-2 text-sm italic">Check back soon!</p>
        </div>
      )}
    </main>
  )
}
