#!/usr/bin/env node
/**
 * Parse Beersmith .bsmx files and correlate with brew log CSV
 * Outputs JSON of all recipes sorted by brew date
 */

const fs = require('fs')
const path = require('path')

// Paths
const BEERSMITH_DIR = '/Users/joecarlyon/Desktop/Beersmith'
const CSV_PATH = '/Users/joecarlyon/Desktop/Beerlist - Sheet1.csv'
const OUTPUT_PATH =
  '/Users/joecarlyon/dev/wasted-years/data/beersmith-recipes.json'

// Decode HTML entities
function decodeHtmlEntities(str) {
  if (!str) return str
  return str
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&ndash;/g, '-')
    .replace(/&mdash;/g, '-')
    .replace(/&auml;/g, 'a')
    .replace(/&uuml;/g, 'u')
    .replace(/&ouml;/g, 'o')
    .replace(/&#8217;/g, "'")
    .replace(/&#8211;/g, '-')
}

// Parse CSV file
function parseCSV(csvContent) {
  const lines = csvContent.trim().split('\n')
  const headers = lines[0].split(',')
  const entries = []

  for (let i = 1; i < lines.length; i++) {
    // Handle CSV parsing with potential commas in fields
    const values = parseCSVLine(lines[i])
    const entry = {}
    headers.forEach((header, idx) => {
      entry[header.trim()] = values[idx]?.trim() || ''
    })
    entries.push(entry)
  }

  return entries
}

function parseCSVLine(line) {
  const values = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      values.push(current)
      current = ''
    } else {
      current += char
    }
  }
  values.push(current)
  return values
}

// Extract XML tag value
function getTag(xml, tag) {
  const regex = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'i')
  const match = xml.match(regex)
  return match ? match[1].trim() : ''
}

// Extract all occurrences of a tag
function getAllTags(xml, tag) {
  const regex = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'gi')
  const matches = []
  let match
  while ((match = regex.exec(xml)) !== null) {
    matches.push(match[1])
  }
  return matches
}

// Parse grain from XML
function parseGrain(grainXml) {
  const name = decodeHtmlEntities(getTag(grainXml, 'F_G_NAME'))
  const amountOz = parseFloat(getTag(grainXml, 'F_G_AMOUNT')) || 0
  const inRecipe = getTag(grainXml, 'F_G_IN_RECIPE')

  // Skip if not in recipe
  if (inRecipe !== '1') return null

  // Convert oz to lb
  const amountLb = amountOz / 16

  return {
    name,
    amount: amountLb,
    formatted: `${amountLb.toFixed(2)} lb ${name}`,
  }
}

// Parse hop from XML
function parseHop(hopXml) {
  const name = getTag(hopXml, 'F_H_NAME')
  const amountOz = parseFloat(getTag(hopXml, 'F_H_AMOUNT')) || 0
  const boilTime = parseFloat(getTag(hopXml, 'F_H_BOIL_TIME')) || 0
  const dryHopTime = parseFloat(getTag(hopXml, 'F_H_DRY_HOP_TIME')) || 0
  const use = getTag(hopXml, 'F_H_USE') // 0 = boil, 1 = dry hop
  const inRecipe = getTag(hopXml, 'F_H_IN_RECIPE')
  const ibuContrib = parseFloat(getTag(hopXml, 'F_H_IBU_CONTRIB')) || 0

  // Skip if not in recipe
  if (inRecipe !== '1') return null

  let useType
  if (use === '1' || dryHopTime > 0) {
    useType = 'Dry Hop'
  } else if (boilTime <= 5) {
    useType = 'Aroma'
  } else if (boilTime <= 15) {
    useType = 'Flavor'
  } else {
    useType = 'Boil'
  }

  return {
    name,
    amount: amountOz,
    boilTime,
    dryHopTime,
    use: useType,
    ibu: ibuContrib,
    formatted: `${amountOz.toFixed(1)} oz ${name} (${useType}${useType !== 'Dry Hop' ? ` ${boilTime} min` : ''})`,
  }
}

// Parse yeast from XML
function parseYeast(yeastXml) {
  const name = getTag(yeastXml, 'F_Y_NAME')
  const lab = getTag(yeastXml, 'F_Y_LAB')
  const productId = getTag(yeastXml, 'F_Y_PRODUCT_ID')
  const inRecipe = getTag(yeastXml, 'F_Y_IN_RECIPE')

  // Skip if not in recipe
  if (inRecipe !== '1') return null

  return {
    name,
    lab,
    productId,
    formatted: `${lab} ${productId} ${name}`,
  }
}

// Parse a single .bsmx file
function parseBsmx(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')

  // Get recipe section
  const recipeMatch = content.match(/<Recipe>([\s\S]*?)<\/Recipe>/i)
  if (!recipeMatch) return null
  const recipeXml = recipeMatch[1]

  // Basic info
  const name = decodeHtmlEntities(getTag(recipeXml, 'F_R_NAME'))
  const date = getTag(recipeXml, 'F_R_DATE')

  // Style
  const styleSection = content.match(/<F_R_STYLE>([\s\S]*?)<\/F_R_STYLE>/i)
  const style = decodeHtmlEntities(
    styleSection ? getTag(styleSection[1], 'F_S_NAME') : ''
  )

  // Measured values
  let og = parseFloat(getTag(recipeXml, 'F_R_OG_MEASURED')) || 0
  let fg = parseFloat(getTag(recipeXml, 'F_R_FG_MEASURED')) || 0

  // Batch size - BeerSmith stores volumes in fluid ounces, convert to gallons (128 oz/gal)
  const equipmentMatch = content.match(/<F_R_EQUIPMENT>([\s\S]*?)<\/F_R_EQUIPMENT>/i)
  let batchSizeOz = 0
  if (equipmentMatch) {
    batchSizeOz = parseFloat(getTag(equipmentMatch[1], 'F_E_BATCH_VOL')) || 0
  }
  if (!batchSizeOz) {
    batchSizeOz = parseFloat(getTag(recipeXml, 'F_R_VOLUME')) || 0
  }
  const batchSize = batchSizeOz / 128 // Convert fluid ounces to gallons

  // Get ingredients section
  const ingredientsMatch = content.match(
    /<Ingredients>([\s\S]*?)<\/Ingredients>/i
  )
  const ingredientsXml = ingredientsMatch ? ingredientsMatch[1] : ''

  // Parse grains
  const grainMatches =
    ingredientsXml.match(/<Grain>([\s\S]*?)<\/Grain>/gi) || []
  const grains = grainMatches
    .map((g) => parseGrain(g))
    .filter((g) => g !== null)
    .sort((a, b) => b.amount - a.amount)

  // Parse hops
  const hopMatches = ingredientsXml.match(/<Hops>([\s\S]*?)<\/Hops>/gi) || []
  const hops = hopMatches.map((h) => parseHop(h)).filter((h) => h !== null)

  // Calculate total IBU
  const ibu = Math.round(hops.reduce((sum, h) => sum + h.ibu, 0))

  // Parse yeast
  const yeastMatches =
    ingredientsXml.match(/<Yeast>([\s\S]*?)<\/Yeast>/gi) || []
  const yeasts = yeastMatches
    .map((y) => parseYeast(y))
    .filter((y) => y !== null)

  // Calculate ABV if we have OG and FG
  let abv = 0
  if (og > 1 && fg > 0) {
    abv = (og - fg) * 131.25
  }

  return {
    name,
    style,
    date,
    og: og > 1 ? og.toFixed(3) : null,
    fg: fg > 0 ? fg.toFixed(3) : null,
    abv: abv > 0 ? abv.toFixed(1) : null,
    ibu: ibu > 0 ? ibu : null,
    batchSize: batchSize > 0 ? Math.round(batchSize * 10) / 10 : null,
    grains: grains.map((g) => g.formatted),
    hops: hops.map((h) => h.formatted),
    yeast: yeasts.length > 0 ? yeasts[0].formatted : null,
    fileName: path.basename(filePath),
  }
}

// Fuzzy match recipe name to CSV entry
function fuzzyMatch(recipeName, csvEntries) {
  // First decode HTML entities
  const decodedName = decodeHtmlEntities(recipeName)

  const normalizedRecipe = decodedName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/og$/, '')
    .replace(/3$/, '')
    .replace(/2$/, '')
    .replace(/redux$/, '')
    .replace(/updatedmalt$/, '')

  for (const entry of csvEntries) {
    const normalizedCsv = entry.Beer.toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .replace(/london$/, '')
      .replace(/british$/, '')
      .replace(/omega$/, '')
      .replace(/partygle$/, '')
      .replace(/clone$/, '')
      .replace(/2$/, '')

    // Check for substring match or similarity
    if (
      normalizedRecipe.includes(normalizedCsv) ||
      normalizedCsv.includes(normalizedRecipe) ||
      normalizedRecipe === normalizedCsv
    ) {
      return entry
    }
  }

  // Try partial matches for common names
  const partialMatches = {
    gumballhead: 'Gumballhead',
    garibaldihead: 'Gumballhead',
    littleheffer: 'Little Hefer',
    littlehefer: 'Little Hefer',
    worldsbestoktoberfest: "World's Best Oktoberfest",
    usurper: 'Usurper Rye IPA',
    ryeusurper: 'Rye Usurper',
    witheredstout: 'Withered Stout',
    witheredimperialstout: 'Withered Stout',
    hopstarted: 'Hop Tarted',
    smorepu: 'Smore Punkin',
    saison: 'Saison',
    devilswheat: 'Devils Wheat',
    blueballs: 'Blue Moon Clone',
    vinces: "Vince's",
    basicblonde: 'Blonde',
    dumbblonde: 'Blonde',
    wannabeblonde: 'Wanna be blonde',
    ragingredhead: 'Raging Redhead',
    milkstout: 'Milk stout',
    milkstoutog: 'Milk stout',
    hoptarted: 'Hop Tarted',
  }

  for (const [key, csvName] of Object.entries(partialMatches)) {
    if (normalizedRecipe.includes(key) || key.includes(normalizedRecipe)) {
      const match = csvEntries.find((e) =>
        e.Beer.toLowerCase()
          .replace(/[^a-z0-9]/g, '')
          .includes(csvName.toLowerCase().replace(/[^a-z0-9]/g, ''))
      )
      if (match) return match
    }
  }

  return null
}

// Parse date from CSV format (M/D/YYYY or similar)
function parseDate(dateStr) {
  if (!dateStr) return null

  // Handle formats like "3/21/2015", "11?/2015"
  const cleaned = dateStr.replace('?', '')
  const parts = cleaned.split('/')

  if (parts.length >= 2) {
    const month = parseInt(parts[0], 10)
    const day = parts.length === 3 ? parseInt(parts[1], 10) : 1
    const year = parseInt(parts[parts.length - 1], 10)

    if (year && month) {
      const fullYear = year < 100 ? 2000 + year : year
      return `${fullYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    }
  }

  return null
}

// Main function
function main() {
  console.log('Parsing Beersmith recipes...\n')

  // Read CSV
  const csvContent = fs.readFileSync(CSV_PATH, 'utf-8')
  const csvEntries = parseCSV(csvContent)
  console.log(`Found ${csvEntries.length} entries in CSV\n`)

  // Get all .bsmx files
  const files = fs
    .readdirSync(BEERSMITH_DIR)
    .filter((f) => f.endsWith('.bsmx'))
    .filter((f) => !f.includes('(1)')) // Skip duplicates with (1) suffix
    .map((f) => path.join(BEERSMITH_DIR, f))

  console.log(`Found ${files.length} unique .bsmx files\n`)

  // Parse all files
  const recipes = []
  for (const file of files) {
    try {
      const recipe = parseBsmx(file)
      if (recipe && recipe.name) {
        // Try to match with CSV
        const csvMatch = fuzzyMatch(recipe.name, csvEntries)

        if (csvMatch) {
          // Use CSV date if available
          const csvDate = parseDate(csvMatch['Date Brewed'])
          if (csvDate) {
            recipe.date = csvDate
          }

          // Add CSV notes
          if (csvMatch['Tony Notes']) {
            recipe.tonyNotes = csvMatch['Tony Notes']
          }
          if (csvMatch['Joe Notes']) {
            recipe.joeNotes = csvMatch['Joe Notes']
          }

          // Override OG/FG from CSV if available
          if (csvMatch['OG'] && csvMatch['OG'] !== '') {
            recipe.csvOg = csvMatch['OG']
          }
          if (csvMatch['FG'] && csvMatch['FG'] !== '') {
            recipe.csvFg = csvMatch['FG']
          }
          if (
            csvMatch['ABV'] &&
            csvMatch['ABV'] !== '' &&
            csvMatch['ABV'] !== '0'
          ) {
            recipe.csvAbv = csvMatch['ABV']
          }
        }

        recipes.push(recipe)
        console.log(`Parsed: ${recipe.name} (${recipe.date || 'no date'})`)
      }
    } catch (err) {
      console.error(`Error parsing ${file}: ${err.message}`)
    }
  }

  // Sort by date (earliest first), recipes without dates at the end
  recipes.sort((a, b) => {
    if (!a.date && !b.date) return 0
    if (!a.date) return 1
    if (!b.date) return -1
    return a.date.localeCompare(b.date)
  })

  // Write output
  const output = {
    generatedAt: new Date().toISOString(),
    totalRecipes: recipes.length,
    recipes,
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2))
  console.log(`\nWrote ${recipes.length} recipes to ${OUTPUT_PATH}`)

  // Print summary
  console.log('\n=== Summary ===')
  console.log(`Total recipes: ${recipes.length}`)
  console.log(`Recipes with dates: ${recipes.filter((r) => r.date).length}`)
  console.log(
    `Recipes with notes: ${recipes.filter((r) => r.tonyNotes || r.joeNotes).length}`
  )
}

main()
