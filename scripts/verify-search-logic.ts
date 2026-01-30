import { loadEnvConfig } from '@next/env';
import { createClient } from '@supabase/supabase-js';
import { ingredientsMatch } from '../lib/ingredient-normalization';

// Load env
loadEnvConfig(process.cwd());

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('Fetching stock...');
  const { data: stockData } = await supabase
    .from('ingredients')
    .select('ingredient_name')
    .gt('current_stock', 0);

  if (!stockData) return;

  const stockNames = stockData.map(s => s.ingredient_name);
  console.log(`Stock items: ${stockNames.length}`);

  // Simulation: Search for recipes containing any of these
  // Actually, let's just fetch a few known recipes and test the matcher against them manually
  // to see if the logic holds up.

  // We want to test why a recipe might fail 90% match.
  // Let's fetch a simple one.
  const { data: recipes } = await supabase.from('ai_specials').select('*').limit(10);

  if (!recipes) return;

  recipes.forEach(recipe => {
    let matchCount = 0;
    const totalIngredients = recipe.ingredients.length;

    console.log(`\nRecipe: ${recipe.name} (${totalIngredients} ingredients)`);

    recipe.ingredients.forEach((ing: string | { name: string }) => {
      const ingName = typeof ing === 'string' ? ing : ing.name;
      let matched = false;

      // Try to match against stock
      for (const stockItem of stockNames) {
        if (ingredientsMatch(stockItem, ingName)) {
          matched = true;
          break;
        }
      }

      if (matched) matchCount++;
      else console.log(`  MISSING: ${ingName}`);
    });

    const pct = Math.round((matchCount / totalIngredients) * 100);
    console.log(`  -> Match: ${pct}%`);
  });
}

main();
