#!/usr/bin/env node
/**
 * Import BingenBrew BeerSmith recipes into recipes.ts
 * These are Vince's recipes from the BingenBrew era, stored in .bsmx format.
 * None have measured OG/FG data, so only recipes are created (no batches).
 */

const fs = require('fs')
const path = require('path')

const BINGENBREW_DIR = '/Users/joecarlyon/Desktop/brewing/Beersmith/BingenBrew'
const RECIPES_TS = path.join(__dirname, '../data/recipes.ts')

// Decode HTML entities
function decodeHtml(str) {
  if (!str) return str
  return str
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&reg;/g, '')
    .replace(/&trade;/g, '')
}

function getTag(xml, tag) {
  const regex = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'i')
  const match = xml.match(regex)
  return match ? match[1].trim() : ''
}

// Generate deterministic UUID from name
function generateUUID(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0')
  // Add 'bb' prefix to distinguish from other beersmith UUIDs
  return `bb${hex.slice(0, 6)}-${hex.slice(0, 4)}-4${hex.slice(1, 4)}-${hex.slice(0, 4)}-bb${hex.slice(0, 6)}${hex.slice(0, 4)}`
}

function getCategory(style) {
  const s = (style || '').toLowerCase()
  if (s.includes('lager') || s.includes('pilsner') || s.includes('schwarzbier') ||
      s.includes('oktoberfest') || s.includes('marzen') || s.includes('bock') ||
      s.includes('helles') || s.includes('vienna')) {
    return 'lager'
  }
  return 'ale'
}

function parseBsmx(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')

  const recipeMatch = content.match(/<Recipe>([\s\S]*?)<\/Recipe>/i)
  if (!recipeMatch) return null
  const recipeXml = recipeMatch[1]

  const name = decodeHtml(getTag(recipeXml, 'F_R_NAME'))
  const date = getTag(recipeXml, 'F_R_DATE')
  const desiredOg = parseFloat(getTag(recipeXml, 'F_R_DESIRED_OG')) || 1.050

  // Style
  const styleSection = content.match(/<F_R_STYLE>([\s\S]*?)<\/F_R_STYLE>/i)
  const style = decodeHtml(styleSection ? getTag(styleSection[1], 'F_S_NAME') : '')

  // Equipment batch volume (fluid ounces -> gallons)
  const equipMatch = content.match(/<F_R_EQUIPMENT>([\s\S]*?)<\/F_R_EQUIPMENT>/i)
  let batchGal = 5
  if (equipMatch) {
    const batchOz = parseFloat(getTag(equipMatch[1], 'F_E_BATCH_VOL')) || 0
    if (batchOz > 0) batchGal = batchOz / 128
  }

  // Scale factor to normalize to 5 gallon
  const scale = 5 / batchGal

  // Ingredients
  const ingredientsMatch = content.match(/<Ingredients>([\s\S]*?)<\/Ingredients>/i)
  const ingredientsXml = ingredientsMatch ? ingredientsMatch[1] : ''

  // Grains
  const grainMatches = ingredientsXml.match(/<Grain>([\s\S]*?)<\/Grain>/gi) || []
  const grains = []
  const fermentablesDetail = []
  for (const g of grainMatches) {
    if (getTag(g, 'F_G_IN_RECIPE') !== '1') continue
    const gName = decodeHtml(getTag(g, 'F_G_NAME'))
    const amountOz = parseFloat(getTag(g, 'F_G_AMOUNT')) || 0
    const amountLb = (amountOz / 16) * scale
    grains.push(`${amountLb.toFixed(2)} lb ${gName}`)
    fermentablesDetail.push({ name: gName, amount: Math.round(amountLb * 100) / 100 })
  }
  // Sort by amount descending
  fermentablesDetail.sort((a, b) => b.amount - a.amount)
  grains.sort((a, b) => {
    const aAmt = parseFloat(a)
    const bAmt = parseFloat(b)
    return bAmt - aAmt
  })

  // Hops
  const hopMatches = ingredientsXml.match(/<Hops>([\s\S]*?)<\/Hops>/gi) || []
  const hops = []
  const hopsDetail = []
  let totalIbu = 0
  for (const h of hopMatches) {
    if (getTag(h, 'F_H_IN_RECIPE') !== '1') continue
    const hName = getTag(h, 'F_H_NAME')
    const amountOz = (parseFloat(getTag(h, 'F_H_AMOUNT')) || 0) * scale
    const boilTime = parseFloat(getTag(h, 'F_H_BOIL_TIME')) || 0
    const dryHopTime = parseFloat(getTag(h, 'F_H_DRY_HOP_TIME')) || 0
    const use = getTag(h, 'F_H_USE')
    const ibu = parseFloat(getTag(h, 'F_H_IBU_CONTRIB')) || 0
    totalIbu += ibu

    let useType = 'Boil'
    if (use === '1' || dryHopTime > 0) useType = 'Dry Hop'
    else if (use === '4') useType = 'Aroma'
    else if (boilTime <= 5) useType = 'Aroma'
    else if (boilTime <= 15) useType = 'Aroma'

    const roundedOz = Math.round(amountOz * 10) / 10
    hops.push(`${roundedOz.toFixed(1)} oz ${hName} (${useType})`)
    hopsDetail.push({
      name: hName,
      amount: roundedOz,
      use: useType,
      ...(useType !== 'Dry Hop' && boilTime > 0 ? { time: boilTime } : {}),
    })
  }

  // Yeast
  const yeastMatches = ingredientsXml.match(/<Yeast>([\s\S]*?)<\/Yeast>/gi) || []
  let yeast = 'Not specified'
  for (const y of yeastMatches) {
    if (getTag(y, 'F_Y_IN_RECIPE') !== '1') continue
    const yName = getTag(y, 'F_Y_NAME')
    const yLab = getTag(y, 'F_Y_LAB')
    const yPid = getTag(y, 'F_Y_PRODUCT_ID')
    yeast = `${yLab} ${yPid} ${yName}`
    break
  }

  // Estimate FG and ABV from desired OG (since no measured data)
  // Use typical attenuation of ~75%
  const og = Math.round(desiredOg * 1000) / 1000
  const ogPoints = (og - 1) * 1000
  const fgPoints = ogPoints * 0.25 // 75% attenuation
  const fg = Math.round((1 + fgPoints / 1000) * 1000) / 1000
  const abv = Math.round((og - fg) * 131.25 * 10) / 10

  return {
    name,
    style,
    category: getCategory(style),
    og,
    fg,
    abv,
    ibu: Math.round(totalIbu),
    grains,
    hops,
    yeast,
    date: date || undefined,
    hopsDetail,
    batchSize: 5,
    fileName: path.basename(filePath),
  }
}

function main() {
  console.log('Importing BingenBrew recipes...\n')

  // Parse all .bsmx files
  const files = fs.readdirSync(BINGENBREW_DIR)
    .filter(f => f.endsWith('.bsmx'))
    .map(f => path.join(BINGENBREW_DIR, f))

  console.log(`Found ${files.length} .bsmx files\n`)

  const parsed = []
  for (const file of files) {
    try {
      const recipe = parseBsmx(file)
      if (recipe) {
        parsed.push(recipe)
        console.log(`  ${recipe.name} (${recipe.style}) - OG ${recipe.og}, ${recipe.ibu} IBU, ${recipe.grains.length} grains, ${recipe.hops.length} hops`)
      }
    } catch (err) {
      console.error(`Error parsing ${file}: ${err.message}`)
    }
  }

  // Read existing recipes.ts
  const recipesContent = fs.readFileSync(RECIPES_TS, 'utf-8')

  // Extract the array - find "= [" to skip "Recipe[]"
  const eqBracket = recipesContent.indexOf('= [')
  const arrayStart = eqBracket + 2 // position of '['
  const arrayEnd = recipesContent.lastIndexOf(']')
  const arrayJson = recipesContent.slice(arrayStart, arrayEnd + 1)

  let existingRecipes
  try {
    existingRecipes = JSON.parse(arrayJson)
  } catch (e) {
    console.error('Failed to parse existing recipes.ts:', e.message)
    process.exit(1)
  }

  console.log(`\nExisting recipes: ${existingRecipes.length}`)

  const beersmithRecipes = existingRecipes.filter(r => r.source === 'beersmith')
  const brewfatherRecipes = existingRecipes.filter(r => r.source === 'brewfather')
  console.log(`  BeerSmith: ${beersmithRecipes.length}`)
  console.log(`  Brewfather: ${brewfatherRecipes.length}`)

  // Check for name duplicates
  const existingNames = new Set(existingRecipes.map(r => r.name.toLowerCase()))
  for (const r of parsed) {
    if (existingNames.has(r.name.toLowerCase())) {
      console.log(`\n  ⚠ "${r.name}" already exists - importing as "${r.name} (BingenBrew)"`)
      r.name = `${r.name} (BingenBrew)`
    }
  }

  // Create new recipe objects
  const nextBeersmithId = beersmithRecipes.length + 1
  const newRecipes = parsed.map((r, i) => ({
    id: nextBeersmithId + i,
    uuid: generateUUID(r.name),
    name: r.name,
    style: r.style,
    category: r.category,
    description: '',
    og: r.og,
    fg: r.fg,
    abv: r.abv,
    ibu: r.ibu,
    grains: r.grains,
    hops: r.hops,
    yeast: r.yeast,
    source: 'beersmith',
    ...(r.date ? { brewDate: r.date } : {}),
    hopsDetail: r.hopsDetail,
    batchSize: r.batchSize,
  }))

  console.log(`\nNew recipes to add: ${newRecipes.length}`)

  // Renumber Brewfather recipes
  const newBrewfatherStart = beersmithRecipes.length + newRecipes.length + 1
  const renumberedBrewfather = brewfatherRecipes.map((r, i) => ({
    ...r,
    id: newBrewfatherStart + i,
  }))

  console.log(`Brewfather recipes renumbered: ${beersmithRecipes.length + 1}-${beersmithRecipes.length + brewfatherRecipes.length} → ${newBrewfatherStart}-${newBrewfatherStart + brewfatherRecipes.length - 1}`)

  // Combine: existing beersmith + new bingenbrew + renumbered brewfather
  const allRecipes = [...beersmithRecipes, ...newRecipes, ...renumberedBrewfather]
  console.log(`\nTotal recipes: ${allRecipes.length}`)

  // Write output
  const output = `import { Recipe } from '@/types'\n\nexport const recipes: Recipe[] = ${JSON.stringify(allRecipes, null, 2)}\n`
  fs.writeFileSync(RECIPES_TS, output)
  console.log(`\nWrote ${allRecipes.length} recipes to ${RECIPES_TS}`)

  // Summary
  console.log('\n=== New Recipes Added ===')
  for (const r of newRecipes) {
    console.log(`  #${r.id} ${r.name} (${r.style}) - ${r.category}`)
  }
}

main()
