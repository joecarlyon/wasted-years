#!/usr/bin/env node
/**
 * Fetch notes and logs from Brewfather batches and recipes
 * Outputs JSON with all found notes for manual review
 */

const fs = require('fs');
const path = require('path');

// Load env vars from .env.local
function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    for (const line of content.split('\n')) {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    }
  }
}

loadEnv();

const BREWFATHER_API = 'https://api.brewfather.app/v2';
const USER_ID = process.env.BREWFATHER_USER_ID;
const API_KEY = process.env.BREWFATHER_API_KEY;

if (!USER_ID || !API_KEY) {
  console.error('Missing BREWFATHER_USER_ID or BREWFATHER_API_KEY in .env.local');
  process.exit(1);
}

const AUTH = Buffer.from(`${USER_ID}:${API_KEY}`).toString('base64');

async function fetchAll(endpoint) {
  const results = [];
  let offset = 0;
  const limit = 50;

  while (true) {
    const url = `${BREWFATHER_API}/${endpoint}?include=notes,batchNotes,tasteNotes,brewNotes,fermentationNotes,bottlingNotes,measuredOg,measuredFg&complete=true&limit=${limit}&offset=${offset}`;
    console.log(`Fetching ${endpoint} offset=${offset}...`);

    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${AUTH}`,
      },
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.log('Rate limited, waiting 60 seconds...');
        await new Promise((r) => setTimeout(r, 60000));
        continue;
      }
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (data.length === 0) break;

    results.push(...data);
    if (data.length < limit) break;
    offset += limit;

    // Be nice to the API
    await new Promise((r) => setTimeout(r, 500));
  }

  return results;
}

// Fetch a single batch with full details
async function fetchBatchDetails(id) {
  const url = `${BREWFATHER_API}/batches/${id}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Basic ${AUTH}`,
    },
  });

  if (!response.ok) {
    if (response.status === 429) {
      console.log('Rate limited, waiting 60 seconds...');
      await new Promise((r) => setTimeout(r, 60000));
      return fetchBatchDetails(id);
    }
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Fetch a single recipe with full details
async function fetchRecipeDetails(id) {
  const url = `${BREWFATHER_API}/recipes/${id}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Basic ${AUTH}`,
    },
  });

  if (!response.ok) {
    if (response.status === 429) {
      console.log('Rate limited, waiting 60 seconds...');
      await new Promise((r) => setTimeout(r, 60000));
      return fetchRecipeDetails(id);
    }
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function main() {
  console.log('Fetching batches from Brewfather...');
  const batchList = await fetchAll('batches');
  console.log(`Found ${batchList.length} batches`);

  // Fetch full details for each batch
  const batchesWithNotes = [];
  for (const batch of batchList) {
    console.log(`Fetching details for batch #${batch.batchNo}: ${batch.name || batch.recipe?.name || 'Unknown'}...`);
    try {
      const details = await fetchBatchDetails(batch._id);

      // Extract all note-related fields
      const notes = {
        batchNo: details.batchNo,
        name: details.name || details.recipe?.name || 'Unknown',
        notes: details.notes,
        batchNotes: details.batchNotes,
        tasteNotes: details.tasteNotes,
        brewNotes: details.brewNotes,
        fermentationNotes: details.fermentationNotes,
        bottlingNotes: details.bottlingNotes,
        // Check for any other string fields that might contain notes
        tasteRating: details.tasteRating,
        tastingNote: details.tastingNote,
      };

      // Only include if there are any notes
      const hasNotes = Object.values(notes).some(v => v && typeof v === 'string' && v.trim());
      if (hasNotes) {
        batchesWithNotes.push(notes);
      }

      // Rate limit
      await new Promise((r) => setTimeout(r, 300));
    } catch (err) {
      console.error(`Error fetching batch ${batch.batchNo}: ${err.message}`);
    }
  }

  console.log(`\nFetching recipes from Brewfather...`);
  const recipeList = await fetchAll('recipes');
  console.log(`Found ${recipeList.length} recipes`);

  // Fetch full details for each recipe
  const recipesWithNotes = [];
  for (const recipe of recipeList) {
    console.log(`Fetching details for recipe: ${recipe.name}...`);
    try {
      const details = await fetchRecipeDetails(recipe._id);

      // Extract all note-related fields
      const notes = {
        name: details.name,
        notes: details.notes,
        description: details.description,
        tasteNotes: details.tasteNotes,
      };

      // Only include if there are any notes
      const hasNotes = Object.values(notes).some(v => v && typeof v === 'string' && v.trim());
      if (hasNotes) {
        recipesWithNotes.push(notes);
      }

      // Rate limit
      await new Promise((r) => setTimeout(r, 300));
    } catch (err) {
      console.error(`Error fetching recipe ${recipe.name}: ${err.message}`);
    }
  }

  // Write output
  const output = {
    fetchedAt: new Date().toISOString(),
    batches: batchesWithNotes,
    recipes: recipesWithNotes,
  };

  const outputPath = path.join(process.cwd(), 'data/brewfather-notes.json');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`\nWrote notes to ${outputPath}`);

  // Print summary
  console.log('\n=== BATCHES WITH NOTES ===');
  for (const batch of batchesWithNotes) {
    console.log(`\nBatch #${batch.batchNo}: ${batch.name}`);
    if (batch.notes) console.log(`  Notes: ${batch.notes}`);
    if (batch.batchNotes) console.log(`  Batch Notes: ${batch.batchNotes}`);
    if (batch.brewNotes) console.log(`  Brew Notes: ${batch.brewNotes}`);
    if (batch.tasteNotes) console.log(`  Taste Notes: ${batch.tasteNotes}`);
    if (batch.fermentationNotes) console.log(`  Fermentation Notes: ${batch.fermentationNotes}`);
    if (batch.bottlingNotes) console.log(`  Bottling Notes: ${batch.bottlingNotes}`);
  }

  console.log('\n=== RECIPES WITH NOTES ===');
  for (const recipe of recipesWithNotes) {
    console.log(`\nRecipe: ${recipe.name}`);
    if (recipe.notes) console.log(`  Notes: ${recipe.notes}`);
    if (recipe.description) console.log(`  Description: ${recipe.description}`);
    if (recipe.tasteNotes) console.log(`  Taste Notes: ${recipe.tasteNotes}`);
  }
}

main().catch(console.error);
