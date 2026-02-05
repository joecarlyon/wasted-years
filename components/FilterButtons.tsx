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
  const [searchQuery, setSearchQuery] = useState('')

  const filters: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Ales', value: 'ale' },
    { label: 'Lagers', value: 'lager' },
    { label: 'Spirits', value: 'spirit' },
  ]

  const filteredRecipes = recipes.filter((recipe) => {
    // Category filter
    if (activeFilter !== 'all' && recipe.category !== activeFilter) {
      return false
    }
    // Search filter - searches all fields shown on recipe card
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        recipe.name.toLowerCase().includes(query) ||
        recipe.style.toLowerCase().includes(query) ||
        recipe.description.toLowerCase().includes(query) ||
        recipe.yeast.toLowerCase().includes(query) ||
        recipe.grains.some((g) => g.toLowerCase().includes(query)) ||
        recipe.hops.some((h) => h.toLowerCase().includes(query)) ||
        recipe.og.toFixed(3).includes(query) ||
        recipe.fg.toFixed(3).includes(query) ||
        recipe.abv.toFixed(1).includes(query) ||
        String(recipe.ibu).includes(query) ||
        (recipe.batchSize && `${recipe.batchSize}g`.includes(query))
      )
    }
    return true
  })

  const buttonClasses = (isActive: boolean) => {
    const base =
      'px-4 py-2 text-sm uppercase tracking-wide border transition-all duration-300 cursor-pointer'
    return isActive
      ? `${base} bg-accent border-accent text-bg-dark`
      : `${base} bg-bg-card border-border text-text-secondary hover:border-accent hover:text-text-primary`
  }

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
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
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border border-border bg-bg-card px-4 py-2 text-text-primary placeholder-text-secondary focus:border-accent focus:outline-none sm:w-64"
        />
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
