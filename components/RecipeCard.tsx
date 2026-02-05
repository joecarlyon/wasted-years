import Link from 'next/link'
import { Recipe } from '@/types'

interface RecipeCardProps {
  recipe: Recipe
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link
      href={`/recipes/${recipe.uuid}`}
      className="block border border-border bg-bg-card p-6 transition-all duration-300 hover:border-accent hover:bg-bg-hover"
    >
      <h4 className="mb-1 text-xl text-text-primary">{recipe.name}</h4>
      <p className="mb-4 text-sm uppercase tracking-wide text-accent">
        {recipe.style}
      </p>
      <p className="mb-4 text-sm text-text-secondary">{recipe.description}</p>

      <div className="mb-4 grid grid-cols-4 gap-2 border-b border-t border-border py-4">
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
