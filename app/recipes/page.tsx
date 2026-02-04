import { recipes } from '@/data/recipes'
import FilterButtons from '@/components/FilterButtons'

export default function RecipesPage() {
  return (
    <main className="mx-auto max-w-6xl px-8 py-8">
      <div className="mb-8 border-b border-border py-8 text-center">
        <h2 className="mb-2 text-3xl uppercase tracking-widest">Recipes</h2>
        <p className="text-text-secondary">
          Our collection of homebrewing recipes
        </p>
      </div>

      <FilterButtons recipes={recipes} />
    </main>
  )
}
