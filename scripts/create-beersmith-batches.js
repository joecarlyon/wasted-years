#!/usr/bin/env node
/**
 * Create batch records from Beersmith recipes and CSV brew list
 */

const fs = require('fs');
const path = require('path');

const CSV_FILE = '/Users/joecarlyon/Desktop/Beerlist - Sheet1.csv';
const RECIPES_JSON = path.join(__dirname, '../data/beersmith-recipes.json');
const BATCHES_TS = path.join(__dirname, '../data/batches.ts');

// Parse CSV
function parseCSV(content) {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',');
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (const char of lines[i]) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    const row = {};
    headers.forEach((h, idx) => {
      row[h.trim()] = values[idx] || '';
    });
    rows.push(row);
  }

  return rows;
}

// Normalize name for matching
function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/clone$/, '')
    .replace(/og$/, '')
    .replace(/\d+$/, '');
}

// Find best matching recipe
function findMatchingRecipe(beerName, recipes) {
  const normalizedBeer = normalizeName(beerName);

  // Try exact match first
  let match = recipes.find(r => normalizeName(r.name) === normalizedBeer);
  if (match) return match;

  // Try partial match
  match = recipes.find(r => {
    const normalizedRecipe = normalizeName(r.name);
    return normalizedRecipe.includes(normalizedBeer) || normalizedBeer.includes(normalizedRecipe);
  });
  if (match) return match;

  // Try keyword match
  const keywords = normalizedBeer.split(/\s+/).filter(k => k.length > 3);
  for (const keyword of keywords) {
    match = recipes.find(r => normalizeName(r.name).includes(keyword));
    if (match) return match;
  }

  return null;
}

// Parse date from CSV format (M/D/YYYY or similar)
function parseDate(dateStr) {
  if (!dateStr || dateStr.trim() === '') return '';

  // Handle formats like "3/19/2015" or "11?/2015"
  const cleaned = dateStr.replace('?', '');
  const parts = cleaned.split('/');

  if (parts.length === 3) {
    const month = parts[0].padStart(2, '0');
    const day = parts[1].padStart(2, '0');
    const year = parts[2].length === 2 ? '20' + parts[2] : parts[2];
    return `${year}-${month}-${day}`;
  }

  if (parts.length === 2) {
    // Month/Year only
    const month = parts[0].padStart(2, '0');
    const year = parts[1].length === 2 ? '20' + parts[1] : parts[1];
    return `${year}-${month}-01`;
  }

  return '';
}

// Parse OG value
function parseOG(ogStr) {
  if (!ogStr || ogStr.trim() === '') return 0;
  const val = parseFloat(ogStr);
  if (isNaN(val)) return 0;
  // If it looks like 1.055 format, use it; if it's like 55, convert
  return val > 2 ? 1 + val / 1000 : val;
}

// Determine category from style
function getCategory(style) {
  const styleLower = (style || '').toLowerCase();
  if (styleLower.includes('ipa') || styleLower.includes('pale ale')) return 'ale';
  if (styleLower.includes('stout') || styleLower.includes('porter')) return 'ale';
  if (styleLower.includes('wheat') || styleLower.includes('hef') || styleLower.includes('weiss') || styleLower.includes('wit')) return 'ale';
  if (styleLower.includes('lager') || styleLower.includes('oktoberfest') || styleLower.includes('pilsner')) return 'lager';
  if (styleLower.includes('saison') || styleLower.includes('belgian')) return 'ale';
  if (styleLower.includes('red') || styleLower.includes('amber')) return 'ale';
  if (styleLower.includes('barleywine')) return 'ale';
  return 'ale';
}

// Parse grain string to fermentable object
function parseGrain(grainStr) {
  // Format: "13.00 lb Brewers Malt 2-Row (Briess)"
  const match = grainStr.match(/^([\d.]+)\s*(?:lb|oz)\s+(.+)$/);
  if (match) {
    return {
      name: match[2].trim(),
      amount: parseFloat(match[1])
    };
  }
  return { name: grainStr, amount: 0 };
}

// Parse hop string to hop object
function parseHop(hopStr) {
  // Format: "0.8 oz Magnum (Dry Hop)" or "1.0 oz Chinook (Boil 60 min)"
  const match = hopStr.match(/^([\d.]+)\s*oz\s+(.+?)\s*\(([^)]+)\)$/);
  if (match) {
    const name = match[2].trim();
    const timing = match[3].toLowerCase();
    let usage = 'Both';
    if (timing.includes('boil') || timing.includes('bitter')) usage = 'Bittering';
    else if (timing.includes('dry') || timing.includes('aroma')) usage = 'Aroma';

    return {
      name,
      amount: parseFloat(match[1]),
      usage
    };
  }
  return { name: hopStr, amount: 0, usage: 'Both' };
}

// Parse yeast string to yeast object
function parseYeast(yeastStr) {
  if (!yeastStr) return [];

  // Format: "Wyeast Labs 1056 American Ale" or "White Labs WLP001 California Ale"
  const wyeastMatch = yeastStr.match(/Wyeast\s+Labs?\s+(\d+)\s+(.+)/i);
  if (wyeastMatch) {
    return [{
      name: wyeastMatch[2].trim(),
      laboratory: 'Wyeast Labs',
      productId: wyeastMatch[1]
    }];
  }

  const whiteLabsMatch = yeastStr.match(/White\s+Labs?\s+(WLP\d+)\s+(.+)/i);
  if (whiteLabsMatch) {
    return [{
      name: whiteLabsMatch[2].trim(),
      laboratory: 'White Labs',
      productId: whiteLabsMatch[1]
    }];
  }

  const safaleMatch = yeastStr.match(/(?:DCL\/)?Fermentis\s+(.+)/i);
  if (safaleMatch) {
    return [{
      name: safaleMatch[1].trim(),
      laboratory: 'Fermentis',
      productId: ''
    }];
  }

  const danstarMatch = yeastStr.match(/Danstar\s+-\s+(.+)/i);
  if (danstarMatch) {
    return [{
      name: danstarMatch[1].trim(),
      laboratory: 'Danstar',
      productId: ''
    }];
  }

  return [{
    name: yeastStr,
    laboratory: 'Unknown',
    productId: ''
  }];
}

function main() {
  // Load data
  const csvContent = fs.readFileSync(CSV_FILE, 'utf-8');
  const csvRows = parseCSV(csvContent);

  const recipesData = JSON.parse(fs.readFileSync(RECIPES_JSON, 'utf-8'));
  const recipes = recipesData.recipes;

  console.log(`Loaded ${csvRows.length} CSV rows and ${recipes.length} recipes`);

  // Create batches from CSV
  const newBatches = [];
  let batchNo = 1; // Start Beersmith batches at 1

  for (const row of csvRows) {
    const beerName = row['Beer'];
    if (!beerName) continue;

    const recipe = findMatchingRecipe(beerName, recipes);

    // Combine notes
    const tonyNotes = row['Tony Notes'] || '';
    const joeNotes = row['Joe Notes'] || '';
    const allNotes = [tonyNotes, joeNotes].filter(n => n.trim()).join(' | ');

    // Parse dates
    const brewDate = parseDate(row['Date Brewed']);
    const bottlingDate = parseDate(row['Date Bottled/Kegged']);

    // Get values from recipe or CSV
    const og = parseOG(row['OG']) || (recipe ? parseFloat(recipe.og) || 0 : 0);
    const fg = parseOG(row['FG']) || (recipe ? parseFloat(recipe.fg) || 0 : 0);
    const abv = parseFloat(row['ABV']) || (recipe ? parseFloat(recipe.abv) || 0 : 0);
    const ibu = recipe?.ibu || null;

    const batch = {
      batchNo: batchNo++,
      name: beerName,
      style: recipe?.style || 'Unknown',
      category: getCategory(recipe?.style),
      brewer: 'Joe & Tony',
      status: 'Completed',
      brewDate: brewDate || recipe?.date || '',
      bottlingDate: bottlingDate || '',
      og: og,
      fg: fg,
      abv: abv,
      ibu: ibu,
      color: 0,
      efficiency: 0,
      batchSize: parseFloat(row['Quanity (gallons)']) || 10,
      fermentables: recipe?.grains?.map(parseGrain) || [],
      hops: recipe?.hops?.map(parseHop) || [],
      yeast: parseYeast(recipe?.yeast),
      source: 'beersmith'
    };

    // Add tasting notes if present
    if (allNotes) {
      batch.tastingNotes = allNotes;
    }

    // Add recipe tasting notes if available and not already included
    if (recipe?.tonyNotes && !allNotes.includes(recipe.tonyNotes)) {
      batch.tastingNotes = batch.tastingNotes
        ? batch.tastingNotes + ' | ' + recipe.tonyNotes
        : recipe.tonyNotes;
    }

    newBatches.push(batch);

    if (recipe) {
      console.log(`Matched "${beerName}" -> "${recipe.name}"`);
    } else {
      console.log(`No match for "${beerName}"`);
    }
  }

  console.log(`\nCreated ${newBatches.length} new batches`);

  // Read existing batches
  const batchesContent = fs.readFileSync(BATCHES_TS, 'utf-8');
  const arrayMatch = batchesContent.match(/export const batches: Batch\[\] = (\[[\s\S]*\])\s*$/);
  if (!arrayMatch) {
    console.error('Could not parse batches.ts');
    process.exit(1);
  }

  const existingBatches = eval(arrayMatch[1]);
  console.log(`Found ${existingBatches.length} existing Brewfather batches`);

  // Renumber existing batches to come after Beersmith batches
  const renumberedBatches = existingBatches.map(b => ({
    ...b,
    batchNo: b.batchNo + newBatches.length
  }));

  // Combine all batches
  const allBatches = [...newBatches, ...renumberedBatches];

  // Write output
  const output = `import { Batch } from '@/types'

export const batches: Batch[] = ${JSON.stringify(allBatches, null, 2)}
`;

  fs.writeFileSync(BATCHES_TS, output);
  console.log(`\nWrote ${allBatches.length} total batches to batches.ts`);
  console.log(`Beersmith batches: #1-${newBatches.length}`);
  console.log(`Brewfather batches: #${newBatches.length + 1}-${allBatches.length}`);
}

main();
