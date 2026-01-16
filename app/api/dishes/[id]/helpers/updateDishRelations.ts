import { logger } from '@/lib/logger';
import { DishIngredientInput, DishRecipeInput } from '../../helpers/schemas';
import { invalidateAllergenCache, invalidateMenuPricingCache } from './invalidateDishCaches';
import { updateDishIngredients } from './updateDishIngredients';
import { updateDishRecipes } from './updateDishRecipes';

export interface UpdateRelationsResult {
  changes: string[];
  changeDetails: Record<string, unknown>;
}

/**
 * Updates dish recipes and tracks changes
 *
 * @param {string} dishId - Dish ID
 * @param {DishRecipeInput[]} recipes - Recipes to set
 * @param {string[]} changes - Array to append changes to
 * @param {Record<string, unknown>} changeDetails - Object to add change details to
 * @returns {Promise<void>}
 */
export async function updateRecipesWithTracking(
  dishId: string,
  recipes: DishRecipeInput[],
  changes: string[],
  changeDetails: Record<string, unknown>,
): Promise<void> {
  await updateDishRecipes(dishId, recipes);
  changes.push('recipes_changed');
  changeDetails.recipes = {
    field: 'recipes',
    change: 'recipes updated',
  };
}

/**
 * Updates dish ingredients and tracks changes
 *
 * @param {string} dishId - Dish ID
 * @param {string} dishName - Dish name
 * @param {DishIngredientInput[]} ingredients - Ingredients to set
 * @param {string[]} changes - Array to append changes to
 * @param {Record<string, unknown>} changeDetails - Object to add change details to
 * @param {string | null} userEmail - User email for change tracking
 * @returns {Promise<void>}
 */
export async function updateIngredientsWithTracking(
  dishId: string,
  dishName: string,
  ingredients: DishIngredientInput[],
  changes: string[],
  changeDetails: Record<string, unknown>,
  userEmail: string | null,
): Promise<void> {
  await updateDishIngredients(dishId, ingredients);
  changes.push('ingredients_changed');
  changeDetails.ingredients = {
    field: 'ingredients',
    change: 'ingredients updated',
  };

  // Invalidate caches in background
  (async () => {
    try {
      await invalidateAllergenCache(dishId);
    } catch (err) {
      logger.error('[Dishes API] Error invalidating allergen cache:', {
        error: err instanceof Error ? err.message : String(err),
        context: { dishId, operation: 'invalidateAllergenCache' },
      });
    }
  })();
  (async () => {
    try {
      await invalidateMenuPricingCache(
        dishId,
        dishName,
        'ingredients_changed',
        changeDetails.ingredients as Record<string, unknown>,
        userEmail,
      );
    } catch (err) {
      logger.error('[Dishes API] Error invalidating menu pricing cache:', {
        error: err instanceof Error ? err.message : String(err),
        context: { dishId, dishName, operation: 'invalidateMenuPricingCache' },
      });
    }
  })();
}
