import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  beerRecords,
  brewsByMonth,
  brewsByYear,
  efficiencyTrend,
  mostBrewed,
  topIngredients,
  topYeasts,
  yeastLabel,
} from '@/lib/stats'
import { Batch, Recipe } from '@/types'

function batch(batchNo: number, overrides: Partial<Batch> = {}): Batch {
  return {
    batchNo,
    name: `Batch ${batchNo}`,
    style: 'American IPA',
    category: 'ale',
    brewer: 'Joe',
    status: 'Completed',
    brewDate: '',
    bottlingDate: '',
    og: 1.06,
    fg: 1.012,
    abv: 6.3,
    ibu: 60,
    color: 6,
    efficiency: 0,
    batchSize: 5,
    fermentables: [],
    hops: [],
    yeast: [],
    ...overrides,
  }
}

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
    yeast: 'Not specified',
    ...overrides,
  }
}

test('brews per year fills in the years nothing was brewed', () => {
  const { years, undated } = brewsByYear([
    batch(1),
    batch(2, { brewDate: '2015-03-01' }),
    batch(3, { brewDate: '2015-09-01' }),
    batch(4, { brewDate: '2018-01-01' }),
  ])
  assert.deepEqual(years, [
    { label: '2015', count: 2 },
    { label: '2016', count: 0 },
    { label: '2017', count: 0 },
    { label: '2018', count: 1 },
  ])
  assert.equal(undated, 1)
})

test('brews per month covers the whole calendar', () => {
  const months = brewsByMonth([
    batch(1, { brewDate: '2015-03-01' }),
    batch(2, { brewDate: '2022-03-20' }),
    batch(3, { brewDate: '2023-12-01' }),
  ])
  assert.equal(months.length, 12)
  assert.deepEqual(months[2], { label: 'Mar', count: 2 })
  assert.deepEqual(months[11], { label: 'Dec', count: 1 })
  assert.equal(months[0].count, 0)
})

test('efficiency trend skips spirit washes and batches without a reading', () => {
  const trend = efficiencyTrend(
    [
      batch(1, { efficiency: 55 }),
      batch(2),
      batch(3, { efficiency: 124, category: 'spirit' }),
      batch(4, { efficiency: 64.5, mashEfficiency: 70.5 }),
    ],
    []
  )
  assert.deepEqual(
    trend.map((t) => [t.batchNo, t.brew, t.mash]),
    [
      [1, 55, undefined],
      [4, 64.5, 70.5],
    ]
  )
})

test('ingredient counts merge renamed ingredients and fall back to the recipe', () => {
  const recipes = [
    recipe('r', {
      name: 'Legacy',
      hops: ['1.0 oz Amarillo Gold (Boil)', '1.0 oz Amarillo Gold (Dry Hop)'],
    }),
  ]
  const batches = [
    batch(1, { name: 'Legacy' }), // no hops of its own → the recipe's
    batch(2, {
      hops: [
        { name: 'Amarillo', amount: 1, usage: 'Boil' },
        { name: 'Citra', amount: 1, usage: 'Boil' },
      ],
    }),
    batch(3, { hops: [{ name: 'Amarillo', amount: 1, usage: 'Boil' }] }),
  ]
  assert.deepEqual(topIngredients(batches, recipes, 'hops', 5), [
    { name: 'Amarillo', count: 3 },
    { name: 'Citra', count: 1 },
  ])
})

test('yeast labels drop the lab and product number', () => {
  assert.equal(yeastLabel('Wyeast Labs 1056 American Ale'), 'American Ale')
  assert.equal(yeastLabel('White Labs WLP002 English Ale'), 'English Ale')
  assert.equal(
    yeastLabel('DCL/Fermentis US-05 Safale American'),
    'US-05 Safale American'
  )
  assert.equal(yeastLabel('Wyeast Labs 1028 London Ale Yeast'), 'London Ale')
  assert.equal(yeastLabel('West Coast IV'), 'West Coast IV')
})

test('yeast counts combine batch and recipe names for the same strain', () => {
  const recipes = [
    recipe('r', { name: 'Legacy', yeast: 'Wyeast Labs 1056 American Ale' }),
  ]
  const batches = [
    batch(1, { name: 'Legacy' }),
    batch(2, {
      yeast: [{ name: 'American Ale', laboratory: 'Wyeast', productId: '' }],
    }),
    batch(3), // no yeast, no recipe
  ]
  assert.deepEqual(topYeasts(batches, recipes, 5), [
    { name: 'American Ale', count: 2 },
  ])
})

test('most brewed groups a recipe family and links its newest version', () => {
  const recipes = [
    recipe('ol', { name: 'Overlord', brewDate: '2015-01-01' }),
    recipe('ol4', { name: 'Overlord v4', brewDate: '2026-01-01' }),
    recipe('milk', { name: 'Milk Stout-OG', brewDate: '2015-01-01' }),
    recipe('moo', { name: 'Moo Moo Canoe', brewDate: '2015-02-01' }),
    recipe('moo2', { name: 'Moo Moo Canoe' }), // undated Brewfather copy
    recipe('zd', { name: 'Zombie Dust' }),
  ]
  const parents = { ol4: 'ol', moo: 'milk', moo2: 'moo' }
  const batches = [
    batch(1, { name: 'Overlord' }),
    batch(2, { name: 'Overlord v4' }),
    batch(3, { name: 'Overlord v4' }),
    batch(4, { name: 'Moo Moo Canoe', source: 'beersmith' }),
    batch(5, { name: 'Zombie Dust' }),
  ]
  recipes.find((r) => r.uuid === 'moo')!.source = 'beersmith'
  assert.deepEqual(mostBrewed(batches, recipes, 5, parents), [
    { name: 'Overlord', uuid: 'ol4', brews: 3, versions: 2 },
    { name: 'Moo Moo Canoe', uuid: 'moo2', brews: 1, versions: 3 },
    { name: 'Zombie Dust', uuid: 'zd', brews: 1, versions: 1 },
  ])
})

test('records are beer only', () => {
  const records = beerRecords(
    [
      batch(1, { abv: 9, ibu: 115, color: 5 }),
      batch(2, { abv: 18.4, ibu: 40, color: 60 }),
      batch(3, { abv: 20, color: 80, category: 'spirit' }),
      batch(4, { abv: 5, ibu: null, color: 3, mashEfficiency: 84.2 }),
    ],
    []
  )
  assert.deepEqual(
    {
      strongest: [records.strongest?.batch.batchNo, records.strongest?.value],
      bitterest: [records.bitterest?.batch.batchNo, records.bitterest?.value],
      darkest: [records.darkest?.batch.batchNo, records.darkest?.value],
      bestMash: [records.bestMash?.batch.batchNo, records.bestMash?.value],
    },
    {
      strongest: [2, 18.4],
      bitterest: [1, 115],
      darkest: [2, 60],
      bestMash: [4, 84.2],
    }
  )
})
