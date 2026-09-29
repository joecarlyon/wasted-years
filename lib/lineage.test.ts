import { test } from 'node:test'
import assert from 'node:assert/strict'
import { diffRecipes, recipeFamily } from '@/lib/lineage'
import { Recipe } from '@/types'

function recipe(uuid: string, overrides: Partial<Recipe> = {}): Recipe {
  return {
    id: 0,
    uuid,
    name: uuid,
    style: 'American IPA',
    category: 'ale',
    description: '',
    og: 1.06,
    fg: 1.012,
    abv: 6.3,
    ibu: 60,
    grains: [],
    hops: [],
    yeast: 'US-05',
    ...overrides,
  }
}

// root ─┬─ a (2024) ── c (2026)
//       └─ b (2025)
// Siblings share a date with their parent in the old BeerSmith data, and the
// newest Brewfather recipes can be undated.
const family = [
  recipe('c', { brewDate: '2026-01-01' }),
  recipe('b', { brewDate: '2025-01-01' }),
  recipe('root', { brewDate: '2015-01-01' }),
  recipe('a', { brewDate: '2024-01-01' }),
  recipe('stranger', { brewDate: '2020-01-01' }),
]
const parents = { a: 'root', b: 'root', c: 'a' }

test('a family lists parents before children, siblings by date', () => {
  const members = recipeFamily('b', family, parents)
  assert.deepEqual(
    members.map((m) => [m.recipe.uuid, m.parent?.uuid]),
    [
      ['root', undefined],
      ['a', 'root'],
      ['c', 'a'],
      ['b', 'root'],
    ]
  )
})

test('undated versions sort after dated siblings', () => {
  const recipes = [
    recipe('root', { brewDate: '2015-03-25' }),
    recipe('newer'), // no brewDate
    recipe('older', { brewDate: '2015-03-25' }),
  ]
  const members = recipeFamily('root', recipes, {
    newer: 'root',
    older: 'root',
  })
  assert.deepEqual(
    members.map((m) => m.recipe.uuid),
    ['root', 'older', 'newer']
  )
})

test('a recipe with no parent or children has no family', () => {
  assert.deepEqual(recipeFamily('stranger', family, parents), [])
})

test('a parent cycle does not loop forever', () => {
  const members = recipeFamily('a', family, { a: 'b', b: 'a' })
  assert.deepEqual(members.map((m) => m.recipe.uuid).sort(), ['a', 'b'])
})

test('grain bill changes compare percentages of the grist', () => {
  const from = recipe('from', {
    grains: ['9.00 lb Pale Malt', '0.50 lb Crystal 40', '0.50 lb Carapils'],
  })
  const to = recipe('to', {
    grains: ['9.50 lb Pale Malt', '0.50 lb Flaked Barley'],
  })
  assert.deepEqual(diffRecipes(from, to).fermentables, [
    { name: 'Pale Malt', from: 90, to: 95 },
    { name: 'Crystal 40', from: 5 },
    { name: 'Carapils', from: 5 },
    { name: 'Flaked Barley', to: 5 },
  ])
})

test('hops compare at the new batch size, grouped by use', () => {
  const from = recipe('from', {
    batchSize: 10,
    hopsDetail: [
      { name: 'Citra', amount: 2, use: 'Boil', time: 60 },
      { name: 'Citra', amount: 2, use: 'Boil', time: 10 },
      { name: 'Citra', amount: 4, use: 'Dry Hop' },
      { name: 'Cascade', amount: 1, use: 'Aroma', time: 10 },
    ],
  })
  const to = recipe('to', {
    batchSize: 5,
    hopsDetail: [
      { name: 'Citra', amount: 2, use: 'Boil', time: 45 }, // 4 oz/10 gal → same
      { name: 'Citra', amount: 3, use: 'Dry Hop' }, // was 2 oz at 5 gal
      { name: 'Simcoe', amount: 1, use: 'Aroma', time: 10 },
    ],
  })
  const diff = diffRecipes(from, to)
  assert.equal(diff.scaledTo, 5)
  assert.deepEqual(diff.hops, [
    { name: 'Citra (Dry Hop)', from: 2, to: 3 },
    { name: 'Cascade (Aroma)', from: 0.5 },
    { name: 'Simcoe (Aroma)', to: 1 },
  ])
})

test('only vitals that changed at display precision are listed', () => {
  const from = recipe('from', { og: 1.064, fg: 1.012, abv: 6.8, ibu: 66 })
  const to = recipe('to', { og: 1.0642, fg: 1.016, abv: 6.3, ibu: 71 })
  assert.deepEqual(diffRecipes(from, to).vitals, [
    { label: 'FG', from: '1.012', to: '1.016' },
    { label: 'ABV', from: '6.8%', to: '6.3%' },
    { label: 'IBU', from: '66', to: '71' },
  ])
})

test('yeast and water changes', () => {
  const from = recipe('from', {
    yeast: 'West Coast IV',
    waterProfile: { calcium: 60, sulfate: 150, chloride: 70 },
  })
  const to = recipe('to', {
    yeast: 'Something else',
    yeastDetail: { name: 'West Coast Ale I' },
    waterProfile: { calcium: 144, sulfate: 298, chloride: 70 },
  })
  const diff = diffRecipes(from, to)
  assert.deepEqual(diff.yeast, {
    from: 'West Coast IV',
    to: 'West Coast Ale I',
  })
  assert.deepEqual(diff.water, [
    { label: 'Ca', from: 60, to: 144 },
    { label: 'SO4', from: 150, to: 298 },
  ])
})

test('moving a recipe from BeerSmith to Brewfather is not a change', () => {
  const from = recipe('from', {
    grains: ['10.00 lb Pale Malt (2 Row) US', '1.00 lb Cara-Pils/Dextrine'],
    hops: ['1.0 oz Amarillo Gold (Boil)', '1.0 oz Columbus (Dry Hop)'],
    yeast: 'Wyeast Labs 1010 American Wheat Ale',
  })
  const to = recipe('to', {
    fermentablesDetail: [
      { name: 'Pale Ale Malt 2-Row', amount: 10 },
      { name: 'Carapils', amount: 1 },
    ],
    hopsDetail: [
      { name: 'Amarillo', amount: 1, use: 'Boil', time: 60 },
      { name: 'Columbus (Tomahawk)', amount: 1, use: 'Dry Hop' },
    ],
    yeastDetail: { name: 'American Wheat', lab: 'Wyeast' },
  })
  const diff = diffRecipes(from, to)
  assert.deepEqual([diff.fermentables, diff.hops], [[], []])
  assert.equal(diff.yeast, undefined)
})

test('identical recipes have nothing to report', () => {
  const diff = diffRecipes(recipe('a'), recipe('b'))
  assert.equal(diff.scaledTo, undefined)
  assert.equal(diff.yeast, undefined)
  assert.deepEqual(
    [diff.vitals, diff.fermentables, diff.hops, diff.water],
    [[], [], [], []]
  )
})
