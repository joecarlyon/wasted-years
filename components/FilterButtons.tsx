'use client'

import { useState } from 'react'
import { Recipe } from '@/types'
import RecipeCard from './RecipeCard'

interface FilterButtonsProps {
  recipes: Recipe[]
}

type FilterType = 'all' | 'ale' | 'lager' | 'spirit'

export default function FilterButtons({ recipes }: FilterButtonsProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')

  const filters: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Ales', value: 'ale' },
    { label: 'Lagers', value: 'lager' },
    { label: 'Spirits', value: 'spirit' },
  ]

  const filteredRecipes =
    activeFilter === 'all'
      ? recipes
      : recipes.filter((recipe) => recipe.category === activeFilter)

  const buttonClasses = (isActive: boolean) => {
    const base =
      'px-4 py-2 text-sm uppercase tracking-wide border transition-all duration-300 cursor-pointer'
    return isActive
      ? `${base} bg-accent border-accent text-bg-dark`
      : `${base} bg-bg-card border-border text-text-secondary hover:border-accent hover:text-text-primary`
  }

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
            className={buttonClasses(activeFilter === filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {filteredRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>

      {filteredRecipes.length === 0 && (
        <div className="border border-dashed border-border py-12 text-center text-text-secondary">
          <p>No recipes found for this filter.</p>
        </div>
      )}
    </>
  )
}
