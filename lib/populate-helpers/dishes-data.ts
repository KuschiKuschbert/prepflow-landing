/**
 * Helper functions for populating dishes (new dishes system for Menu Builder & Dish Builder)
 */

import { logger } from '@/lib/logger';
import { cleanSampleDishes } from '@/lib/sample-dishes-clean';
import { createSupabaseAdmin } from '@/lib/supabase';
import {
  buildDishIngredientsData,
  buildDishRecipesData,
  createDishMap,
  createLookupMaps,
  IngredientData,
} from './dishes-data-helpers';

// Minimal recipe interface - accepts both Recipe and RecipeRecord types
interface MinimalRecipe {
  id: string;
  name?: string;
  recipe_name?: string;
  [key: string]: unknown;
}

interface PopulateResults {
  cleaned: number;
  populated: Array<{ table: string; count: number }>;
  errors: Array<{ table: string; error: string }>;
}

/**
 * Populate dishes, dish_recipes, and dish_ingredients
 */
export async function populateDishes(
  supabaseAdmin: ReturnType<typeof createSupabaseAdmin>,
  results: PopulateResults,
  recipesData: MinimalRecipe[],
  ingredientsData: IngredientData[],
) {
  if (!recipesData || recipesData.length === 0) {
    logger.dev('No recipes available for dish creation');
    return;
  }

  const { recipeMap, ingredientMap } = createLookupMaps(recipesData, ingredientsData || []);

  // Create dishes
  const dishesToInsert = cleanSampleDishes.map(dish => ({
    dish_name: dish.dish_name,
    description: dish.description,
    selling_price: dish.selling_price,
  }));

  const { data: dishesData, error: dishesError } = await supabaseAdmin
    .from('dishes')
    .insert(dishesToInsert)
    .select();

  if (dishesError) {
    results.errors.push({ table: 'dishes', error: dishesError.message });
    logger.error('Error inserting dishes:', dishesError);
    return;
  }

  if (!dishesData || dishesData.length === 0) {
    logger.warn('No dishes were created');
    return;
  }

  results.populated.push({ table: 'dishes', count: dishesData.length });
  logger.dev(`✅ Created ${dishesData.length} dishes`);

  // Create dish_recipes links
  const dishMap = createDishMap(dishesData);
  const { data: dishRecipesData, skipped: skippedRecipes } = buildDishRecipesData(
    dishMap,
    recipeMap,
  );

  if (skippedRecipes.length > 0) {
    logger.warn(`Skipped ${skippedRecipes.length} recipe link(s):`, {
      skippedRecipes: [...new Set(skippedRecipes)],
    });
  }

  if (dishRecipesData.length > 0) {
    const { error: drError } = await supabaseAdmin.from('dish_recipes').insert(dishRecipesData);

    if (drError) {
      results.errors.push({ table: 'dish_recipes', error: drError.message });
      logger.error('Error inserting dish_recipes:', drError);
    } else {
      results.populated.push({ table: 'dish_recipes', count: dishRecipesData.length });
      logger.dev(`✅ Created ${dishRecipesData.length} dish-recipe links`);
    }
  }

  // Create dish_ingredients links (standalone ingredients)
  if (ingredientsData && ingredientsData.length > 0) {
    logger.dev('[populateDishes] Building dish-ingredient links', {
      totalIngredients: ingredientsData.length,
      ingredientMapSize: ingredientMap.size,
    });

    const { data: dishIngredientsData, skipped: skippedIngredients } = buildDishIngredientsData(
      dishMap,
      ingredientMap,
    );

    if (skippedIngredients.length > 0) {
      logger.warn(`[populateDishes] Skipped ${skippedIngredients.length} ingredient link(s):`, {
        skippedIngredients: [...new Set(skippedIngredients)],
        totalAttempted: skippedIngredients.length + dishIngredientsData.length,
      });
    }

    if (dishIngredientsData.length > 0) {
      logger.dev('[populateDishes] Inserting dish-ingredient links', {
        count: dishIngredientsData.length,
        sample: dishIngredientsData.slice(0, 3),
      });

      const { error: diError, data: insertedData } = await supabaseAdmin
        .from('dish_ingredients')
        .insert(dishIngredientsData)
        .select();

      if (diError) {
        results.errors.push({ table: 'dish_ingredients', error: diError.message });
        logger.error('[populateDishes] Error inserting dish_ingredients:', {
          error: diError.message,
          code: diError.code,
          details: diError.details,
          sampleData: dishIngredientsData.slice(0, 2),
        });
      } else {
        results.populated.push({ table: 'dish_ingredients', count: dishIngredientsData.length });
        logger.dev(
          `[populateDishes] ✅ Created ${dishIngredientsData.length} dish-ingredient links`,
          {
            insertedCount: insertedData?.length || dishIngredientsData.length,
          },
        );
      }
    } else {
      logger.warn('[populateDishes] No dish-ingredient links to insert', {
        skippedCount: skippedIngredients.length,
        skippedDetails: skippedIngredients,
      });
    }
  } else {
    logger.warn('[populateDishes] Skipping dish_ingredients - no ingredients available', {
      ingredientsDataLength: ingredientsData?.length || 0,
    });
  }
}
