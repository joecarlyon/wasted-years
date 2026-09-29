import { test } from 'node:test'
import assert from 'node:assert/strict'
import { entriesByRecipe, recipeAwards } from '@/lib/competitions'
import { Batch, CompetitionEntry, Recipe } from '@/types'

const recipes = [
  { uuid: 'overlord', name: 'Overlord', source: 'beersmith' },
  { uuid: 'joe', name: 'Joeoverlord', source: 'brewfather' },
] as Recipe[]

const batches = [
  { batchNo: 1, name: 'Overlord', source: 'beersmith' },
  { batchNo: 2, name: 'Joeoverlord', source: 'brewfather' },
] as Batch[]

function entry(
  batchNo: number,
  year: number,
  placement?: string
): CompetitionEntry {
  return {
    batchNo,
    year,
    competition: `NHC ${year}`,
    placement,
  } as CompetitionEntry
}

const entries = [
  entry(1, 2024, 'Mini B.O.S. (Bronze)'),
  entry(1, 2025),
  entry(2, 2025, 'Mini B.O.S. (Silver)'),
]

test('entries group under the recipe their batch brewed', () => {
  const byRecipe = entriesByRecipe(entries, batches, recipes)
  assert.deepEqual(
    byRecipe.get('overlord')?.map((e) => e.year),
    [2024, 2025]
  )
  assert.deepEqual(
    byRecipe.get('joe')?.map((e) => e.year),
    [2025]
  )
})

test('only placings that name a medal become awards, newest first', () => {
  const awards = recipeAwards(
    [...entries, entry(1, 2026, 'Mini B.O.S. (Gold)')],
    batches,
    recipes
  )
  assert.deepEqual(awards.overlord, [
    { competition: 'NHC 2026', medal: 'gold', placement: '1st Place' },
    { competition: 'NHC 2024', medal: 'bronze', placement: '3rd Place' },
  ])
  assert.deepEqual(awards.joe, [
    { competition: 'NHC 2025', medal: 'silver', placement: '2nd Place' },
  ])
})
