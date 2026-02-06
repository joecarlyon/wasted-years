import Link from 'next/link'
import { Recipe } from '@/types'
import { awardWinningRecipes } from '@/data/competitions'

interface RecipeCardProps {
  recipe: Recipe
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const awards = awardWinningRecipes[recipe.name]

  return (
    <Link
      href={`/recipes/${recipe.uuid}`}
      className={`block border bg-bg-card p-6 transition-all duration-300 hover:border-accent hover:bg-bg-hover ${awards ? 'border-accent/40' : 'border-border'}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="mb-1 text-xl text-text-primary">{recipe.name}</h4>
          <p className="mb-4 text-sm uppercase tracking-wide text-accent">
            {recipe.style}
          </p>
        </div>
        {awards && (
          <div className="flex gap-3">
            {awards.map((award, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <div
                  className="rounded-full p-2"
                  style={{
                    backgroundColor:
                      award.medal === 'silver'
                        ? 'rgba(192,192,192,0.15)'
                        : 'rgba(205,127,50,0.15)',
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-6 w-6"
                    style={{
                      color:
                        award.medal === 'silver' ? '#C0C0C0' : '#CD7F32',
                    }}
                  >
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                </div>
                <span
                  className="text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    color:
                      award.medal === 'silver' ? '#C0C0C0' : '#CD7F32',
                  }}
                >
                  {award.placement}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      <p className="mb-1 text-sm text-text-secondary">{recipe.description}</p>

      <div className="mb-4 grid grid-cols-5 gap-2 border-b border-t border-border py-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-lavender">
            {recipe.og.toFixed(3)}
          </div>
          <div className="text-xs uppercase tracking-wide text-text-secondary">
            OG
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-lavender">
            {recipe.fg.toFixed(3)}
          </div>
          <div className="text-xs uppercase tracking-wide text-text-secondary">
            FG
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-accent">
            {recipe.abv.toFixed(1)}%
          </div>
          <div className="text-xs uppercase tracking-wide text-text-secondary">
            ABV
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-accent">{recipe.ibu}</div>
          <div className="text-xs uppercase tracking-wide text-text-secondary">
            IBU
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-text-primary">
            {recipe.batchSize ? `${recipe.batchSize}g` : '—'}
          </div>
          <div className="text-xs uppercase tracking-wide text-text-secondary">
            Size
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {recipe.grains.length > 0 && (
          <div>
            <h5 className="mb-2 text-xs uppercase tracking-wide text-lavender-dark">
              Grains
            </h5>
            <ul className="text-sm text-text-secondary">
              {recipe.grains.slice(0, 4).map((grain, idx) => (
                <li
                  key={idx}
                  className="relative py-1 pl-4 before:absolute before:left-0 before:text-xs before:text-accent before:content-['//']"
                >
                  {grain}
                </li>
              ))}
              {recipe.grains.length > 4 && (
                <li className="py-1 pl-4 italic text-lavender-dark">
                  +{recipe.grains.length - 4} more...
                </li>
              )}
            </ul>
          </div>
        )}

        {recipe.hops.length > 0 && (
          <div>
            <h5 className="mb-2 text-xs uppercase tracking-wide text-lavender-dark">
              Hops
            </h5>
            <ul className="text-sm text-text-secondary">
              {recipe.hops.slice(0, 4).map((hop, idx) => (
                <li
                  key={idx}
                  className="relative py-1 pl-4 before:absolute before:left-0 before:text-xs before:text-accent before:content-['//']"
                >
                  {hop}
                </li>
              ))}
              {recipe.hops.length > 4 && (
                <li className="py-1 pl-4 italic text-lavender-dark">
                  +{recipe.hops.length - 4} more...
                </li>
              )}
            </ul>
          </div>
        )}

        <div>
          <h5 className="mb-2 text-xs uppercase tracking-wide text-lavender-dark">
            Yeast
          </h5>
          <p className="relative pl-4 text-sm text-text-secondary before:absolute before:left-0 before:text-xs before:text-accent before:content-['//']">
            {recipe.yeast}
          </p>
        </div>
      </div>
    </Link>
  )
}
