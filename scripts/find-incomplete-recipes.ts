#!/usr/bin/env tsx
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load env
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

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function main() {
  console.log('🔍 Identifying incomplete recipes...');

  // Fetch recipes with ingredients but no source match (recovered ones)
  const { data: recipes, error } = await supabase
    .from('ai_specials')
    //.select('id, name, ingredients') // Fetching full ingredients might be heavy for all, but needed for check
    .select('id, name, ingredients')
    .is('source_url', null)
    .not('ingredients', 'is', null);

  if (error) {
    console.error('Error fetching recipes:', error);
    process.exit(1);
  }

  const matches = [];

  for (const recipe of recipes) {
    if (
      !recipe.ingredients ||
      !Array.isArray(recipe.ingredients) ||
      recipe.ingredients.length === 0
    )
      continue;

    let defaultCount = 0;
    const total = recipe.ingredients.length;

    for (const ing of recipe.ingredients) {
      // Check for default "1 pc" signature
      // Also check if name is just "salt" or something that truly is 1 pc vs "chicken breast"
      if (ing.quantity === 1 && ing.unit === 'pc') {
        defaultCount++;
      }
    }

    // Heuristic: If >50% of ingredients are 1 pc, it's likely incomplete
    if (defaultCount / total > 0.5) {
      matches.push({
        id: recipe.id,
        name: recipe.name,
        total,
        defaultCount,
        ingredients: recipe.ingredients,
      });
    }
  }

  console.log(`✅ Found ${matches.length} incomplete recipes.`);

  if (matches.length > 0) {
    console.log('Examples:');
    matches
      .slice(0, 5)
      .forEach(m => console.log(`- ${m.name} (${m.defaultCount}/${m.total} default)`));

    // Save ID list to file for the next script to consume
    fs.writeFileSync(
      'incomplete-recipes.json',
      JSON.stringify(
        matches.map(m => m.id),
        null,
        2,
      ),
    );
    console.log('📝 Saved IDs to incomplete-recipes.json');
  }
}

main();
