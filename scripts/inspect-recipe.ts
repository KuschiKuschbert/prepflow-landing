import { loadEnvConfig } from '@next/env';
import { createClient } from '@supabase/supabase-js';

loadEnvConfig(process.cwd());

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const searchTerm = 'Skillet Sausages with Black-Eyed Peas';
  console.log(`Searching for recipe like: "${searchTerm}"...`);

  const { data: recipes, error } = await supabase
    .from('ai_specials')
    .select('*')
    .ilike('name', `%${searchTerm}%`);

  if (error) {
    console.error('Error:', error);
    return;
  }

  if (!recipes || recipes.length === 0) {
    console.log('No recipe found.');
    return;
  }

  console.log(`Found ${recipes.length} recipes.`);
  for (const recipe of recipes) {
      console.log(`\nID: ${recipe.id}`);
      console.log(`Name: ${recipe.name}`);
      console.log('Recipe Dump:', JSON.stringify(recipe, null, 2));

      console.log('Description:', recipe.description);
      console.log('AI Prompt:', recipe.ai_prompt);
      console.log('Meta:', JSON.stringify(recipe.meta, null, 2));

      // Check instructions specifically as they naturally contain quantities
      console.log('Instructions Dump:', JSON.stringify(recipe.instructions, null, 2));

      // Also log what our parser WOULD find
      /*
      if (Array.isArray(recipe.ingredients)) {
          console.log('--- Parser Check ---');
          const { parseIngredientString } = require('../lib/recipe-normalization/ingredient-parser');
          recipe.ingredients.forEach(ing => {
               if (typeof ing === 'string') return;
               const text = ing.original_text || ing.name;
               const parsed = parseIngredientString(text);
               console.log(`Original: "${text}" -> Parsed:`, parsed);
          });
      }
      */
  }
}

main().catch(console.error);
