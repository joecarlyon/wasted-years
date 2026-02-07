'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Batch } from '@/types'
import { competitions } from '@/data/competitions'
import BrewEntry from './BrewEntry'

interface BatchSearchProps {
  batches: Batch[]
}

export default function BatchSearch({ batches }: BatchSearchProps) {
  const searchParams = useSearchParams()
  const sourceFilter = searchParams.get('source')
  const competitionFilter = searchParams.get('filter') === 'competition'
  const [searchQuery, setSearchQuery] = useState('')

  const competitionBatchNos = new Set(competitions.map((c) => c.batchNo))

  const filteredBatches = batches.filter((batch) => {
    if (sourceFilter && batch.source !== sourceFilter) return false
    if (competitionFilter && !competitionBatchNos.has(batch.batchNo)) return false

    if (!searchQuery) return true

    const query = searchQuery.toLowerCase()
    return (
      batch.name.toLowerCase().includes(query) ||
      batch.style.toLowerCase().includes(query) ||
      batch.yeast.some((y) => y.name.toLowerCase().includes(query)) ||
      batch.yeast.some((y) => y.laboratory.toLowerCase().includes(query)) ||
      batch.fermentables.some((f) => f.name.toLowerCase().includes(query)) ||
      batch.hops.some((h) => h.name.toLowerCase().includes(query)) ||
      batch.batchNo.toString() === query
    )
  })

  return (
    <>
      <div className="mb-8 flex justify-end">
        <input
          type="text"
          placeholder="Search batches..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border border-border bg-bg-card px-4 py-2 text-text-primary placeholder-text-secondary focus:border-accent focus:outline-none sm:w-64"
        />
      </div>

      <div className="flex flex-col gap-6">
        {filteredBatches.map((batch) => (
          <BrewEntry key={batch.batchNo} batch={batch} />
        ))}
      </div>

      {filteredBatches.length === 0 && (
        <div className="border border-dashed border-border py-12 text-center text-text-secondary">
          <p>No batches found matching your search.</p>
        </div>
      )}
    </>
  )
}
