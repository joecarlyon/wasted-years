import Link from 'next/link'
import { Recipe } from '@/types'
import { batches } from '@/data/batches'
import { recipes } from '@/data/recipes'
import { competitions } from '@/data/competitions'
import { diffRecipes, recipeFamily, type AmountChange } from '@/lib/lineage'
import {
  MEDAL_COLORS,
  STAR_PATH,
  entriesByRecipe,
  medalFor,
} from '@/lib/competitions'
import { findMatchingRecipe } from '@/lib/utils'

// Every version of this recipe, oldest first, with how each one did in
// competition — then what changed from the version it evolved from.
export default function RecipeLineage({ recipe }: { recipe: Recipe }) {
  const family = recipeFamily(recipe.uuid, recipes)
  if (family.length === 0) return null

  const entries = entriesByRecipe(competitions, batches, recipes)
  const brewCount = (uuid: string) =>
    batches.filter((b) => findMatchingRecipe(b, recipes)?.uuid === uuid).length
  const parent = family.find((m) => m.recipe.uuid === recipe.uuid)?.parent
  const diff = parent && diffRecipes(parent, recipe)

  return (
    <div id="lineage" className="mt-8 scroll-mt-24">
      <h3 className="mb-4 text-xs uppercase tracking-widest text-lavender">
        Lineage
      </h3>

      <ol className="relative border-l border-border">
        {family.map((member, idx) => {
          const r = member.recipe
          const isCurrent = r.uuid === recipe.uuid
          // Only call out the parent when it isn't the row right above
          const branchedFrom =
            member.parent && member.parent.uuid !== family[idx - 1]?.recipe.uuid
              ? member.parent
              : undefined
          const brews = brewCount(r.uuid)
          const results = [...(entries.get(r.uuid) ?? [])].sort(
            (a, b) => a.year - b.year
          )

          return (
            <li key={r.uuid} className="relative pb-5 pl-6 last:pb-0">
              <span
                className={`absolute -left-[5px] top-1.5 h-[9px] w-[9px] rounded-full border ${
                  isCurrent
                    ? 'border-accent bg-accent'
                    : 'border-lavender-dark bg-bg-dark'
                }`}
              />
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                {isCurrent ? (
                  <span className="text-accent">{r.name}</span>
                ) : (
                  <Link
                    href={`/recipes/${r.uuid}`}
                    className="text-text-primary transition-colors hover:text-accent"
                  >
                    {r.name}
                  </Link>
                )}
                <span className="text-xs uppercase tracking-wide text-text-secondary">
                  {r.brewDate ? monthYear(r.brewDate) : 'Undated'}
                </span>
                {branchedFrom && (
                  <span className="text-xs text-lavender-dark">
                    from {branchedFrom.name}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-text-secondary">
                {r.abv.toFixed(1)}% &middot; {Math.round(r.ibu)} IBU
                {brews > 0 && (
                  <>
                    {' '}
                    &middot; brewed {brews} time{brews === 1 ? '' : 's'}
                  </>
                )}
              </p>
              {results.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {results.map((entry) => {
                    const medal = medalFor(entry.placement)
                    return (
                      <Link
                        key={`${entry.year}-${entry.batchNo}`}
                        href={`/brews/${entry.batchNo}`}
                        title={`${entry.competition}${entry.placement ? ` · ${entry.placement}` : ''}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border py-0.5 pl-1.5 pr-2.5 text-xs transition-colors hover:border-accent"
                        style={
                          medal
                            ? {
                                backgroundColor: MEDAL_COLORS[medal].bg,
                                borderColor: 'transparent',
                              }
                            : undefined
                        }
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="h-3.5 w-3.5"
                          fill={medal ? 'currentColor' : 'none'}
                          stroke={medal ? 'none' : 'currentColor'}
                          strokeWidth={2}
                          style={{
                            color: medal
                              ? MEDAL_COLORS[medal].color
                              : 'rgb(var(--color-text-secondary))',
                          }}
                        >
                          <path d={STAR_PATH} />
                        </svg>
                        <span className="text-text-secondary">
                          {entry.year}
                        </span>
                        <span className="font-semibold text-text-primary">
                          {entry.score}
                        </span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </li>
          )
        })}
      </ol>

      {parent && diff && (
        <div className="mt-6 border border-border bg-bg-card p-5">
          <h4 className="text-xs uppercase tracking-widest text-lavender">
            What changed from{' '}
            <Link
              href={`/recipes/${parent.uuid}`}
              className="text-text-primary transition-colors hover:text-accent"
            >
              {parent.name}
            </Link>
          </h4>
          {diff.scaledTo && (
            <p className="mt-1 text-xs text-text-secondary">
              Hop amounts compared at {diff.scaledTo} gal
            </p>
          )}

          <dl className="mt-4 space-y-4 text-sm">
            {diff.vitals.length > 0 && (
              <DiffRow label="Numbers" inline>
                {diff.vitals.map((v) => (
                  <li key={v.label}>
                    <span className="text-text-secondary">{v.label}</span>{' '}
                    {v.from} <Arrow /> {v.to}
                  </li>
                ))}
              </DiffRow>
            )}
            {diff.fermentables.length > 0 && (
              <DiffRow label="Grain bill">
                {diff.fermentables.map((c) => (
                  <Change key={c.name} change={c} unit="%" />
                ))}
              </DiffRow>
            )}
            {diff.hops.length > 0 && (
              <DiffRow label="Hops">
                {diff.hops.map((c) => (
                  <Change key={c.name} change={c} unit=" oz" />
                ))}
              </DiffRow>
            )}
            {diff.yeast && (
              <DiffRow label="Yeast">
                <li>
                  {diff.yeast.from} <Arrow /> {diff.yeast.to}
                </li>
              </DiffRow>
            )}
            {diff.water.length > 0 && (
              <DiffRow label="Water (ppm)" inline>
                {diff.water.map((w) => (
                  <li key={w.label}>
                    <span className="text-text-secondary">{w.label}</span>{' '}
                    {w.from} <Arrow /> {w.to}
                  </li>
                ))}
              </DiffRow>
            )}
          </dl>
          {isUnchanged(diff) && (
            <p className="mt-4 text-sm text-text-secondary">
              Same ingredients
              {diff.scaledTo ? `, rescaled to ${diff.scaledTo} gal` : ''}.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

function DiffRow({
  label,
  inline = false,
  children,
}: {
  label: string
  inline?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="sm:grid sm:grid-cols-[7rem_1fr] sm:gap-4">
      <dt className="mb-1 text-xs uppercase tracking-wide text-lavender-dark sm:mb-0 sm:pt-0.5">
        {label}
      </dt>
      <dd>
        <ul
          className={`text-text-primary ${inline ? 'flex flex-wrap gap-x-5 gap-y-1' : 'space-y-1'}`}
        >
          {children}
        </ul>
      </dd>
    </div>
  )
}

function Change({ change, unit }: { change: AmountChange; unit: string }) {
  if (change.from === undefined)
    return (
      <li>
        <span className="text-status-success">+</span> {change.name}{' '}
        <span className="text-text-secondary">
          {change.to}
          {unit}
        </span>
      </li>
    )
  if (change.to === undefined)
    return (
      <li className="text-text-secondary">
        <span className="text-status-error">&minus;</span>{' '}
        <span className="line-through decoration-text-secondary/50">
          {change.name}
        </span>{' '}
        {change.from}
        {unit}
      </li>
    )
  return (
    <li>
      {change.name}{' '}
      <span className="text-text-secondary">
        {change.from}
        {unit}
      </span>{' '}
      <Arrow /> {change.to}
      {unit}
    </li>
  )
}

function Arrow() {
  return <span className="text-accent">&rarr;</span>
}

function isUnchanged(diff: ReturnType<typeof diffRecipes>) {
  return (
    !diff.yeast &&
    diff.fermentables.length === 0 &&
    diff.hops.length === 0 &&
    diff.water.length === 0 &&
    diff.vitals.every((v) => v.label === 'Batch')
  )
}

function monthYear(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
