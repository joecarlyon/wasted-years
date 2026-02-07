import { notFound } from 'next/navigation'
import Link from 'next/link'
import { batches } from '@/data/batches'
import { recipes } from '@/data/recipes'
import { competitions } from '@/data/competitions'
import { formatDate } from '@/lib/utils'
import StatusBadge from '@/components/StatusBadge'
import { JudgeScore } from '@/types'

export function generateStaticParams() {
  return batches.map((b) => ({ id: b.batchNo.toString() }))
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const batch = batches.find((b) => b.batchNo.toString() === params.id)
  if (!batch) return { title: 'Batch Not Found' }
  return {
    title: `Batch #${batch.batchNo}: ${batch.name} | Wasted Years`,
    description: `${batch.style} - ${batch.abv}% ABV`,
  }
}

export default function BrewDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const batch = batches.find((b) => b.batchNo.toString() === params.id)

  if (!batch) {
    notFound()
  }

  const isLegacy = batch.source === 'beersmith'
  const hasData =
    batch.fermentables.length > 0 ||
    batch.hops.length > 0 ||
    batch.yeast.length > 0 ||
    batch.og > 0

  const matchingRecipe = recipes.find(
    (r) => r.name.toLowerCase() === batch.name.toLowerCase()
  )

  const compEntries = competitions.filter((c) => c.batchNo === batch.batchNo)
  const placedEntry = compEntries.find((c) => c.placement)
  const medal = placedEntry?.placement?.toLowerCase().includes('gold')
    ? 'gold'
    : placedEntry?.placement?.toLowerCase().includes('silver')
      ? 'silver'
      : placedEntry?.placement?.toLowerCase().includes('bronze')
        ? 'bronze'
        : null

  const medalColors = {
    gold: { color: '#FFD700', bg: 'rgba(255,215,0,0.15)' },
    silver: { color: '#C0C0C0', bg: 'rgba(192,192,192,0.15)' },
    bronze: { color: '#CD7F32', bg: 'rgba(205,127,50,0.15)' },
  }

  return (
    <main className="mx-auto max-w-4xl px-8 py-8">
      {/* Back link */}
      <Link
        href="/brews"
        className="mb-6 inline-flex items-center text-sm text-text-secondary transition-colors hover:text-accent"
      >
        <span className="mr-2">&larr;</span> Back to Brew Log
      </Link>

      {/* Hero section */}
      <div className="mb-8 border-b border-border pb-8">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-lavender-dark">
              Batch
            </div>
            <div className="text-5xl font-bold text-accent">
              #{batch.batchNo}
            </div>
            <h1 className="mt-3 text-3xl text-text-primary">{batch.name}</h1>
            <p className="text-lg uppercase tracking-wide text-accent">
              {batch.style}
            </p>
            {medal && placedEntry && (
              <div className="mt-3 inline-flex items-center gap-2">
                <div
                  className="rounded-full p-1.5"
                  style={{ backgroundColor: medalColors[medal].bg }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                    style={{ color: medalColors[medal].color }}
                  >
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                </div>
                <span
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: medalColors[medal].color }}
                >
                  {placedEntry.placement}
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <StatusBadge status={batch.status} />
            {batch.source && (
              <span className="rounded border border-border bg-bg-card px-3 py-1 text-xs uppercase tracking-wide text-text-secondary">
                {batch.source}
              </span>
            )}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-6 text-sm text-text-secondary">
          {batch.brewDate && (
            <div>
              <span className="mr-2 text-lavender-dark">Brewed:</span>
              {formatDate(batch.brewDate)}
            </div>
          )}
          {batch.bottlingDate && (
            <div>
              <span className="mr-2 text-lavender-dark">Bottled:</span>
              {formatDate(batch.bottlingDate)}
            </div>
          )}
          <div>
            <span className="mr-2 text-lavender-dark">Brewer:</span>
            {batch.brewer}
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="mb-8 grid grid-cols-3 gap-4 border-b border-border pb-8 sm:grid-cols-7">
        <StatBox
          label="OG"
          value={batch.og > 0 ? batch.og.toFixed(3) : 'N/A'}
        />
        <StatBox
          label="FG"
          value={batch.fg > 0 ? batch.fg.toFixed(3) : 'N/A'}
        />
        <StatBox
          label="ABV"
          value={batch.abv > 0 ? `${batch.abv}%` : 'N/A'}
          highlight
        />
        {batch.ibu !== null && (
          <StatBox label="IBU" value={batch.ibu.toString()} highlight />
        )}
        <StatBox
          label="SRM"
          value={batch.color > 0 ? batch.color.toString() : 'N/A'}
        />
        <StatBox
          label="Efficiency"
          value={batch.efficiency > 0 ? `${batch.efficiency}%` : 'N/A'}
        />
        <StatBox label="Batch" value={`${batch.batchSize} gal`} />
      </div>

      {/* Ingredients */}
      <div className="mb-8 grid gap-8 border-b border-border pb-8 lg:grid-cols-2">
        {/* Fermentables */}
        <Section title="Fermentables">
          {batch.fermentables.length > 0 ? (
            <ul className="space-y-2">
              {batch.fermentables.map((f, idx) => (
                <li key={idx} className="flex justify-between text-sm">
                  <span className="text-text-secondary">{f.name}</span>
                  <span className="text-text-primary">
                    {f.amount.toFixed(2)} lb
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm italic text-text-secondary">Not recorded</p>
          )}
        </Section>

        {/* Hops */}
        <Section title="Hops">
          {batch.hops.length > 0 ? (
            <ul className="space-y-2">
              {batch.hops.map((h, idx) => (
                <li key={idx} className="flex justify-between text-sm">
                  <span className="text-text-secondary">{h.name}</span>
                  <span className="text-text-primary">
                    {h.amount.toFixed(2)} oz &middot; {h.usage}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm italic text-text-secondary">Not recorded</p>
          )}
        </Section>

        {/* Yeast */}
        <Section title="Yeast">
          {batch.yeast.length > 0 ? (
            <div className="space-y-2 text-sm">
              {batch.yeast.map((y, idx) => (
                <div key={idx}>
                  <p className="text-text-primary">{y.name}</p>
                  <p className="text-text-secondary">
                    {y.laboratory}
                    {y.productId && ` (${y.productId})`}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm italic text-text-secondary">Not specified</p>
          )}
        </Section>
      </div>

      {/* Notes */}
      {(batch.brewingNotes || batch.tastingNotes) && (
        <div className="mb-8 space-y-6 border-b border-border pb-8">
          {batch.brewingNotes && (
            <Section title="Brewing Notes">
              <div className="space-y-2 text-sm text-text-secondary">
                {batch.brewingNotes.split(' | ').map((note, i) => (
                  <p key={i}>{note}</p>
                ))}
              </div>
            </Section>
          )}
          {batch.tastingNotes && (
            <Section title="Tasting Notes">
              <p className="text-sm italic text-text-secondary">
                &ldquo;{batch.tastingNotes}&rdquo;
              </p>
            </Section>
          )}
        </div>
      )}

      {/* Competition Results */}
      {compEntries.length > 0 && (
        <div className="mb-8 space-y-8 border-b border-border pb-8">
          <h3 className="text-xs uppercase tracking-widest text-lavender">
            Competition Results
          </h3>
          {compEntries.map((entry, idx) => (
            <div key={idx} className="space-y-6">
              {/* Competition header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {entry.competition}
                  </p>
                  <p className="text-sm text-text-secondary">
                    Entered as &ldquo;{entry.entryName}&rdquo; &middot;{' '}
                    {entry.style}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="text-2xl font-bold text-accent">
                    {entry.score}
                    <span className="text-sm font-normal text-text-secondary">
                      /50
                    </span>
                  </div>
                  <span className="text-xs text-text-secondary">
                    {entry.scoreDescription} &middot; Avg:{' '}
                    {entry.categoryAverage}
                  </span>
                </div>
              </div>

              {/* Placement badge */}
              {entry.placement && (
                <div className="inline-flex items-center gap-2 rounded border border-accent/30 bg-accent/10 px-4 py-2">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5 text-accent"
                  >
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                  <span className="text-sm font-medium text-accent">
                    {entry.placement}
                  </span>
                </div>
              )}

              {/* Judge scoresheets */}
              <div className="grid gap-6 lg:grid-cols-2">
                {entry.judges.map((judge, jIdx) => (
                  <JudgeCard key={jIdx} judge={judge} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recipe link */}
      {matchingRecipe && (
        <div className="mb-8">
          <Link
            href={`/recipes/${matchingRecipe.uuid}`}
            className="inline-flex items-center text-sm text-accent transition-colors hover:text-lavender"
          >
            View Recipe: {matchingRecipe.name} <span className="ml-2">&rarr;</span>
          </Link>
        </div>
      )}

      {/* Legacy notice */}
      {isLegacy && !hasData && (
        <div className="border border-border bg-bg-card p-4">
          <p className="text-sm italic text-text-secondary">
            This is a legacy batch with limited data available.
          </p>
        </div>
      )}
    </main>
  )
}

function StatBox({
  label,
  value,
  highlight = false,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className="text-center">
      <div
        className={`text-xl font-semibold ${highlight ? 'text-accent' : 'text-lavender'}`}
      >
        {value}
      </div>
      <div className="text-xs uppercase tracking-wide text-text-secondary">
        {label}
      </div>
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div>
      <h3 className="mb-4 text-xs uppercase tracking-widest text-lavender">
        {title}
      </h3>
      {children}
    </div>
  )
}

function JudgeCard({ judge }: { judge: JudgeScore }) {
  return (
    <div className="border border-border bg-bg-card p-5">
      {/* Judge header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="font-medium text-text-primary">{judge.name}</p>
          <p className="text-xs text-text-secondary">{judge.location}</p>
          <p className="text-xs text-lavender-dark">
            BJCP {judge.bjcpRank}
            {judge.certifications && ` · ${judge.certifications}`}
          </p>
        </div>
        <div className="text-xl font-bold text-accent">
          {judge.score}
          <span className="text-xs font-normal text-text-secondary">/50</span>
        </div>
      </div>

      {/* Sub-scores */}
      <div className="mb-4 grid grid-cols-5 gap-2">
        {(
          ['aroma', 'appearance', 'flavor', 'mouthfeel', 'overall'] as const
        ).map((category) => (
          <div key={category} className="text-center">
            <div className="text-sm font-semibold text-lavender">
              {judge.scores[category][0]}
              <span className="text-xs font-normal text-text-secondary">
                /{judge.scores[category][1]}
              </span>
            </div>
            <div className="text-[10px] uppercase tracking-wide text-text-secondary">
              {category === 'appearance'
                ? 'App'
                : category === 'mouthfeel'
                  ? 'MF'
                  : category.charAt(0).toUpperCase() + category.slice(1)}
            </div>
          </div>
        ))}
      </div>

      {/* Flaws */}
      {judge.flaws && (
        <p className="mb-3 text-xs text-status-error">
          Flaws: {judge.flaws}
        </p>
      )}

      {/* Feedback */}
      <p className="text-sm italic text-text-secondary">
        &ldquo;{judge.feedback}&rdquo;
      </p>
    </div>
  )
}
