/**
 * One-off script to populate empty dishes and recipes in production.
 * Requires SEED_ADMIN_KEY and ALLOW_POPULATE_IN_PRODUCTION (in production).
 *
 * Usage:
 *   npx tsx scripts/populate-empty-dishes-production.ts
 *   npx tsx scripts/populate-empty-dishes-production.ts --userId=UUID
 *   npx tsx scripts/populate-empty-dishes-production.ts --dry-run
 */

import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { dishHasDirectIngredients } from '@/lib/populate-helpers/populate-empty-dishes-helpers';
import { supabaseAdmin } from '@/lib/supabase';
import { populateDishes } from '@/app/api/db/populate-empty-dishes/helpers/populateDishes';
import { populateRecipes } from '@/app/api/db/populate-empty-dishes/helpers/populateRecipes';
import type { PopulateRecipesResult } from '@/app/api/db/populate-empty-dishes/types';

const DRY_RUN = process.argv.includes('--dry-run');
const userIdArg = process.argv.find(a => a.startsWith('--userId='));
const userId = userIdArg ? userIdArg.replace(/^--userId=/, '') : undefined;

function checkAuth(): void {
  const adminKey = process.env.SEED_ADMIN_KEY;
  if (!adminKey) {
    console.error('Missing SEED_ADMIN_KEY. Set it in .env.local or environment.');
    process.exit(1);
  }

  if (process.env.NODE_ENV === 'production') {
    if (process.env.ALLOW_POPULATE_IN_PRODUCTION !== 'true') {
      console.error('Production run requires ALLOW_POPULATE_IN_PRODUCTION=true. Use with care.');
      process.exit(1);
    }
  }
}

async function main() {
  checkAuth();

  if (!supabaseAdmin) {
    console.error('Supabase admin client not available.');
    process.exit(1);
  }

  console.log(
    `Populating empty dishes and recipes... (dry-run: ${DRY_RUN}${userId ? `, userId: ${userId}` : ''})`,
  );

  let dishesQuery = supabaseAdmin.from('dishes').select('id, dish_name').order('dish_name');
  if (userId) {
    dishesQuery = dishesQuery.eq('user_id', userId);
  }
  const { data: dishes, error: dishesError } = await dishesQuery;

  if (dishesError) {
    console.error('Failed to fetch dishes:', dishesError.message);
    process.exit(1);
  }

  let ingredientsQuery = supabaseAdmin
    .from('ingredients')
    .select('id, ingredient_name, unit')
    .order('ingredient_name');
  if (userId) {
    ingredientsQuery = ingredientsQuery.eq('user_id', userId);
  }
  const { data: ingredients, error: ingredientsError } = await ingredientsQuery;

  if (ingredientsError) {
    console.error('Failed to fetch ingredients:', ingredientsError.message);
    process.exit(1);
  }

  if (!ingredients || ingredients.length === 0) {
    console.error('No ingredients available.');
    process.exit(1);
  }

  if (dishes && dishes.length > 0) {
    if (DRY_RUN) {
      const emptyDishes: Array<{ id: string; dish_name: string }> = [];
      for (const dish of dishes) {
        const hasDirect = await dishHasDirectIngredients(dish.id);
        if (!hasDirect) emptyDishes.push(dish);
      }
      console.log(`Would populate ${emptyDishes.length} empty dishes.`);
    } else {
      const dishesResult = await populateDishes(dishes, ingredients);
      console.log(
        `Dishes: ${dishesResult.populated.length} populated, ${dishesResult.skipped.length} skipped, ${dishesResult.errors.length} errors`,
      );
      if (dishesResult.errors.length > 0) {
        dishesResult.errors.forEach(e => console.error(`  Error: ${e.dish_name} - ${e.error}`));
      }
    }
  } else {
    console.log('No dishes found.');
  }

  let recipesQuery = supabaseAdmin
    .from('recipes')
    .select('id, name, recipe_name')
    .order('recipe_name');
  if (userId) {
    recipesQuery = recipesQuery.eq('user_id', userId);
  }
  const { data: recipes, error: recipesError } = await recipesQuery;

  let recipesResult: PopulateRecipesResult = {
    populated: [],
    skipped: [],
    errors: [],
  };

  if (!recipesError && recipes && recipes.length > 0) {
    if (DRY_RUN) {
      const { recipeHasIngredients } =
        await import('@/lib/populate-helpers/populate-empty-dishes-helpers');
      let emptyCount = 0;
      for (const r of recipes) {
        const has = await recipeHasIngredients(r.id);
        if (!has) emptyCount++;
      }
      console.log(`Would populate ${emptyCount} empty recipes.`);
    } else {
      recipesResult = await populateRecipes(recipes, ingredients);
      console.log(
        `Recipes: ${recipesResult.populated.length} populated, ${recipesResult.skipped.length} skipped, ${recipesResult.errors.length} errors`,
      );
      if (recipesResult.errors.length > 0) {
        recipesResult.errors.forEach(e => console.error(`  Error: ${e.recipe_name} - ${e.error}`));
      }
    }
  }

  console.log('Done.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
