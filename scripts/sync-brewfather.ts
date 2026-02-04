/**
 * Sync recipes and batches from Brewfather API
 *
 * Setup:
 * 1. Go to Brewfather Settings → API → Generate API Key
 * 2. Create a .env.local file with:
 *    BREWFATHER_USER_ID=your_user_id
 *    BREWFATHER_API_KEY=your_api_key
 *
 * Usage:
 *   npx tsx scripts/sync-brewfather.ts
 */

import * as fs from 'fs'
import * as path from 'path'

const BREWFATHER_API = 'https://api.brewfather.app/v2'

// Load env vars from .env.local
function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local')
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8')
    for (const line of content.split('\n')) {
      const [key, ...valueParts] = line.split('=')
      if (key && valueParts.length) {
        process.env[key.trim()] = valueParts.join('=').trim()
      }
    }
  }
}

loadEnv()

const USER_ID = process.env.BREWFATHER_USER_ID
const API_KEY = process.env.BREWFATHER_API_KEY

if (!USER_ID || !API_KEY) {
  console.error(
    'Missing BREWFATHER_USER_ID or BREWFATHER_API_KEY in .env.local'
  )
  process.exit(1)
}

const AUTH = Buffer.from(`${USER_ID}:${API_KEY}`).toString('base64')

interface BrewfatherFermentable {
  name: string
  amount: number
}

interface BrewfatherHop {
  name: string
  amount: number
  use: string
}

interface BrewfatherYeast {
  name: string
  laboratory: string
  productId: string
}

interface BrewfatherBatch {
  _id: string
  batchNo: number
  name: string
  status: string
  brewDate: number
  bottlingDate?: number
  measuredOg: number
  measuredFg: number
  measuredAbv: number
  estimatedIbu: number
  estimatedColor: number
  measuredEfficiency: number
  measuredBatchSize: number
  recipe: {
    name?: string
    style?: { name: string; category?: string }
    fermentables?: BrewfatherFermentable[]
    hops?: BrewfatherHop[]
    yeasts?: BrewfatherYeast[]
  }
}

interface BrewfatherRecipe {
  _id: string
  name: string
  style?: { name: string; category?: string }
  og: number
  fg: number
  abv: number
  ibu: number
  fermentables?: BrewfatherFermentable[]
  hops?: BrewfatherHop[]
  yeasts?: BrewfatherYeast[]
  notes?: string
}

async function fetchAll<T>(endpoint: string): Promise<T[]> {
  const results: T[] = []
  let offset = 0
  const limit = 50

  while (true) {
    const url = `${BREWFATHER_API}/${endpoint}?complete=true&limit=${limit}&start_after=${offset > 0 ? results[results.length - 1] : ''}`
    const response = await fetch(
      `${BREWFATHER_API}/${endpoint}?complete=true&limit=${limit}&offset=${offset}`,
      {
        headers: {
          Authorization: `Basic ${AUTH}`,
        },
      }
    )

    if (!response.ok) {
      if (response.status === 429) {
        console.log('Rate limited, waiting 60 seconds...')
        await new Promise((r) => setTimeout(r, 60000))
        continue
      }
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const data = (await response.json()) as T[]
    if (data.length === 0) break

    results.push(...data)
    if (data.length < limit) break
    offset += limit

    // Be nice to the API
    await new Promise((r) => setTimeout(r, 500))
  }

  return results
}

// Convert grams to ounces
const GRAMS_PER_OZ = 28.3495

function gramsToOz(grams: number): number {
  return Math.round((grams / GRAMS_PER_OZ) * 100) / 100
}

function roundTo(num: number, decimals: number): number {
  const factor = Math.pow(10, decimals)
  return Math.round(num * factor) / factor
}

function mapHopUsage(use: string): 'Bittering' | 'Aroma' | 'Both' {
  const lower = use?.toLowerCase() || ''
  if (
    lower.includes('boil') ||
    lower === 'bittering' ||
    lower === 'first wort'
  ) {
    return 'Bittering'
  }
  if (
    lower.includes('dry') ||
    lower.includes('whirlpool') ||
    lower === 'aroma'
  ) {
    return 'Aroma'
  }
  return 'Both'
}

// Infer style from recipe name when style is "Unknown"
function inferStyle(style: string, name: string): string {
  if (style !== 'Unknown') return style

  const lowerName = name.toLowerCase()
  if (lowerName.includes('rum')) return 'Rum'
  if (lowerName.includes('vodka')) return 'Vodka'
  if (lowerName.includes('whiskey') || lowerName.includes('bourbon'))
    return 'Whiskey'
  if (lowerName.includes('gin')) return 'Gin'

  return style
}

// Load existing data to preserve manual edits
function loadExistingBatches(): Map<number, Record<string, unknown>> {
  const batchesPath = path.join(process.cwd(), 'data/batches.ts')
  if (!fs.existsSync(batchesPath)) return new Map()

  const content = fs.readFileSync(batchesPath, 'utf-8')
  // Extract the JSON array from the TypeScript file
  const match = content.match(/export const batches: Batch\[\] = (\[[\s\S]*\])/)
  if (!match) return new Map()

  try {
    const batches = JSON.parse(match[1]) as Record<string, unknown>[]
    const map = new Map<number, Record<string, unknown>>()
    for (const batch of batches) {
      if (typeof batch.batchNo === 'number') {
        map.set(batch.batchNo, batch)
      }
    }
    return map
  } catch {
    return new Map()
  }
}

function loadExistingRecipes(): Map<string, Record<string, unknown>> {
  const recipesPath = path.join(process.cwd(), 'data/recipes.ts')
  if (!fs.existsSync(recipesPath)) return new Map()

  const content = fs.readFileSync(recipesPath, 'utf-8')
  const match = content.match(
    /export const recipes: Recipe\[\] = (\[[\s\S]*\])/
  )
  if (!match) return new Map()

  try {
    const recipes = JSON.parse(match[1]) as Record<string, unknown>[]
    const map = new Map<string, Record<string, unknown>>()
    for (const recipe of recipes) {
      if (typeof recipe.name === 'string') {
        map.set(recipe.name, recipe)
      }
    }
    return map
  } catch {
    return new Map()
  }
}

// Merge new batch data with existing, preserving manual edits
function mergeBatch(
  newBatch: Record<string, unknown>,
  existing: Record<string, unknown> | undefined
): Record<string, unknown> {
  if (!existing) return newBatch

  // Preserve existing values when new values are empty/zero/missing
  return {
    ...newBatch,
    style: newBatch.style !== 'Unknown' ? newBatch.style : existing.style,
    category:
      newBatch.category !== 'Unknown' ? newBatch.category : existing.category,
    og: (newBatch.og as number) > 0 ? newBatch.og : existing.og,
    fg: (newBatch.fg as number) > 0 ? newBatch.fg : existing.fg,
    abv: (newBatch.abv as number) > 0 ? newBatch.abv : existing.abv,
    ibu: newBatch.ibu !== null ? newBatch.ibu : existing.ibu,
    color: (newBatch.color as number) > 0 ? newBatch.color : existing.color,
    efficiency:
      (newBatch.efficiency as number) > 0
        ? newBatch.efficiency
        : existing.efficiency,
    batchSize:
      (newBatch.batchSize as number) > 0
        ? newBatch.batchSize
        : existing.batchSize,
    fermentables:
      (newBatch.fermentables as unknown[]).length > 0
        ? newBatch.fermentables
        : existing.fermentables,
    hops:
      (newBatch.hops as unknown[]).length > 0 ? newBatch.hops : existing.hops,
    yeast:
      (newBatch.yeast as unknown[]).length > 0
        ? newBatch.yeast
        : existing.yeast,
  }
}

function mergeRecipe(
  newRecipe: Record<string, unknown>,
  existing: Record<string, unknown> | undefined
): Record<string, unknown> {
  if (!existing) return newRecipe

  return {
    ...newRecipe,
    id: existing.id, // Preserve existing ID
    style: newRecipe.style !== 'Unknown' ? newRecipe.style : existing.style,
    category:
      newRecipe.category !== 'ale' || existing.category === 'ale'
        ? newRecipe.category
        : existing.category,
    description: (newRecipe.description as string) || existing.description,
    og: (newRecipe.og as number) > 0 ? newRecipe.og : existing.og,
    fg: (newRecipe.fg as number) > 0 ? newRecipe.fg : existing.fg,
    abv: (newRecipe.abv as number) > 0 ? newRecipe.abv : existing.abv,
    ibu: (newRecipe.ibu as number) > 0 ? newRecipe.ibu : existing.ibu,
    grains:
      (newRecipe.grains as unknown[]).length > 0
        ? newRecipe.grains
        : existing.grains,
    hops:
      (newRecipe.hops as unknown[]).length > 0 ? newRecipe.hops : existing.hops,
    yeast:
      newRecipe.yeast !== 'Not specified' ? newRecipe.yeast : existing.yeast,
  }
}

function categorizeRecipe(
  style: string,
  name: string = ''
): 'ale' | 'lager' | 'spirit' {
  const lowerStyle = style.toLowerCase()
  const lowerName = name.toLowerCase()

  // Check both style and name for spirits
  if (
    lowerStyle.includes('vodka') ||
    lowerStyle.includes('whiskey') ||
    lowerStyle.includes('bourbon') ||
    lowerStyle.includes('rum') ||
    lowerStyle.includes('wash') ||
    lowerStyle.includes('spirit') ||
    lowerName.includes('vodka') ||
    lowerName.includes('whiskey') ||
    lowerName.includes('bourbon') ||
    lowerName.includes('rum') ||
    lowerName.includes('wash')
  ) {
    return 'spirit'
  }

  if (
    lowerStyle.includes('lager') ||
    lowerStyle.includes('pilsner') ||
    lowerStyle.includes('helles') ||
    lowerStyle.includes('bock') ||
    lowerStyle.includes('märzen') ||
    lowerStyle.includes('oktoberfest') ||
    lowerStyle.includes('vienna') ||
    lowerStyle.includes('czech')
  ) {
    return 'lager'
  }

  return 'ale'
}

async function syncBatches() {
  console.log('Fetching batches from Brewfather...')
  const batches = await fetchAll<BrewfatherBatch>('batches')
  console.log(`Found ${batches.length} batches`)

  const existingBatches = loadExistingBatches()
  console.log(`Loaded ${existingBatches.size} existing batches for merging`)

  const transformed = batches.map((b) => {
    // Use recipe name if batch name is just "Batch"
    const name =
      b.name && b.name !== 'Batch'
        ? b.name.trim()
        : b.recipe?.name?.trim() || 'Unknown'
    const styleName = inferStyle(b.recipe?.style?.name || 'Unknown', name)
    const category =
      b.recipe?.style?.category || categorizeRecipe(styleName, name)

    const newBatch = {
      batchNo: b.batchNo,
      name,
      style: styleName,
      category,
      brewer: 'Joe',
      status: b.status,
      brewDate: b.brewDate
        ? new Date(b.brewDate).toISOString().split('T')[0]
        : '',
      bottlingDate: b.bottlingDate
        ? new Date(b.bottlingDate).toISOString().split('T')[0]
        : '',
      og: roundTo(b.measuredOg || 0, 3),
      fg: roundTo(b.measuredFg || 0, 3),
      abv: roundTo(b.measuredAbv || 0, 1),
      ibu: b.estimatedIbu ? roundTo(b.estimatedIbu, 0) : null,
      color: roundTo(b.estimatedColor || 0, 1),
      efficiency: roundTo(b.measuredEfficiency || 0, 1),
      batchSize: roundTo(b.measuredBatchSize || 0, 1),
      fermentables: (b.recipe?.fermentables || []).map((f) => ({
        name: f.name,
        amount: roundTo(f.amount, 2),
      })),
      hops: (b.recipe?.hops || []).map((h) => ({
        name: h.name,
        amount: gramsToOz(h.amount),
        usage: mapHopUsage(h.use),
      })),
      yeast: (b.recipe?.yeasts || []).map((y) => ({
        name: y.name,
        laboratory: y.laboratory || '',
        productId: y.productId || '',
      })),
    }

    // Merge with existing data to preserve manual edits
    return mergeBatch(newBatch, existingBatches.get(b.batchNo))
  })

  const content = `import { Batch } from '@/types'

export const batches: Batch[] = ${JSON.stringify(transformed, null, 2)}
`

  fs.writeFileSync(path.join(process.cwd(), 'data/batches.ts'), content)
  console.log(`Wrote ${transformed.length} batches to data/batches.ts`)
}

async function syncRecipes() {
  console.log('Fetching recipes from Brewfather...')
  const recipes = await fetchAll<BrewfatherRecipe>('recipes')
  console.log(`Found ${recipes.length} recipes`)

  const existingRecipes = loadExistingRecipes()
  console.log(`Loaded ${existingRecipes.size} existing recipes for merging`)

  const transformed = recipes.map((r, idx) => {
    const name = r.name.trim()
    const styleName = inferStyle(r.style?.name || 'Unknown', name)

    const newRecipe = {
      id: idx + 1,
      name,
      style: styleName,
      category: categorizeRecipe(styleName, name),
      description: r.notes || '',
      og: roundTo(r.og || 0, 3),
      fg: roundTo(r.fg || 0, 3),
      abv: roundTo(r.abv || 0, 1),
      ibu: roundTo(r.ibu || 0, 0),
      grains: (r.fermentables || []).map(
        (f) => `${roundTo(f.amount, 2)} lb ${f.name}`
      ),
      hops: (r.hops || []).map(
        (h) => `${gramsToOz(h.amount)} oz ${h.name} (${h.use || 'Boil'})`
      ),
      yeast:
        r.yeasts && r.yeasts.length > 0
          ? `${r.yeasts[0].name}${r.yeasts[0].productId ? ` (${r.yeasts[0].productId})` : ''}`
          : 'Not specified',
    }

    return mergeRecipe(newRecipe, existingRecipes.get(name))
  })

  const content = `import { Recipe } from '@/types'

export const recipes: Recipe[] = ${JSON.stringify(transformed, null, 2)}
`

  fs.writeFileSync(path.join(process.cwd(), 'data/recipes.ts'), content)
  console.log(`Wrote ${transformed.length} recipes to data/recipes.ts`)
}

async function main() {
  try {
    await syncBatches()
    await syncRecipes()
    console.log('\nSync complete! Run `npm run format` to format the files.')
  } catch (error) {
    console.error('Sync failed:', error)
    process.exit(1)
  }
}

main()
