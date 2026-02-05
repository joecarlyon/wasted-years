#!/usr/bin/env node
/**
 * Add Brewfather notes to existing batch records
 */

const fs = require('fs');
const path = require('path');

const NOTES_JSON = path.join(__dirname, '../data/brewfather-notes.json');
const BATCHES_TS = path.join(__dirname, '../data/batches.ts');

function main() {
  // Load the notes JSON
  const notesData = JSON.parse(fs.readFileSync(NOTES_JSON, 'utf-8'));

  // Build a map of batchNo -> notes
  const notesMap = new Map();
  for (const batch of notesData.batches) {
    // Extract brewing notes from the notes array
    const brewingNotes = [];
    if (batch.notes && Array.isArray(batch.notes)) {
      for (const note of batch.notes) {
        if (note.note && note.note.trim() && note.type !== 'statusChanged') {
          brewingNotes.push(note.note.trim());
        }
      }
    }

    // Add batchNotes if present
    if (batch.batchNotes && batch.batchNotes.trim()) {
      brewingNotes.unshift(batch.batchNotes.trim());
    }

    notesMap.set(batch.batchNo, {
      brewingNotes: brewingNotes.length > 0 ? brewingNotes.join(' | ') : null,
      tastingNotes: batch.tasteNotes?.trim() || null,
    });
  }

  // Read the batches.ts file
  let content = fs.readFileSync(BATCHES_TS, 'utf-8');

  // Parse the batches array
  const arrayMatch = content.match(/export const batches: Batch\[\] = (\[[\s\S]*\])\s*$/);
  if (!arrayMatch) {
    console.error('Could not parse batches.ts');
    process.exit(1);
  }

  const batches = eval(arrayMatch[1]);
  console.log(`Found ${batches.length} batches`);

  // Update batches with notes
  let updated = 0;
  for (const batch of batches) {
    const notes = notesMap.get(batch.batchNo);
    if (notes) {
      if (notes.brewingNotes && !batch.brewingNotes) {
        batch.brewingNotes = notes.brewingNotes;
        console.log(`Added brewing notes to batch #${batch.batchNo} (${batch.name})`);
        updated++;
      }
      if (notes.tastingNotes && !batch.tastingNotes) {
        batch.tastingNotes = notes.tastingNotes;
        console.log(`Added tasting notes to batch #${batch.batchNo} (${batch.name})`);
        updated++;
      }
    }
  }

  // Write updated batches
  const output = `import { Batch } from '@/types'

export const batches: Batch[] = ${JSON.stringify(batches, null, 2)}
`;

  fs.writeFileSync(BATCHES_TS, output);
  console.log(`\nUpdated ${updated} fields in ${batches.length} batches`);
}

main();
