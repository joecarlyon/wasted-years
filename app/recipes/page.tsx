import { recipes } from '@/data/recipes'
import FilterButtons from '@/components/FilterButtons'

export default function RecipesPage() {
  const totalGallons = recipes.reduce((sum, r) => sum + (r.batchSize || 0), 0)

  return (
    <main className="mx-auto max-w-6xl px-8 py-8">
      <div className="mb-8 border-b border-border py-8 text-center">
        <h2 className="mb-2 text-3xl uppercase tracking-widest">Recipes</h2>
        <p className="text-text-secondary">
          {recipes.length} recipes &middot; {Math.round(totalGallons)} gallons
        </p>
      </div>

      <FilterButtons recipes={recipes} />
    </main>
  )
}
