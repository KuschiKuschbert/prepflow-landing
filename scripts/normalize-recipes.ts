import { loadEnvConfig } from '@next/env';
import { createClient } from '@supabase/supabase-js';
import { parseIngredientString } from '../lib/recipe-normalization/ingredient-parser';

// Load environment variables
loadEnvConfig(process.cwd());

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const DRY_RUN = process.argv.includes('--dry-run');

async function main() {
  console.log(`Starting recipe normalization... (Dry Run: ${DRY_RUN})`);

  // --- Part 1: Normalize standard ingredients table ---
  console.log('--- Processing ingredients table (skipping for now based on previous clean run) ---');
  /*
  // Code preserved but skipped for speed since verified clean
  const { data: ingredients, error } = await supabase
    .from('ingredients')
    .select('id, ingredient_name, cost_per_unit, unit');

  if (ingredients) {
      let updates = 0;
      for (const ing of ingredients) {
        if (!ing.ingredient_name) continue;
        const parsed = parseIngredientString(ing.ingredient_name);
        if (parsed) {
             const currentUnit = (ing.unit || '').toLowerCase();
             const isDefaultUnit = ['pc', 'piece', 'portion', '', 'item'].includes(currentUnit);
             if (parsed.name.length < ing.ingredient_name.length) {
                  // Logic to update... (omitted to focus on part 2)
             }
        }
      }
  }
  */
  let updates = 0;

  // --- Part 2: Normalize ai_specials table ---
  console.log('\n--- Processing ai_specials table ---');

  const BATCH_SIZE = 1000;
  let offset = 0;
  let hasMore = true;
  let totalProcessed = 0;
  let specialUpdates = 0;

  while (hasMore) {
      console.log(`Fetching batch ${offset} to ${offset + BATCH_SIZE - 1}...`);
      const { data: specials, error: specialsError } = await supabase
        .from('ai_specials')
        .select('id, name, ingredients')
        .range(offset, offset + BATCH_SIZE - 1);

      if (specialsError) {
          console.error('Error fetching specials:', specialsError);
          break;
      }

      if (!specials || specials.length === 0) {
          hasMore = false;
          break;
      }

      totalProcessed += specials.length;
      console.log(`Scanning ${specials.length} specials...`);

      for (const special of specials) {
          if (!Array.isArray(special.ingredients)) continue;

          let hasChanges = false;
          const newIngredients = special.ingredients.map((ing: string | { name?: string; unit?: string; quantity?: number; original_text?: string }) => {
              // Handle string ingredients
              if (typeof ing === 'string') {
                  const parsed = parseIngredientString(ing);
                  if (parsed && (parsed.quantity !== 1 || parsed.unit !== 'pc')) {
                      // Found structured data! Convert to object.
                      hasChanges = true;
                      return {
                          name: parsed.name,
                          quantity: parsed.quantity,
                          unit: parsed.unit,
                          original_text: ing
                      };
                  }
                  return ing;
              }

              // Handle object ingredients
              if (typeof ing === 'object' && ing !== null) {
                  // Check if it looks unparsed (1 pc) but has rich name
                  const currentQty = ing.quantity || 1;
                  const currentUnit = (ing.unit || '').toLowerCase();
                  const isDefault = ['pc', 'piece', 'portion', '', 'item'].includes(currentUnit);

                  if (isDefault || (currentQty === 1 && currentUnit === 'pc')) {
                      // Try parsing the name
                      const nameToParse = ing.original_text || ing.name;
                      if (!nameToParse) return ing;

                      const parsed = parseIngredientString(nameToParse);
                      if (parsed && (parsed.quantity !== 1 || parsed.unit !== 'pc')) {
                           hasChanges = true;
                           return {
                               ...ing,
                               name: parsed.name, // Update name to be cleaner
                               quantity: parsed.quantity,
                               unit: parsed.unit
                           };
                      }
                  }
              }
              return ing;
          });

          if (hasChanges) {
              if (specialUpdates < 10) console.log(`[Special: ${special.name}] Updating ingredients...`);
              if (!DRY_RUN) {
                  const { error: updateError } = await supabase
                      .from('ai_specials')
                      .update({ ingredients: newIngredients })
                      .eq('id', special.id);

                  if (updateError) {
                      console.error(`  Failed to update special ${special.id}:`, updateError);
                  } else {
                      specialUpdates++;
                  }
              } else {
                  specialUpdates++;
              }
          }
      }

      offset += BATCH_SIZE;
  }

  console.log(`Completed specials. ${specialUpdates} recipes ${DRY_RUN ? 'would be' : 'were'} updated out of ${totalProcessed} scanned.`);
  updates += specialUpdates;

  console.log(`\nTotal completed. ${updates} records ${DRY_RUN ? 'would be' : 'were'} processed.`);
}

main().catch(console.error);
