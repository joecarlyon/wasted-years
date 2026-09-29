import Link from 'next/link'
import { batches } from '@/data/batches'
import { recipes } from '@/data/recipes'
import { competitions } from '@/data/competitions'
import EfficiencyChart from '@/components/EfficiencyChart'
import SectionTitle from '@/components/SectionTitle'
import StatTile from '@/components/StatTile'
import { medalFor } from '@/lib/competitions'
import {
  beerRecords,
  brewsByMonth,
  brewsByYear,
  efficiencyTrend,
  mostBrewed,
  topIngredients,
  topYeasts,
  type BatchRecord,
  type Count,
  type NamedCount,
} from '@/lib/stats'
import { openGraph } from '@/lib/site'

const description =
  'Every batch Wasted Years Brewing has logged, counted: brews per year, the hops and malts that keep coming back, and a brewhouse slowly getting more efficient.'

export const metadata = {
  title: 'By the Numbers | Wasted Years',
  description,
  openGraph: openGraph('By the Numbers', description),
}

const PINTS_PER_GALLON = 8

export default function StatsPage() {
  const gallons = batches.reduce((sum, b) => sum + (b.batchSize || 0), 0)
  const medals = competitions.filter((e) => medalFor(e.placement)).length
  const { years, undated } = brewsByYear(batches)
  const undatedNos = batches.filter((b) => !b.brewDate).map((b) => b.batchNo)
  const emptyYears = years.filter((y) => y.count === 0).map((y) => y.label)
  const months = brewsByMonth(batches)
  const busiest = [...months].sort((a, b) => b.count - a.count)[0]
  const efficiency = efficiencyTrend(batches, recipes)
  const mash = efficiency.filter((p) => p.mash !== undefined)
  const firstMash = mash[0]
  const bestMash = [...mash].sort((a, b) => b.mash! - a.mash!)[0]
  const favorites = mostBrewed(batches, recipes, 6)
  const records = beerRecords(batches, recipes)

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 md:px-8">
      <section className="mb-12 border-b border-border pb-8 text-center">
        <h2 className="mb-2 text-3xl uppercase tracking-widest text-accent">
          By the Numbers
        </h2>
        <p className="text-text-secondary">
          Every batch since the turkey fryer, counted.
        </p>
      </section>

      <section className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile label="Batches" value={batches.length.toLocaleString()} />
        <StatTile
          label="Gallons"
          value={Math.round(gallons).toLocaleString()}
        />
        <StatTile
          label="Pints, roughly"
          value={(
            Math.round((gallons * PINTS_PER_GALLON) / 100) * 100
          ).toLocaleString()}
        />
        <StatTile label="Medals" value={medals.toString()} />
      </section>

      <section className="mb-12">
        <SectionTitle>Brews per year</SectionTitle>
        <ColumnChart data={years} label="Batches brewed per year" />
        <p className="mt-4 text-sm text-text-secondary">
          {emptyYears.length > 0 && (
            <>Nothing logged in {listOf(emptyYears)}. </>
          )}
          {undated > 0 && (
            <>
              Plus {undated} early batches (#{Math.min(...undatedNos)}–
              {Math.max(...undatedNos)}) from before the log kept dates.
            </>
          )}
        </p>
      </section>

      {efficiency.length > 1 && (
        <section className="mb-12">
          <SectionTitle>Getting better at this</SectionTitle>
          <p className="mb-5 text-sm text-text-secondary">
            Mash efficiency is how much sugar the mash gives up; brewhouse
            efficiency is how much of it makes it into the fermenter.
            {firstMash && bestMash && firstMash !== bestMash && (
              <>
                {' '}
                Mash efficiency went from {Math.round(firstMash.mash!)}% on
                batch #{firstMash.batchNo} to {Math.round(bestMash.mash!)}% on #
                {bestMash.batchNo}.
              </>
            )}
          </p>
          <EfficiencyChart data={efficiency} />
          <details className="group mt-4">
            <summary className="cursor-pointer list-none text-sm text-lavender transition-colors hover:text-accent">
              <span className="inline-block transition-transform group-open:rotate-90">
                &#9656;
              </span>{' '}
              Show the numbers
            </summary>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm tabular-nums">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-lavender-dark">
                    <th className="py-2 pr-4 font-normal">Batch</th>
                    <th className="py-2 pr-4 text-right font-normal">
                      Brewhouse
                    </th>
                    <th className="py-2 text-right font-normal">Mash</th>
                  </tr>
                </thead>
                <tbody>
                  {efficiency.map((p) => (
                    <tr key={p.batchNo} className="border-b border-border/50">
                      <td className="py-1.5 pr-4">
                        <Link
                          href={`/brews/${p.batchNo}`}
                          className="text-text-primary transition-colors hover:text-accent"
                        >
                          #{p.batchNo} {p.name}
                        </Link>
                      </td>
                      <td className="py-1.5 pr-4 text-right text-text-secondary">
                        {p.brew !== undefined ? `${p.brew.toFixed(1)}%` : '—'}
                      </td>
                      <td className="py-1.5 text-right text-text-secondary">
                        {p.mash !== undefined ? `${p.mash.toFixed(1)}%` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </section>
      )}

      <section className="mb-12">
        <SectionTitle>Most brewed</SectionTitle>
        <p className="mb-5 text-sm text-text-secondary">
          Counting every version of a recipe together.
        </p>
        <BarList
          items={favorites.map((f) => ({
            name: f.name,
            count: f.brews,
            href: `/recipes/${f.uuid}`,
            note: f.versions > 1 ? `${f.versions} versions` : undefined,
          }))}
          unit="brews"
        />
      </section>

      <section className="mb-12">
        <SectionTitle>The pantry</SectionTitle>
        <p className="mb-5 text-sm text-text-secondary">
          How many batches used each one. A batch without its own ingredient
          list counts its recipe&rsquo;s.
        </p>
        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          <Pantry
            title="Hops"
            items={topIngredients(batches, recipes, 'hops', 8)}
          />
          <Pantry
            title="Malts"
            items={topIngredients(batches, recipes, 'fermentables', 8)}
          />
          <Pantry title="Yeast" items={topYeasts(batches, recipes, 8)} />
        </div>
      </section>

      <section className="mb-12">
        <SectionTitle>Brewing season</SectionTitle>
        <ColumnChart data={months} label="Batches brewed per month" />
        {busiest && (
          <p className="mt-4 text-sm text-text-secondary">
            {monthName(months.indexOf(busiest))} is the busiest month to brew.
          </p>
        )}
      </section>

      <section>
        <SectionTitle>Records</SectionTitle>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <RecordTile
            label="Strongest"
            record={records.strongest}
            format={(v) => `${v.toFixed(1)}%`}
            unit="ABV"
          />
          <RecordTile
            label="Most bitter"
            record={records.bitterest}
            format={(v) => Math.round(v).toString()}
            unit="IBU"
          />
          <RecordTile
            label="Darkest"
            record={records.darkest}
            format={(v) => Math.round(v).toString()}
            unit="SRM"
          />
          <RecordTile
            label="Best mash"
            record={records.bestMash}
            format={(v) => `${v.toFixed(1)}%`}
            unit="efficiency"
          />
        </div>
        <p className="mt-4 text-sm text-text-secondary">
          Beer only &mdash; the spirit washes don&rsquo;t count.
        </p>
      </section>
    </main>
  )
}

// Single-series columns with the value on each cap. Every value is printed,
// so there's no y-axis; a zero year still gets its label so gaps read as gaps.
function ColumnChart({ data, label }: { data: Count[]; label: string }) {
  const max = Math.max(...data.map((d) => d.count), 1)
  return (
    <figure aria-label={label}>
      <ol className="flex h-44 items-end gap-0.5 border-b border-border">
        {data.map((d) => (
          <li
            key={d.label}
            className="flex h-full flex-1 flex-col items-center justify-end"
            title={`${d.label}: ${d.count} ${d.count === 1 ? 'batch' : 'batches'}`}
          >
            <span
              className={`mb-1 text-xs tabular-nums ${d.count > 0 ? 'text-text-primary' : 'text-border'}`}
            >
              {d.count}
            </span>
            <span
              className="w-full max-w-6 rounded-t bg-accent"
              style={{ height: `${(d.count / max) * 80}%` }}
            />
          </li>
        ))}
      </ol>
      <ol className="mt-2 flex gap-0.5" aria-hidden>
        {data.map((d) => (
          <li
            key={d.label}
            className="flex-1 text-center text-[10px] tabular-nums text-text-secondary sm:text-xs"
          >
            {d.label.length === 4 ? (
              <>
                <span className="sm:hidden">&rsquo;{d.label.slice(2)}</span>
                <span className="hidden sm:inline">{d.label}</span>
              </>
            ) : (
              d.label
            )}
          </li>
        ))}
      </ol>
    </figure>
  )
}

interface BarItem {
  name: string
  count: number
  href?: string
  note?: string
}

function BarList({ items, unit }: { items: BarItem[]; unit?: string }) {
  const max = Math.max(...items.map((i) => i.count), 1)
  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item.name}>
          <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
            <span className="text-text-primary">
              {item.href ? (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-accent"
                >
                  {item.name}
                </Link>
              ) : (
                item.name
              )}
              {item.note && (
                <span className="ml-2 text-xs text-lavender-dark">
                  {item.note}
                </span>
              )}
            </span>
            <span className="shrink-0 tabular-nums text-text-secondary">
              {item.count}
              {unit && <span className="ml-1 text-lavender-dark">{unit}</span>}
            </span>
          </div>
          <div className="h-2.5 w-full bg-border">
            <div
              className="h-full rounded-r bg-accent"
              style={{ width: `${(item.count / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}

function Pantry({ title, items }: { title: string; items: NamedCount[] }) {
  return (
    <div>
      <h4 className="mb-4 text-xs uppercase tracking-widest text-lavender-dark">
        {title}
      </h4>
      <BarList items={items} />
    </div>
  )
}

function RecordTile({
  label,
  record,
  format,
  unit,
}: {
  label: string
  record: BatchRecord | undefined
  format: (value: number) => string
  unit: string
}) {
  if (!record) return null
  return (
    <Link
      href={`/brews/${record.batch.batchNo}`}
      className="block border border-border bg-bg-card p-4 transition-colors hover:border-accent hover:bg-bg-hover"
    >
      <div className="text-xs text-text-secondary">{label}</div>
      <div className="mt-1 text-3xl font-semibold text-text-primary">
        {format(record.value)}
        <span className="ml-1 text-sm font-normal text-text-secondary">
          {unit}
        </span>
      </div>
      <div className="mt-2 text-sm text-accent">{record.batch.name}</div>
      <div className="text-xs text-text-secondary">
        Batch #{record.batch.batchNo}
      </div>
    </Link>
  )
}

function listOf(items: string[]) {
  if (items.length <= 1) return items.join('')
  return `${items.slice(0, -1).join(', ')}${items.length > 2 ? ',' : ''} or ${items[items.length - 1]}`
}

function monthName(monthIndex: number) {
  return new Date(Date.UTC(2000, monthIndex, 1)).toLocaleDateString('en-US', {
    month: 'long',
    timeZone: 'UTC',
  })
}
