import { test } from 'node:test'
import assert from 'node:assert/strict'
import { recipes } from '@/data/recipes'
import { batches } from '@/data/batches'
import { batchRecipeLinks } from '@/data/recipe-links'
import { recipeParents } from '@/data/lineage'

// The hand-maintained files reference recipes by UUID. A sync that renames a
// recipe changes its UUID, which would otherwise quietly unlink the batch.
const recipeUuids = new Set(recipes.map((r) => r.uuid))
const batchNos = new Set(batches.map((b) => b.batchNo))

test('every lineage entry links two existing recipes', () => {
  for (const [child, parent] of Object.entries(recipeParents)) {
    assert.ok(recipeUuids.has(child), `unknown child ${child}`)
    assert.ok(recipeUuids.has(parent), `${child} → unknown parent ${parent}`)
  }
})

test('every batch link points at an existing batch and recipe', () => {
  for (const [batchNo, uuid] of Object.entries(batchRecipeLinks)) {
    assert.ok(batchNos.has(Number(batchNo)), `no batch #${batchNo}`)
    assert.ok(recipeUuids.has(uuid), `batch #${batchNo} → unknown ${uuid}`)
  }
})
