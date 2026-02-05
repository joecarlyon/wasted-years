#!/usr/bin/env node
/**
 * Import Beersmith recipes into the main recipes.ts file
 * Beersmith recipes get IDs 1-N, existing Brewfather recipes get renumbered
 */

const fs = require('fs')
const path = require('path')

const BEERSMITH_JSON = path.join(__dirname, '../data/beersmith-recipes.json')
const RECIPES_TS = path.join(__dirname, '../data/recipes.ts')
const OUTPUT_TS = path.join(__dirname, '../data/recipes.ts')

// Determine category from style
function getCategory(style) {
  const styleLower = (style || '').toLowerCase()

  // Lagers
  if (
    styleLower.includes('lager') ||
    styleLower.includes('pilsner') ||
    styleLower.includes('pilsen') ||
    styleLower.includes('oktoberfest') ||
    styleLower.includes('marzen') ||
    styleLower.includes('bock') ||
    styleLower.includes('helles') ||
    styleLower.includes('vienna')
  ) {
    return 'lager'
  }

  // Spirits (shouldn't be any in Beersmith, but just in case)
  if (
    styleLower.includes('vodka') ||
    styleLower.includes('whiskey') ||
    styleLower.includes('bourbon') ||
    styleLower.includes('rum') ||
    styleLower.includes('spirit')
  ) {
    return 'spirit'
  }

  // Default to ale
  return 'ale'
}

// Clean up HTML entities
function cleanText(str) {
  if (!str) return str
  return str
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

// Generate a stable UUID from name (deterministic for consistent IDs)
function generateUUID(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0')
  return `${hex.slice(0, 8)}-${hex.slice(0, 4)}-4${hex.slice(1, 4)}-${hex.slice(0, 4)}-${hex.slice(0, 8)}${hex.slice(0, 4)}`
}

// Format grain/hop strings for consistency
function formatGrains(grains) {
  return grains.map((g) => cleanText(g))
}

// Parse hop string like "1.0 oz Chinook (Boil 60 min)" into structured data
function parseHop(hopStr) {
  const cleaned = cleanText(hopStr)

  // Parse amount and name: "1.0 oz Chinook (Boil 60 min)"
  const match = cleaned.match(/^([\d.]+)\s*oz\s+(.+?)\s*\((.+)\)$/)
  if (!match) {
    return { name: cleaned, amount: 0, use: 'Boil' }
  }

  const amount = parseFloat(match[1])
  const name = match[2]
  const usageStr = match[3]

  // Parse usage: "Boil 60 min", "Dry Hop", "Aroma 5 min", "Flavor 15 min"
  let use = 'Boil'
  let time = undefined

  if (usageStr.includes('Dry Hop')) {
    use = 'Dry Hop'
  } else if (usageStr.includes('Aroma')) {
    use = 'Aroma'
    const timeMatch = usageStr.match(/(\d+)\s*min/)
    if (timeMatch) time = parseInt(timeMatch[1])
  } else if (usageStr.includes('Flavor')) {
    use = 'Boil' // Flavor is essentially a late boil addition
    const timeMatch = usageStr.match(/(\d+)\s*min/)
    if (timeMatch) time = parseInt(timeMatch[1])
  } else if (usageStr.includes('Boil')) {
    use = 'Boil'
    const timeMatch = usageStr.match(/(\d+)\s*min/)
    if (timeMatch) time = parseInt(timeMatch[1])
  }

  return { name, amount, use, ...(time !== undefined && { time }) }
}

function formatHops(hops) {
  return hops.map((h) => {
    let cleaned = cleanText(h)
    // Normalize hop usage formatting: "X oz Name (Usage X min)" -> "X oz Name (Usage)"
    // Keep the minutes for boil/flavor, but simplify
    cleaned = cleaned.replace(/\(Boil \d+ min\)/g, '(Boil)')
    cleaned = cleaned.replace(/\(Flavor \d+ min\)/g, '(Boil)')
    cleaned = cleaned.replace(/\(Aroma \d+ min\)/g, '(Aroma)')
    return cleaned
  })
}

function parseHopsDetail(hops) {
  return hops.map(parseHop)
}

function main() {
  console.log('Importing Beersmith recipes...\n')

  // Read Beersmith JSON
  const beersmithData = JSON.parse(fs.readFileSync(BEERSMITH_JSON, 'utf-8'))
  const beersmithRecipes = beersmithData.recipes
  console.log(`Found ${beersmithRecipes.length} Beersmith recipes`)

  // Try to read existing recipes to preserve Brewfather recipes
  let existingBrewfatherRecipes = []
  try {
    const recipesContent = fs.readFileSync(RECIPES_TS, 'utf-8')
    const arrayMatch = recipesContent.match(
      /export const recipes: Recipe\[\] = (\[[\s\S]*\]);?\s*$/
    )
    if (arrayMatch) {
      const existingRecipes = eval(arrayMatch[1])
      existingBrewfatherRecipes = existingRecipes.filter(
        (r) => r.source === 'brewfather'
      )
      console.log(
        `Found ${existingBrewfatherRecipes.length} existing Brewfather recipes to preserve`
      )
    }
  } catch (e) {
    console.log('No existing recipes found, creating fresh')
  }

  // Convert Beersmith recipes to Recipe format
  const convertedBeersmith = beersmithRecipes.map((r, index) => {
    const og = r.og ? parseFloat(r.og) : 1.05
    const fg = r.fg ? parseFloat(r.fg) : 1.012
    const abv = r.abv
      ? parseFloat(r.abv)
      : Math.round((og - fg) * 131.25 * 10) / 10

    // Build description from notes
    const descParts = []
    if (r.tonyNotes) descParts.push(`Tony: ${r.tonyNotes}`)
    if (r.joeNotes) descParts.push(`Joe: ${r.joeNotes}`)

    const name = cleanText(r.name)

    return {
      id: index + 1, // Start from 1
      uuid: generateUUID(name),
      name,
      style: cleanText(r.style) || 'Unknown',
      category: getCategory(r.style),
      description: descParts.join(' | '),
      og: Math.round(og * 1000) / 1000,
      fg: Math.round(fg * 1000) / 1000,
      abv: Math.round(abv * 10) / 10,
      ibu: r.ibu || 0,
      grains: formatGrains(r.grains || []),
      hops: formatHops(r.hops || []),
      yeast: cleanText(r.yeast) || 'Not specified',
      source: 'beersmith',
      brewDate: r.date || undefined,
      // Detailed hop info with timing
      hopsDetail: parseHopsDetail(r.hops || []),
    }
  })

  // Renumber existing Brewfather recipes to come after Beersmith
  const startId = convertedBeersmith.length + 1
  const renumberedBrewfather = existingBrewfatherRecipes.map((r, index) => ({
    ...r,
    id: startId + index,
    source: 'brewfather',
  }))

  // Combine all recipes
  const allRecipes = [...convertedBeersmith, ...renumberedBrewfather]
  console.log(`\nTotal recipes: ${allRecipes.length}`)

  // Generate TypeScript output
  const output = `import { Recipe } from '@/types'

export const recipes: Recipe[] = ${JSON.stringify(allRecipes, null, 2)}
`

  // Write output
  fs.writeFileSync(OUTPUT_TS, output)
  console.log(`\nWrote ${allRecipes.length} recipes to ${OUTPUT_TS}`)

  // Summary
  console.log('\n=== Summary ===')
  console.log(
    `Beersmith recipes: ${convertedBeersmith.length} (IDs 1-${convertedBeersmith.length})`
  )
  if (renumberedBrewfather.length > 0) {
    console.log(
      `Brewfather recipes: ${renumberedBrewfather.length} (IDs ${startId}-${startId + renumberedBrewfather.length - 1})`
    )
  }
  console.log(
    '\nRun sync-brewfather.ts to fetch/update Brewfather recipes with full details.'
  )
}

main()
