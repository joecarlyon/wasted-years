import Link from 'next/link'
import { brewingSetups } from '@/data/equipment'
import { batches } from '@/data/batches'
import { BrewingSetup } from '@/types'

export const metadata = {
  title: 'Equipment | Wasted Years',
  description: 'Brewing equipment profiles and setup details',
}

export default function EquipmentPage() {
  return (
    <main className="mx-auto max-w-6xl px-8 py-8">
      <div className="mb-8 border-b border-border py-8 text-center">
        <h2 className="mb-2 text-3xl uppercase tracking-widest text-accent">
          Equipment
        </h2>
        <p className="text-text-secondary">
          {brewingSetups.length} setups &middot; {batches.length} batches brewed
        </p>
      </div>

      <div className="space-y-12">
        {brewingSetups.map((setup) => (
          <SetupCard key={setup.id} setup={setup} />
        ))}
      </div>
    </main>
  )
}

function SetupCard({ setup }: { setup: BrewingSetup }) {
  const setupBatches = batches.filter((b) => b.source === setup.batchSource)
  const batchNos = setupBatches.map((b) => b.batchNo)
  const minBatch = Math.min(...batchNos)
  const maxBatch = Math.max(...batchNos)

  return (
    <div
      id={setup.id}
      className="scroll-mt-24 border border-border bg-bg-card p-8"
    >
      {/* Header */}
      <div className="mb-6 border-b border-border pb-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold text-text-primary">
              {setup.name}
            </h3>
            <p className="text-sm italic text-text-secondary">
              {setup.tagline}
            </p>
          </div>
          <div className="flex gap-2">
            <span className="rounded border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-accent">
              {setup.method}
            </span>
            <span className="rounded border border-border px-3 py-1 text-xs uppercase tracking-wide text-text-secondary">
              {setup.era}
            </span>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-text-secondary">
          {setup.description}
        </p>
      </div>

      {/* Specs bar */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <SpecBox label="Batch Size" value={setup.specs.batchSize} />
        <SpecBox label="Boil Time" value={setup.specs.boilTime} />
        <SpecBox label="Brew Eff." value={setup.specs.brewEfficiency} />
        <SpecBox label="Mash Eff." value={setup.specs.mashEfficiency} />
        <SpecBox label="Heat Source" value={setup.specs.heatSource} />
        <SpecBox label="Mash Method" value={setup.specs.mashMethod} />
      </div>

      {/* Equipment list */}
      <div className="mb-6">
        <h4 className="mb-4 text-xs uppercase tracking-widest text-lavender">
          Equipment
        </h4>
        <div className="grid gap-4 sm:grid-cols-2">
          {setup.equipment.map((item, idx) => (
            <div key={idx} className="border border-border p-4">
              <p className="font-medium text-text-primary">{item.name}</p>
              <p className="text-xs uppercase tracking-wide text-accent">
                {item.role}
              </p>
              {item.description && (
                <p className="mt-1 text-sm text-text-secondary">
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Batch count */}
      <div className="flex items-center justify-between border-t border-border pt-4 text-sm">
        <span className="text-text-secondary">
          {setupBatches.length} batches brewed (#{minBatch}&ndash;{maxBatch})
        </span>
        <Link
          href={`/brews?source=${setup.batchSource}`}
          className="text-accent transition-colors hover:text-lavender"
        >
          View Brew Log &rarr;
        </Link>
      </div>
    </div>
  )
}

function SpecBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-lg font-semibold text-lavender">{value}</div>
      <div className="text-xs uppercase tracking-wide text-text-secondary">
        {label}
      </div>
    </div>
  )
}
