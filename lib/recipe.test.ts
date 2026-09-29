import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ingredientKey } from '@/lib/recipe'

function same(...names: string[]) {
  const keys = new Set(names.map(ingredientKey))
  assert.equal(
    keys.size,
    1,
    `${names.join(' / ')} → ${Array.from(keys).join(', ')}`
  )
}

test('BeerSmith and Brewfather names for the same malt share a key', () => {
  same(
    'Pale Malt (2 Row) US',
    'Pale Ale Malt 2-Row',
    'Pale Malt - 2 Row (Cargill)',
    'Pale Malt, 2-Row (Rahr)',
    'Brewers Malt 2-Row (Briess)'
  )
  same(
    'Caramel/Crystal Malt - 20L',
    'Caramel Malt 20L',
    'Caramel Malt - 20L (Briess)'
  )
  same('Crystal 60L', 'Caramel Malt 60L')
  same('Cara-Pils/Dextrine', 'Carapils', 'Carapils (Briess)', 'Carapils Malt')
  same('Chocolate Malt', 'Chocolate', 'Chocolate (Briess)')
  same('Barley, Flaked', 'Barley, Flaked (Briess)', 'Flaked Barley')
  same('White Wheat Malt', 'Wheat White Malt', 'Wheat - White Malt (Briess)')
  same('Melanoiden Malt', 'Melanoidin')
})

test('and for the same hop', () => {
  same('Amarillo', 'Amarillo Gold')
  same('Columbus', 'Columbus (Tomahawk)')
  same('Goldings, East Kent', 'East Kent Goldings', 'East Kent Goldings (EKG)')
  same('Hallertau', 'Hallertauer')
  same('Fuggle', 'Fuggles')
})

test('genuinely different ingredients stay apart', () => {
  const keys = [
    'Wheat Malt, Ger',
    'White Wheat Malt',
    'Munich Malt',
    'Munich II',
    'Caramel Malt 20L',
    'Caramel Malt 60L',
    'Hallertau Blanc',
    'Hallertau',
  ].map(ingredientKey)
  assert.equal(new Set(keys).size, keys.length)
})
