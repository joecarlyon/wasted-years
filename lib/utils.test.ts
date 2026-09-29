import { test } from 'node:test'
import assert from 'node:assert/strict'
import { findMatchingRecipe } from '@/lib/utils'
import { Recipe } from '@/types'

function recipe(uuid: string, name: string, source?: Recipe['source']) {
  return { uuid, name, source } as Recipe
}

const recipes = [
  recipe('overlord', 'Overlord', 'beersmith'),
  recipe('overlord-v31', 'Overlord v3.1', 'brewfather'),
  recipe('saurus', 'Strawberry Saurus-Rex', 'beersmith'),
]

test('matches a batch to the recipe it is named after', () => {
  const batch = { batchNo: 500, name: 'Overlord', source: 'beersmith' as const }
  assert.equal(findMatchingRecipe(batch, recipes)?.uuid, 'overlord')
})

test('an explicit link overrides name matching', () => {
  // By name alone "Overlord v3" extends "Overlord", not "Overlord v3.1"
  const batch = {
    batchNo: 91,
    name: 'Overlord v3',
    source: 'brewfather' as const,
  }
  const links = { 91: 'overlord-v31' }
  assert.equal(findMatchingRecipe(batch, recipes, links)?.uuid, 'overlord-v31')
})

test('an explicit link rescues a batch whose name matches nothing', () => {
  const batch = {
    batchNo: 27,
    name: 'Strawberrysaurus Rex',
    source: 'beersmith' as const,
  }
  assert.equal(findMatchingRecipe(batch, recipes, {}), undefined)
  assert.equal(
    findMatchingRecipe(batch, recipes, { 27: 'saurus' })?.uuid,
    'saurus'
  )
})

test('a link to a recipe that no longer exists falls back to the name', () => {
  const batch = { batchNo: 500, name: 'Overlord', source: 'beersmith' as const }
  assert.equal(
    findMatchingRecipe(batch, recipes, { 500: 'gone' })?.uuid,
    'overlord'
  )
})
