/**
 * Cache invalidation utilities for allergen and dietary caches
 * Invalidates cached allergens when ingredients, recipes, or dishes change
 * Also invalidates dietary cache to ensure vegan/vegetarian status is recalculated
 */
import { invalidateRecipeCache } from './cache-invalidation/helpers/invalidateRecipeCache';
import { invalidateRecipesWithIngredient } from './cache-invalidation/helpers/invalidateRecipesWithIngredient';
import { invalidateDishCache } from './cache-invalidation/helpers/invalidateDishCache';
import {
  invalidateDishesWithRecipe,
  invalidateDishesWithIngredient,
} from './cache-invalidation/helpers/invalidateDishesWithRelation';

/**
 * Invalidate cached allergens for a specific recipe
 * Called when recipe ingredients change
 */
export async function invalidateRecipeAllergenCache(recipeId: string): Promise<void> {
  await invalidateRecipeCache(recipeId);
}

/**
 * Invalidate cached allergens for all recipes containing a specific ingredient
 * Called when ingredient allergens change
 */
export { invalidateRecipesWithIngredient };

/**
 * Invalidate cached allergens for a specific dish
 * Called when dish recipes or ingredients change
 */
export async function invalidateDishAllergenCache(dishId: string): Promise<void> {
  await invalidateDishCache(dishId);
}

/**
 * Invalidate cached allergens for all dishes containing a specific recipe
 * Called when recipe allergens change
 */
export { invalidateDishesWithRecipe };

/**
 * Invalidate cached allergens for all dishes containing a specific ingredient
 * Called when ingredient allergens change
 */
export { invalidateDishesWithIngredient };
