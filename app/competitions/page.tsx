import Link from 'next/link'
import { competitions } from '@/data/competitions'
import { batches } from '@/data/batches'
import JudgeCard from '@/components/JudgeCard'
import SectionTitle from '@/components/SectionTitle'
import StatTile from '@/components/StatTile'
import {
  MEDAL_COLORS,
  STAR_PATH,
  categoryAverages,
  flawTally,
  medalFor,
} from '@/lib/competitions'
import { CompetitionEntry } from '@/types'
import { openGraph } from '@/lib/site'

const description =
  'Every homebrew competition entry, BJCP scoresheet, and medal from Wasted Years Brewing.'

export const metadata = {
  title: 'Competitions | Wasted Years',
  description,
  openGraph: openGraph('Competitions', description),
}

// The score chart's x-axis. Every entry so far lands between these; widen it
// if one ever doesn't.
const AXIS_MIN = 25
const AXIS_MAX = 45
const AXIS_TICKS = [25, 30, 35, 40, 45]

const INTENSITY: Record<string, string> = {
  L: 'low',
  M: 'moderate',
  H: 'high',
}

function batchName(batchNo: number) {
  return batches.find((b) => b.batchNo === batchNo)?.name
}

function pct(score: number) {
  const clamped = Math.min(AXIS_MAX, Math.max(AXIS_MIN, score))
  return ((clamped - AXIS_MIN) / (AXIS_MAX - AXIS_MIN)) * 100
}

function signed(n: number) {
  const r = Math.round(n * 10) / 10
  return `${r > 0 ? '+' : r < 0 ? '−' : '±'}${Math.abs(r).toFixed(1)}`
}

export default function CompetitionsPage() {
  // Oldest first so the chart reads as a progression
  const chronological = [...competitions].sort(
    (a, b) => a.year - b.year || a.batchNo - b.batchNo
  )
  const newestFirst = [...chronological].reverse()
  const medals = newestFirst.filter((e) => medalFor(e.placement))
  const avgScore =
    competitions.reduce((sum, e) => sum + e.score, 0) / competitions.length
  const beatAverage = competitions.filter(
    (e) => e.score > e.categoryAverage
  ).length
  const categories = categoryAverages(competitions)
  const weakest = [...categories].sort((a, b) => a.share - b.share)[0]
  const flaws = flawTally(competitions)
  const scoresheetCount = competitions.reduce(
    (sum, e) => sum + e.judges.length,
    0
  )

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 md:px-8">
      <section className="mb-12 border-b border-border pb-8 text-center">
        <h2 className="mb-2 text-3xl uppercase tracking-widest text-accent">
          Competitions
        </h2>
        <p className="text-text-secondary">
          Every entry, every scoresheet, every note about diacetyl.
        </p>
      </section>

      {/* Headline numbers */}
      <section className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile label="Entries" value={competitions.length.toString()} />
        <StatTile label="Medals" value={medals.length.toString()} />
        <StatTile
          label="Average score"
          value={avgScore.toFixed(1)}
          unit="/50"
        />
        <StatTile
          label="Beat the category average"
          value={beatAverage.toString()}
          unit={`of ${competitions.length}`}
        />
      </section>

      {/* Medal wall */}
      {medals.length > 0 && (
        <section className="mb-12">
          <SectionTitle>Hardware</SectionTitle>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {medals.map((entry) => {
              const medal = medalFor(entry.placement)!
              return (
                <Link
                  key={`${entry.year}-${entry.batchNo}`}
                  href={`/brews/${entry.batchNo}`}
                  className="flex flex-col items-center border border-border bg-bg-card p-6 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-accent"
                >
                  <div
                    className="mb-3 rounded-full p-3"
                    style={{ backgroundColor: MEDAL_COLORS[medal].bg }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-8 w-8"
                      style={{ color: MEDAL_COLORS[medal].color }}
                    >
                      <path d={STAR_PATH} />
                    </svg>
                  </div>
                  <p className="text-xs uppercase tracking-widest text-lavender">
                    NHC {entry.year}
                  </p>
                  <p className="mt-1 text-lg text-text-primary">
                    {batchName(entry.batchNo) ?? entry.entryName}
                  </p>
                  <p className="mt-1 text-sm text-text-secondary">
                    {entry.placement}
                  </p>
                  <p className="mt-3 text-sm text-text-secondary">
                    <span className="font-semibold text-text-primary">
                      {entry.score}
                    </span>
                    /50
                  </p>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* Score vs category average */}
      <section className="mb-12">
        <SectionTitle>Score vs. the category average</SectionTitle>
        <ScoreChart entries={chronological} />
      </section>

      <section className="mb-12 grid gap-10 md:grid-cols-2">
        {/* Where the points go */}
        <div>
          <SectionTitle>Where the points go</SectionTitle>
          <p className="mb-5 text-sm text-text-secondary">
            Average score per scoresheet section across all {scoresheetCount}{' '}
            scoresheets.{' '}
            {weakest && (
              <>
                <span className="capitalize">{weakest.category}</span> is where
                the most points get left on the table.
              </>
            )}
          </p>
          <ul className="space-y-4">
            {categories.map((c) => (
              <li key={c.category}>
                <div className="mb-1.5 flex items-baseline justify-between text-sm">
                  <span className="capitalize text-text-primary">
                    {c.category}
                  </span>
                  <span className="tabular-nums text-text-secondary">
                    {c.average.toFixed(1)} / {c.max}
                    <span className="ml-2 text-lavender-dark">
                      {Math.round(c.share * 100)}%
                    </span>
                  </span>
                </div>
                <div className="h-2.5 w-full bg-border">
                  <div
                    className="h-full rounded-r bg-accent"
                    style={{ width: `${c.share * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Flaws */}
        <div>
          <SectionTitle>Flaws judges flagged</SectionTitle>
          {flaws.length > 0 ? (
            <ul className="space-y-3">
              {flaws.map((f) => (
                <li
                  key={f.name}
                  className="flex items-baseline justify-between gap-4 border-b border-border/60 pb-3 text-sm"
                >
                  <span className="text-text-primary">{f.name}</span>
                  <span className="text-right text-text-secondary">
                    {f.count} {f.count === 1 ? 'scoresheet' : 'scoresheets'}
                    {f.intensities.length > 0 && (
                      <span className="ml-2 text-lavender-dark">
                        (
                        {f.intensities
                          .map((i) => INTENSITY[i] ?? i.toLowerCase())
                          .join(', ')}
                        )
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm italic text-text-secondary">
              No flaws flagged. Suspicious.
            </p>
          )}
        </div>
      </section>

      {/* Every entry */}
      <section>
        <div className="mb-6 flex items-baseline justify-between gap-4 border-b border-border pb-2">
          <h3 className="text-xs uppercase tracking-widest text-lavender">
            Every entry
          </h3>
          <Link
            href="/brews?filter=competition"
            className="text-xs uppercase tracking-wide text-text-secondary transition-colors hover:text-accent"
          >
            In the brew log &rarr;
          </Link>
        </div>
        <div className="space-y-6">
          {newestFirst.map((entry) => (
            <EntryCard key={`${entry.year}-${entry.batchNo}`} entry={entry} />
          ))}
        </div>
      </section>
    </main>
  )
}

// Dumbbell rows on one shared axis: the category average is a gray tick, the
// entry's score a gold dot, joined by a hairline. Each row links to its batch
// and shows the full numbers on hover/focus; the entry list below carries
// every value too, so nothing is hover-only.
function ScoreChart({ entries }: { entries: CompetitionEntry[] }) {
  return (
    <div className="border border-border bg-bg-card p-5 sm:p-6">
      <div className="mb-5 flex flex-wrap gap-5 text-xs text-text-secondary">
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-accent" />
          Wasted Years score
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3.5 w-0.5 bg-lavender-dark" />
          Category average
        </span>
      </div>

      <div className="space-y-1">
        {entries.map((entry) => {
          const delta = entry.score - entry.categoryAverage
          const lo = pct(Math.min(entry.score, entry.categoryAverage))
          const hi = pct(Math.max(entry.score, entry.categoryAverage))
          return (
            <Link
              key={`${entry.year}-${entry.batchNo}`}
              href={`/brews/${entry.batchNo}`}
              className="group relative grid grid-cols-[88px_1fr_48px] items-center gap-3 rounded px-1 py-2 outline-none transition-colors hover:bg-bg-hover focus-visible:bg-bg-hover sm:grid-cols-[150px_1fr_56px]"
            >
              <div className="min-w-0 text-sm">
                <div className="text-xs text-lavender-dark">{entry.year}</div>
                <div className="truncate text-text-primary">
                  {entry.entryName}
                </div>
              </div>

              <div className="relative h-8">
                {AXIS_TICKS.map((t) => (
                  <div
                    key={t}
                    className="absolute inset-y-0 w-px bg-border"
                    style={{ left: `${pct(t)}%` }}
                  />
                ))}
                <div
                  className="absolute top-1/2 h-0.5 -translate-y-1/2 bg-lavender-dark/60"
                  style={{ left: `${lo}%`, width: `${hi - lo}%` }}
                />
                <div
                  className="absolute top-1/2 h-4 w-0.5 -translate-x-1/2 -translate-y-1/2 bg-lavender-dark"
                  style={{ left: `${pct(entry.categoryAverage)}%` }}
                />
                <div
                  className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent ring-2 ring-bg-card group-hover:ring-bg-hover"
                  style={{ left: `${pct(entry.score)}%` }}
                />

                {/* Tooltip */}
                <div
                  className="pointer-events-none absolute bottom-full z-10 mb-2 hidden -translate-x-1/2 whitespace-nowrap border border-border bg-bg-dark px-3 py-2 text-xs shadow-lg group-hover:block group-focus-visible:block"
                  style={{ left: `${pct(entry.score)}%` }}
                >
                  <div className="flex items-center gap-2">
                    <span className="h-0.5 w-3 bg-accent" />
                    <span className="font-semibold text-text-primary">
                      {entry.score}
                    </span>
                    <span className="text-text-secondary">score</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-0.5 w-3 bg-lavender-dark" />
                    <span className="font-semibold text-text-primary">
                      {entry.categoryAverage}
                    </span>
                    <span className="text-text-secondary">category avg</span>
                  </div>
                  <div className="mt-1 text-text-secondary">
                    {entry.competition}
                  </div>
                </div>
              </div>

              <div className="text-right text-sm tabular-nums text-text-primary">
                {signed(delta)}
              </div>
            </Link>
          )
        })}
      </div>

      {/* Axis */}
      <div className="grid grid-cols-[88px_1fr_48px] gap-3 px-1 sm:grid-cols-[150px_1fr_56px]">
        <div />
        <div className="relative h-5">
          {AXIS_TICKS.map((t) => (
            <span
              key={t}
              className="absolute top-1 -translate-x-1/2 text-[11px] tabular-nums text-text-secondary"
              style={{ left: `${pct(t)}%` }}
            >
              {t}
            </span>
          ))}
        </div>
        <div className="pt-1 text-right text-[11px] text-text-secondary">
          vs avg
        </div>
      </div>
    </div>
  )
}

function EntryCard({ entry }: { entry: CompetitionEntry }) {
  const medal = medalFor(entry.placement)
  const name = batchName(entry.batchNo)

  return (
    <article className="border border-border bg-bg-card p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-widest text-lavender">
            {entry.year} &middot; {entry.competition}
          </p>
          <h4 className="mt-1 text-xl text-text-primary">
            <Link
              href={`/brews/${entry.batchNo}`}
              className="transition-colors hover:text-accent"
            >
              {name ?? entry.entryName}
            </Link>
          </h4>
          <p className="text-sm text-text-secondary">
            {name && name !== entry.entryName && (
              <>Entered as &ldquo;{entry.entryName}&rdquo; &middot; </>
            )}
            {entry.style} &middot; Batch #{entry.batchNo}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-2xl font-bold text-accent">
            {entry.score}
            <span className="text-sm font-normal text-text-secondary">/50</span>
          </div>
          <div className="text-xs text-text-secondary">
            {entry.scoreDescription} &middot; Avg {entry.categoryAverage}
          </div>
        </div>
      </div>

      {medal && (
        <div
          className="mt-4 inline-flex items-center gap-2 rounded-full py-1 pl-1.5 pr-3"
          style={{ backgroundColor: MEDAL_COLORS[medal].bg }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 w-4"
            style={{ color: MEDAL_COLORS[medal].color }}
          >
            <path d={STAR_PATH} />
          </svg>
          <span className="text-xs font-bold uppercase tracking-wider text-text-primary">
            {entry.placement}
          </span>
        </div>
      )}

      <details className="group mt-4">
        <summary className="cursor-pointer list-none text-sm text-lavender transition-colors hover:text-accent">
          <span className="inline-block transition-transform group-open:rotate-90">
            &#9656;
          </span>{' '}
          Read the {entry.judges.length} scoresheet
          {entry.judges.length === 1 ? '' : 's'}
        </summary>
        <div className="mt-4 grid gap-6 lg:grid-cols-2">
          {entry.judges.map((judge, idx) => (
            <JudgeCard key={idx} judge={judge} />
          ))}
        </div>
      </details>
    </article>
  )
}
