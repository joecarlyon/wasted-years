import { recipes } from '@/data/recipes'
import { batches } from '@/data/batches'
import { competitions } from '@/data/competitions'
import { recipeAwards } from '@/lib/competitions'
import FilterButtons from '@/components/FilterButtons'

export default function RecipesPage() {
  const totalGallons = recipes.reduce((sum, r) => sum + (r.batchSize || 0), 0)
  // Computed here so the client filter doesn't ship the whole brew log
  const awards = recipeAwards(competitions, batches, recipes)

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-8">
      <div className="mb-8 border-b border-border py-8 text-center">
        <h2 className="mb-2 text-3xl uppercase tracking-widest text-accent">
          Recipes
        </h2>
        <p className="text-text-secondary">
          {recipes.length} recipes &middot; {Math.round(totalGallons)} gallons
        </p>
      </div>

      <FilterButtons recipes={recipes} awards={awards} />
    </main>
  )
}
