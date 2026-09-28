'use client'

import { useMemo, useState } from 'react'
import { Recipe } from '@/types'
import { recipeIngredients, scaleIngredients, slugify } from '@/lib/recipe'
import { recipeToBeerXml } from '@/lib/beerxml'

interface RecipeIngredientsProps {
  recipe: Recipe
  baseBatchSize: number // gal
  boilTime: number // min
  efficiency?: number // %
  sourceUrl: string
}

const STEP = 0.5

// Fermentables + hops with a batch-size scaler and a BeerXML download of the
// (scaled) recipe. Renders as grid items: a full-width toolbar, then the two
// ingredient sections.
export default function RecipeIngredients({
  recipe,
  baseBatchSize,
  boilTime,
  efficiency,
  sourceUrl,
}: RecipeIngredientsProps) {
  const [input, setInput] = useState(baseBatchSize.toString())
  const parsed = parseFloat(input)
  const target = parsed > 0 && parsed <= 1000 ? parsed : baseBatchSize
  const factor = target / baseBatchSize
  const isScaled = Math.abs(factor - 1) > 1e-9

  const base = useMemo(() => recipeIngredients(recipe), [recipe])
  const { fermentables, hops } = useMemo(
    () => scaleIngredients(base, factor),
    [base, factor]
  )

  const nudge = (delta: number) => {
    const next = Math.max(STEP, Math.round((target + delta) / STEP) * STEP)
    setInput(next.toString())
  }

  const download = () => {
    const xml = recipeToBeerXml(recipe, {
      ingredients: { fermentables, hops },
      batchSizeGal: target,
      boilTime,
      efficiency,
      sourceUrl,
    })
    const url = URL.createObjectURL(
      new Blob([xml], { type: 'application/xml' })
    )
    const a = document.createElement('a')
    a.href = url
    a.download = `${slugify(recipe.name)}${isScaled ? `-${target}gal` : ''}.xml`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      {/* Toolbar */}
      <div className="col-span-full flex flex-wrap items-center justify-between gap-4 border border-border bg-bg-card px-4 py-3">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <label
            htmlFor="batch-size"
            className="text-xs uppercase tracking-widest text-lavender"
          >
            Scale to
          </label>
          <div className="flex items-center border border-border">
            <button
              type="button"
              onClick={() => nudge(-STEP)}
              className="px-2.5 py-1 text-text-secondary transition-colors hover:text-accent"
              aria-label="Decrease batch size"
            >
              &minus;
            </button>
            <input
              id="batch-size"
              type="number"
              inputMode="decimal"
              min={STEP}
              step={STEP}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onBlur={() => setInput(target.toString())}
              className="w-16 border-x border-border bg-transparent py-1 text-center tabular-nums text-text-primary [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <button
              type="button"
              onClick={() => nudge(STEP)}
              className="px-2.5 py-1 text-text-secondary transition-colors hover:text-accent"
              aria-label="Increase batch size"
            >
              +
            </button>
          </div>
          <span className="text-text-secondary">gal</span>
          {isScaled && (
            <button
              type="button"
              onClick={() => setInput(baseBatchSize.toString())}
              className="text-xs text-lavender transition-colors hover:text-accent"
            >
              Reset to {baseBatchSize} gal
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={download}
          className="border border-accent px-3 py-1.5 text-xs uppercase tracking-widest text-accent transition-colors hover:bg-accent hover:text-bg-dark"
        >
          Download BeerXML
        </button>
      </div>

      {/* Fermentables */}
      <div>
        <SectionTitle>Fermentables</SectionTitle>
        {fermentables.length > 0 ? (
          <ul className="space-y-2">
            {fermentables.map((f, idx) => (
              <li key={idx} className="flex justify-between gap-4 text-sm">
                <span className="text-text-secondary">{f.name}</span>
                <span className="shrink-0 tabular-nums text-text-primary">
                  {f.amount.toFixed(2)} lb
                  {f.percentage !== undefined && (
                    <span className="ml-2 text-lavender-dark">
                      ({f.percentage.toFixed(1)}%)
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm italic text-text-secondary">No fermentables</p>
        )}
      </div>

      {/* Hops */}
      <div>
        <SectionTitle>Hops</SectionTitle>
        {hops.length > 0 ? (
          <ul className="space-y-2">
            {hops.map((h, idx) => (
              <li key={idx} className="flex justify-between gap-4 text-sm">
                <span className="text-text-secondary">
                  {h.name}
                  {h.alpha !== undefined && (
                    <span className="ml-1 text-lavender-dark">
                      ({h.alpha}% AA)
                    </span>
                  )}
                </span>
                <span className="shrink-0 tabular-nums text-text-primary">
                  {h.amount.toFixed(2)} oz @ {h.use}
                  {h.time !== undefined && h.time > 0 && ` ${h.time} min`}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm italic text-text-secondary">No hops</p>
        )}
      </div>
    </>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 text-xs uppercase tracking-widest text-lavender">
      {children}
    </h3>
  )
}
