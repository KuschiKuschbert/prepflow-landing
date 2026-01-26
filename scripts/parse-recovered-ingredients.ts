#!/usr/bin/env tsx
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load environment from .env.local manually
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=').replace(/^["']|["']$/g, '');
      if (key && !process.env[key]) {
        process.env[key] = value;
      }
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// --- Unit Conversion Logic ---

const UNIT_CONVERSIONS: Record<string, { factor: number; target: string; type: 'volume' | 'weight' }> = {
  // Volume to ml
  'cup': { factor: 236.588, target: 'ml', type: 'volume' },
  'cups': { factor: 236.588, target: 'ml', type: 'volume' },
  'c': { factor: 236.588, target: 'ml', type: 'volume' },
  'teaspoon': { factor: 4.92892, target: 'ml', type: 'volume' },
  'teaspoons': { factor: 4.92892, target: 'ml', type: 'volume' },
  'tsp': { factor: 4.92892, target: 'ml', type: 'volume' },
  't': { factor: 4.92892, target: 'ml', type: 'volume' },
  'tablespoon': { factor: 14.7868, target: 'ml', type: 'volume' },
  'tablespoons': { factor: 14.7868, target: 'ml', type: 'volume' },
  'tbsp': { factor: 14.7868, target: 'ml', type: 'volume' },
  'tbs': { factor: 14.7868, target: 'ml', type: 'volume' },
  'T': { factor: 14.7868, target: 'ml', type: 'volume' },
  'fluid ounce': { factor: 29.5735, target: 'ml', type: 'volume' },
  'fluid ounces': { factor: 29.5735, target: 'ml', type: 'volume' },
  'fl oz': { factor: 29.5735, target: 'ml', type: 'volume' },
  'pint': { factor: 473.176, target: 'ml', type: 'volume' },
  'pints': { factor: 473.176, target: 'ml', type: 'volume' },
  'pt': { factor: 473.176, target: 'ml', type: 'volume' },
  'quart': { factor: 946.353, target: 'ml', type: 'volume' },
  'quarts': { factor: 946.353, target: 'ml', type: 'volume' },
  'qt': { factor: 946.353, target: 'ml', type: 'volume' },
  'gallon': { factor: 3785.41, target: 'ml', type: 'volume' },
  'gallons': { factor: 3785.41, target: 'ml', type: 'volume' },
  'gal': { factor: 3785.41, target: 'ml', type: 'volume' },
  'liter': { factor: 1000, target: 'ml', type: 'volume' },
  'liters': { factor: 1000, target: 'ml', type: 'volume' },
  'l': { factor: 1000, target: 'ml', type: 'volume' },
  'milliliter': { factor: 1, target: 'ml', type: 'volume' },
  'milliliters': { factor: 1, target: 'ml', type: 'volume' },
  'ml': { factor: 1, target: 'ml', type: 'volume' },

  // Weight to g
  'pound': { factor: 453.592, target: 'g', type: 'weight' },
  'pounds': { factor: 453.592, target: 'g', type: 'weight' },
  'lb': { factor: 453.592, target: 'g', type: 'weight' },
  'lbs': { factor: 453.592, target: 'g', type: 'weight' },
  'ounce': { factor: 28.3495, target: 'g', type: 'weight' },
  'ounces': { factor: 28.3495, target: 'g', type: 'weight' },
  'oz': { factor: 28.3495, target: 'g', type: 'weight' },
  'gram': { factor: 1, target: 'g', type: 'weight' },
  'grams': { factor: 1, target: 'g', type: 'weight' },
  'g': { factor: 1, target: 'g', type: 'weight' },
  'kilogram': { factor: 1000, target: 'g', type: 'weight' },
  'kilograms': { factor: 1000, target: 'g', type: 'weight' },
  'kg': { factor: 1000, target: 'g', type: 'weight' },
};

// Common volume-to-weight conversions for key ingredients (density approximation)
const INGREDIENT_DENSITIES: Record<string, number> = {
  'flour': 120 / 236.588, // ~0.5 g/ml (lightly packed)
  'sugar': 200 / 236.588, // ~0.85 g/ml
  'butter': 227 / 236.588, // ~0.96 g/ml
  'rice': 195 / 236.588,  // ~0.82 g/ml
  'cheese': 113 / 236.588, // ~0.48 g/ml (shredded)
};

function chefRound(val: number): number {
  if (val < 5) return Math.round(val * 2) / 2;
  if (val <= 50) return Math.round(val / 5) * 5;
  if (val <= 100) return Math.round(val / 10) * 10;
  if (val <= 500) return Math.round(val / 20) * 20;
  return Math.round(val / 50) * 50;
}

function parseQuantity(text: string): { quantity: number; unit: string; name: string } | null {
  // Normalize Unicode fractions
  const normalizedText = text.trim()
      .replace(/½/g, ' 1/2')
      .replace(/⅓/g, ' 1/3')
      .replace(/⅔/g, ' 2/3')
      .replace(/¼/g, ' 1/4')
      .replace(/¾/g, ' 3/4')
      .replace(/⅛/g, ' 1/8')
      .replace(/⅜/g, ' 3/8')
      .replace(/⅝/g, ' 5/8')
      .replace(/⅞/g, ' 7/8')
      .trim();

  // Regex for quantity at start of string, optionally inside parens
  // Matches "1", "(1)", "1.5", "1/2", "1 1/2"
  const quantityRegex = /^(\(?\d+[\s-]+\d+\/\d+|\(?\d+\/\d+|\(?\d*\.?\d+)\s*(.*)/;
  const match = normalizedText.match(quantityRegex);

  if (!match) {
    return { quantity: 1, unit: 'pc', name: text.trim() }; // Default if no quantity found
  }

  const quantityRaw = match[1].replace('-', ' ').replace('(', '').replace(')', '');
  const rest = match[2];

  // Parse numeric value
  let quantity = 0;
  if (quantityRaw.includes('/')) {
    const parts = quantityRaw.split(' ');
    for (const part of parts) {
      if (part.includes('/')) {
        const [num, den] = part.split('/').map(Number);
        if (den !== 0) quantity += num / den;
      } else {
        quantity += Number(part);
      }
    }
  } else {
    quantity = Number(quantityRaw);
  }

  // Parse unit
  // Split rest by space to get potential unit
  const words = rest.split(/\s+/);
  let unit = '';
  let name = rest;

  if (words.length > 0) {
    const firstWord = words[0].toLowerCase().replace('.', ''); // Remove period from 'oz.'
    const unitInfo = UNIT_CONVERSIONS[firstWord];

    // Check for two-word units like "fluid ounce"
    if (!unitInfo && words.length > 1) {
       const twoWords = `${words[0]} ${words[1]}`.toLowerCase();
       const twoWordUnit = UNIT_CONVERSIONS[twoWords];
       if (twoWordUnit) {
         unit = twoWordUnit.target;
         quantity = quantity * twoWordUnit.factor;
         name = words.slice(2).join(' ');

         // Apply density check if needed? Not heavily needed for recovery, sticking to basic volume/weight logic
       }
    }

    if (!unit && unitInfo) {
      unit = unitInfo.target;
      quantity = quantity * unitInfo.factor;
      name = words.slice(1).join(' ');

      // Special logic: convert solid staples (flour, sugar) from volume to weight if we have a density
      if (unit === 'ml') {
        for (const [key, density] of Object.entries(INGREDIENT_DENSITIES)) {
          if (name.toLowerCase().includes(key)) {
            quantity = quantity * density;
            unit = 'g';
            break;
          }
        }
      }
    } else if (!unit) {
      // No recognized unit
      unit = 'pc';
      name = rest;
    }
  }

  // Apply Chef Rounding
  // Only round if we actually converted (unit != pc) or if it's a messy decimal
  if (unit !== 'pc' || quantity % 1 !== 0) {
      quantity = chefRound(quantity);
  }

  return { quantity, unit, name: name.trim() };
}

async function main() {
  console.log('🧪 Parsing recovered ingredients...\n');

  let totalProcessed = 0;
  let totalUpdated = 0;
  let totalSkipped = 0;
  const BATCH_SIZE = 20;
  const FETCH_SIZE = 1000;
  let from = 0;

  while (true) {
      console.log(`Fetching recipes range ${from} to ${from + FETCH_SIZE - 1}...`);

      const { data: recipes, error } = await supabase
        .from('ai_specials')
        .select('id, name, ingredients')
        .is('source_url', null)
        .not('ingredients', 'is', null)
        .range(from, from + FETCH_SIZE - 1);

      if (error) {
        console.error('Error fetching recipes:', error);
        break;
      }

      if (!recipes || recipes.length === 0) {
          break; // No more recipes
      }

      console.log(`📊 Found ${recipes.length} recipes in this batch`);

      let batchUpdated = 0;
      let batchSkipped = 0;

      for (let i = 0; i < recipes.length; i += BATCH_SIZE) {
          const batch = recipes.slice(i, i + BATCH_SIZE);

          await Promise.all(batch.map(async (recipe) => {
             const currentIngredients = recipe.ingredients;
             if (!Array.isArray(currentIngredients) || currentIngredients.length === 0) {
                 batchSkipped++;
                 return;
             }

             let hasChanges = false;
             const newIngredients = currentIngredients.map((ing: any) => {
                 if (ing.original_text) {
                     const parsed = parseQuantity(ing.original_text);
                     if (parsed) {
                         // Check strictly if anything crucial changes
                         // (note: this logic assumes 1/pc is the "unparsed" state we want to move away from)
                         if (parsed.quantity !== ing.quantity || parsed.unit !== ing.unit) {
                             hasChanges = true;
                         }
                         return {
                             ...parsed,
                             original_text: ing.original_text
                         };
                     }
                 }
                 return ing;
             });

             if (hasChanges) {
                 const { error: upErr } = await supabase
                    .from('ai_specials')
                    .update({ ingredients: newIngredients })
                    .eq('id', recipe.id);

                 if (upErr) {
                     console.error(`❌ Failed to update ${recipe.name}:`, upErr.message);
                 } else {
                     batchUpdated++;
                 }
             } else {
                 batchSkipped++;
             }
          }));

          process.stdout.write(`\r✅ Updates in current fetch: ${batchUpdated}/${recipes.length}`);
      }

      totalProcessed += recipes.length;
      totalUpdated += batchUpdated;
      totalSkipped += batchSkipped;

      console.log(`\nBatch complete. Total Processed: ${totalProcessed}`);

      if (recipes.length < FETCH_SIZE) {
          break; // Less than requested means we hit the end
      }

      from += FETCH_SIZE;
  }

  console.log(`\n\n✅ Parsing complete! Total Processed: ${totalProcessed}, Updated: ${totalUpdated}, Skipped: ${totalSkipped}`);
}

main().catch(console.error);
