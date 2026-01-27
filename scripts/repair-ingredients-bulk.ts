
import { loadEnvConfig } from '@next/env';
import { createClient } from '@supabase/supabase-js';
import { normalizeUnit } from '../lib/unit-conversion/unitMappings';

// Load env
loadEnvConfig(process.cwd());

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Batch size for AI prompt (process multiple recipes in one go)
const BATCH_SIZE_AI = 5;

// Simplified interface
interface RecipeToFix {
    id: string;
    name: string;
    instructions: string;
    ingredientNames: string;
    yield: string;
}

// Global stats
const stats = {
    totalScanned: 0,
    brokenFound: 0,
    repaired: 0,
    failedAI: 0,
    failedDB: 0,
    failedParsing: 0
};

async function repairBatch(recipes: RecipeToFix[]) {
    try {
        // Construct a multi-recipe prompt
        const recipeText = recipes.map((r, i) => `
        --- RECIPE ${i + 1} (ID: ${r.id}) ---
        Name: ${r.name}
        Yield: ${r.yield}
        Instructions: ${r.instructions.substring(0, 800)}...
        Ingredients (names only): ${r.ingredientNames}
        `).join('\n');

        const prompt = `
        You are a culinary expert. Recover quantities for these ${recipes.length} recipes.

        ${recipeText}

        Return ONLY a JSON array of arrays.
        Outer array has ${recipes.length} elements (one per recipe).
        Inner array contains ingredient objects: [{"name": "item", "quantity": 1, "unit": "g"}].

        CRITICAL RULES:
        1. Convert all quantities to METRIC (g, ml, kg, L).
        2. Use "pc" only for whole items.
        3. No explanations. Just JSON.
        `;

        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'llama3.2:3b',
                prompt: `System: You are a culinary AI that outputs ONLY JSON.\nUser: ${prompt}`,
                stream: false,
                options: { temperature: 0.1, num_ctx: 8192 } // Increased context
            })
        });

        if (!response.ok) {
            console.error(`Ollama Error: ${response.statusText}`);
            stats.failedAI += recipes.length;
            return null;
        }

        const result = await response.json();
        const content = result.response;

        if (!content) {
            console.error('Empty response from Ollama');
            stats.failedAI += recipes.length;
            return null;
        }

        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            try {
                const parsed = JSON.parse(jsonMatch[0]);

                // Validate we got an array of arrays
                if (Array.isArray(parsed) && parsed.length === recipes.length) {
                    return parsed; // Array of ingredient lists
                } else {
                    console.error(`Mismatch: Expected ${recipes.length} recipes, got ${Array.isArray(parsed) ? parsed.length : 'invalid type'}`);
                    console.error('Partial Response:', content.substring(0, 200) + '...');
                    stats.failedParsing += recipes.length;
                }
            } catch (e) {
                 console.error('JSON Parse Error:', e);
                 console.error('Raw Content:', content);
                 stats.failedParsing += recipes.length;
            }
        } else {
            console.error('No JSON array found in response');
            console.error('Raw Content:', content);
            stats.failedParsing += recipes.length;
        }
        return null; // parse failed
    } catch (e) {
        console.error('Batch error:', e);
        stats.failedAI += recipes.length;
        return null;
    }
}

async function main() {
  console.log('Starting OPTIMIZED local repair (Targeting remaining broken)...');

  let offset = 0;
  const DB_BATCH_SIZE = 1000; // Increased to scan faster
  let hasMore = true;

  while (hasMore) {
      const { data: specials, error } = await supabase
        .from('ai_specials')
        .select('id, name, ingredients, instructions, meta')
        .range(offset, offset + DB_BATCH_SIZE - 1);

      if (error || !specials || specials.length === 0) {
          hasMore = false;
          break;
      }

      // Only log every 5th batch to reduce noise
      if (offset % 5000 === 0) console.log(`Scanning database offset ${offset}...`);
      stats.totalScanned += specials.length;

      const brokenList = specials.filter(s => {
          if (!Array.isArray(s.ingredients)) return false;
          const brokenCount = s.ingredients.filter((i: any) => {
              const u = (i.unit || '').toLowerCase();
              const q = i.quantity;
              const n = i.name || '';
              return (u === 'pc' || u === '') && q === 1 && !/\d/.test(n);
          }).length;
          return brokenCount > (s.ingredients.length / 2);
      })
      .map(s => ({
          id: s.id,
          name: s.name,
          instructions: Array.isArray(s.instructions) ? s.instructions.join('\n') : s.instructions,
          ingredientNames: Array.isArray(s.ingredients) ? s.ingredients.map((i: any) => typeof i === 'string' ? i : i.name).join(', ') : 'Unknown',
          yield: `${s.meta?.yield || 4} ${s.meta?.yield_unit || 'servings'}`
      }));

      // Only log if we found something or running verbose
      if (brokenList.length > 0) {
           stats.brokenFound += brokenList.length;
           console.log(`Found ${brokenList.length} broken recipes to fix in this batch.`);
      }

      // Process in AI Batches
      for (let i = 0; i < brokenList.length; i += BATCH_SIZE_AI) {
          const chunk = brokenList.slice(i, i + BATCH_SIZE_AI);
          console.log(`Processing AI Batch ${Math.floor(i / BATCH_SIZE_AI) + 1} (${chunk.length} recipes)...`);

          const results = await repairBatch(chunk);

          if (results) {
              // Apply fixes sequentially
              for (let j = 0; j < chunk.length; j++) {
                  const recipe = chunk[j];
                  const rawIngredients = results[j];

                  if (!Array.isArray(rawIngredients)) {
                      console.error(`  Skipping ${recipe.name}: AI returned invalid ingredient structure.`);
                      stats.failedParsing++;
                      continue;
                  }

                  // Apply Chef Rounding & Normalization
                  const cleanedIngredients = rawIngredients.map((p: any) => {
                        let qty = typeof p.quantity === 'number' ? p.quantity : parseFloat(p.quantity) || 1;
                        if (qty < 5) qty = Math.round(qty * 2) / 2;
                        else if (qty < 50) qty = Math.round(qty / 5) * 5;
                        else if (qty < 100) qty = Math.round(qty / 10) * 10;
                        else if (qty < 500) qty = Math.round(qty / 20) * 20;
                        else qty = Math.round(qty / 50) * 50;
                        if (qty === 0) qty = 1;

                        return {
                            name: p.name,
                            quantity: qty,
                            unit: normalizeUnit(p.unit || 'pc'),
                            original_text: `${qty} ${p.unit} ${p.name}`
                        };
                  });

                  // Update DB
                  const { error: upErr } = await supabase
                      .from('ai_specials')
                      .update({ ingredients: cleanedIngredients })
                      .eq('id', recipe.id);

                  if (!upErr) {
                      console.log(`  Fixed: ${recipe.name}`);
                      stats.repaired++;
                  } else {
                      console.error(`  Failed to update DB for ${recipe.name}:`, upErr.message);
                      stats.failedDB++;
                  }
              }
          } else {
              console.log('  Batch failed to generate valid JSON. Skipping.');
              // Counters already incremented in repairBatch
          }
      }

      offset += DB_BATCH_SIZE;
  }

  console.log('\n--- REPAIR COMPLETION REPORT ---');
  console.log(`Total Scanned: ${stats.totalScanned}`);
  console.log(`Broken Recipes Found: ${stats.brokenFound}`);
  console.log(`Successfully Repaired: ${stats.repaired}`);
  console.log(`Failed (AI Network): ${stats.failedAI}`);
  console.log(`Failed (AI Parsing): ${stats.failedParsing}`);
  console.log(`Failed (Database): ${stats.failedDB}`);
}

main().catch(console.error);
