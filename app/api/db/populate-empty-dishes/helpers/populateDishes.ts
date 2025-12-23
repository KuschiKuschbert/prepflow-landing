/**
 * Helper for populating empty dishes with ingredients
 */

import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import {
  dishHasDirectIngredients,
  getDefaultIngredientsForDish,
  getIngredientsFromRecipes,
  getIngredientName,
} from '@/lib/populate-helpers/populate-empty-dishes-helpers';

import { ApiErrorHandler } from '@/lib/api-error-handler';

export interface PopulatedDish {
  dish_id: string;
  dish_name: string;
  ingredients_added: number;
  ingredient_names: string[];
}

export interface SkippedDish {
  dish_id: string;
  dish_name: string;
  reason: string;
}

export interface DishError {
  dish_id: string;
  dish_name: string;
  error: string;
}

export interface PopulateDishesResult {
  populated: PopulatedDish[];
  skipped: SkippedDish[];
  errors: DishError[];
}

/**
 * Populates empty dishes with default ingredients
 *
 * @param {any[]} dishes - Array of dish objects
 * @param {any[]} ingredients - Array of available ingredients
 * @returns {Promise<PopulateDishesResult>} Result of population operation
 */
export async function populateDishes(
  dishes: any[],
  ingredients: any[],
): Promise<PopulateDishesResult> {
  const populated: PopulatedDish[] = [];
  const skipped: SkippedDish[] = [];
  const errors: DishError[] = [];

  for (const dish of dishes) {
    try {
      const hasDirectIngredients = await dishHasDirectIngredients(dish.id);
      if (hasDirectIngredients) {
        skipped.push({
          dish_id: dish.id,
          dish_name: dish.dish_name,
          reason: 'Dish already has direct ingredients',
        });
        continue;
      }

      // Try to get ingredients from recipes first, then fallback to default
      let ingredientsToAdd = await getIngredientsFromRecipes(dish.id, ingredients);

      // If no recipe ingredients, use default ingredients based on dish name
      if (ingredientsToAdd.length === 0) {
        ingredientsToAdd = getDefaultIngredientsForDish(dish.dish_name, ingredients);
      }

      if (ingredientsToAdd.length === 0) {
        skipped.push({
          dish_id: dish.id,
          dish_name: dish.dish_name,
          reason: 'No matching ingredients found in database',
        });
        continue;
      }

      // Insert dish_ingredients
      const dishIngredientsToInsert = ingredientsToAdd.map(ing => ({
        dish_id: dish.id,
        ingredient_id: ing.ingredient_id,
        quantity: ing.quantity,
        unit: ing.unit,
      }));

      if (!supabaseAdmin) {
        throw ApiErrorHandler.createError('Supabase admin client not initialized', 'DATABASE_ERROR', 500);
      }

      const { error: insertError } = await supabaseAdmin
        .from('dish_ingredients')
        .insert(dishIngredientsToInsert);

      if (insertError) {
        errors.push({
          dish_id: dish.id,
          dish_name: dish.dish_name,
          error: insertError.message,
        });
        logger.error('[Populate Empty Dishes] Error inserting ingredients:', {
          dishId: dish.id,
          dishName: dish.dish_name,
          error: insertError.message,
        });
        continue;
      }

      const ingredientNames = ingredientsToAdd.map(ing =>
        getIngredientName(ing.ingredient_id, ingredients),
      );

      populated.push({
        dish_id: dish.id,
        dish_name: dish.dish_name,
        ingredients_added: ingredientsToAdd.length,
        ingredient_names: ingredientNames,
      });

      logger.dev('[Populate Empty Dishes] Populated dish:', {
        dishId: dish.id,
        dishName: dish.dish_name,
        ingredientsAdded: ingredientsToAdd.length,
        ingredientNames,
      });
    } catch (err) {
      errors.push({
        dish_id: dish.id,
        dish_name: dish.dish_name,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
      logger.error('[Populate Empty Dishes] Error processing dish:', {
        dishId: dish.id,
        dishName: dish.dish_name,
        error: err,
      });
    }
  }

  return { populated, skipped, errors };
}




