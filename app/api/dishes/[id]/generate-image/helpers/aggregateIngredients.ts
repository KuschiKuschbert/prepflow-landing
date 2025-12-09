/**
 * Aggregate ingredients from dish and recipes
 * Combines direct dish ingredients with recipe ingredients
 */

import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { fetchDishIngredients } from '../../helpers/fetchDishIngredients';
import { fetchDishRecipes } from '../../helpers/fetchDishRecipes';

/**
 * Aggregate all ingredient names from dish and recipes
 *
 * @param {string} dishId - Dish ID
 * @returns {Promise<{ingredientNames: string[], recipeInstructions: string[]}>} Aggregated ingredient names and recipe instructions
 */
export async function aggregateDishIngredients(dishId: string): Promise<{
  ingredientNames: string[];
  recipeInstructions: string[];
}> {
  // Fetch dish ingredients using helper function
  let dishIngredients: any[] = [];
  try {
    dishIngredients = await fetchDishIngredients(dishId);
    logger.dev('[Dish Image Generation] Fetched dish ingredients:', {
      dishId,
      count: dishIngredients.length,
      ingredients: dishIngredients.map(di => ({
        ingredientName: di.ingredients?.ingredient_name || di.ingredients?.name,
        quantity: di.quantity,
        unit: di.unit,
      })),
    });
  } catch (error) {
    logger.error('[Dish Image Generation] Failed to fetch dish ingredients:', {
      error: error instanceof Error ? error.message : String(error),
      dishId,
    });
  }

  // Fetch dish recipes using helper function
  let dishRecipes: any[] = [];
  let recipeInstructions: string[] = [];
  try {
    dishRecipes = await fetchDishRecipes(dishId);
    logger.dev('[Dish Image Generation] Fetched dish recipes:', {
      dishId,
      count: dishRecipes.length,
      recipeIds: dishRecipes.map(dr => dr.recipe_id || dr.id),
    });

    // Collect instructions from all recipes
    dishRecipes.forEach(dr => {
      const recipe = dr.recipes || dr;
      if (recipe?.instructions && recipe.instructions.trim().length > 0) {
        recipeInstructions.push(recipe.instructions.trim());
      }
    });

    logger.dev('[Dish Image Generation] Collected recipe instructions:', {
      dishId,
      instructionCount: recipeInstructions.length,
      hasInstructions: recipeInstructions.length > 0,
    });
  } catch (error) {
    logger.error('[Dish Image Generation] Failed to fetch dish recipes:', {
      error: error instanceof Error ? error.message : String(error),
      dishId,
    });
  }

  // Fetch recipe ingredients for each recipe
  const recipeIngredientNamesSet = new Set<string>();
  for (const dishRecipe of dishRecipes) {
    const recipeId = dishRecipe.recipe_id || dishRecipe.id;
    if (!recipeId) continue;

    try {
      if (!supabaseAdmin) {
        logger.error('[Dish Image Generation] Supabase admin not available');
        continue;
      }
      const { data: recipeIngredients, error: recipeIngredientsError } = await supabaseAdmin
        .from('recipe_ingredients')
        .select(
          `
            ingredients (
              ingredient_name
            )
          `,
        )
        .eq('recipe_id', recipeId);

      if (recipeIngredientsError) {
        logger.error('[Dish Image Generation] Failed to fetch recipe ingredients:', {
          error: recipeIngredientsError.message,
          recipeId,
          dishId,
        });
        continue;
      }

      if (recipeIngredients && Array.isArray(recipeIngredients)) {
        recipeIngredients.forEach(ri => {
          const ingredient = ri.ingredients;
          if (ingredient && typeof ingredient === 'object' && ingredient !== null) {
            const name = (ingredient as any).ingredient_name || (ingredient as any).name;
            if (name && typeof name === 'string') {
              recipeIngredientNamesSet.add(name);
            }
          }
        });
      }
    } catch (error) {
      logger.error('[Dish Image Generation] Error fetching recipe ingredients:', {
        error: error instanceof Error ? error.message : String(error),
        recipeId,
        dishId,
      });
    }
  }

  // Aggregate all ingredient names
  const ingredientNamesSet = new Set<string>();

  // Add direct dish ingredients
  dishIngredients.forEach(di => {
    const ingredient = di.ingredients;
    if (ingredient && typeof ingredient === 'object' && ingredient !== null) {
      const name = (ingredient as any).ingredient_name || (ingredient as any).name;
      if (name && typeof name === 'string') {
        ingredientNamesSet.add(name);
      }
    }
  });

  // Add ingredients from recipes
  recipeIngredientNamesSet.forEach(name => {
    ingredientNamesSet.add(name);
  });

  const ingredientNames = Array.from(ingredientNamesSet);

  logger.dev('[Dish Image Generation] Aggregated ingredient names:', {
    dishId,
    directIngredientsCount: dishIngredients.length,
    recipesCount: dishRecipes.length,
    recipeIngredientsCount: recipeIngredientNamesSet.size,
    totalUniqueIngredients: ingredientNames.length,
    ingredientNames,
  });

  return {
    ingredientNames,
    recipeInstructions,
  };
}
