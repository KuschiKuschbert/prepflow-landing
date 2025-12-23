import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { invalidateDietaryCache } from '@/lib/dietary/dietary-aggregation';

/**
 * Cache allergens for a recipe
 *
 * @param {string} recipeId - Recipe ID
 * @param {string[]} allergens - Allergen codes to cache
 */
export async function cacheRecipeAllergens(
  recipeId: string,
  allergens: string[],
): Promise<void> {
  const { error: cacheError } = await supabaseAdmin
    .from('recipes')
    .update({ allergens })
    .eq('id', recipeId);

  if (cacheError) {
    logger.error('[Allergen Aggregation] Failed to cache allergens:', {
      recipeId,
      error: cacheError.message,
    });
    return;
  }

  // Invalidate dietary cache when allergens change (forces recalculation)
  try {
    await invalidateDietaryCache(recipeId, 'recipe');
  } catch (err) {
    logger.error('[Allergen Aggregation] Failed to invalidate dietary cache:', {
      error: err instanceof Error ? err.message : String(err),
      context: { recipeId, operation: 'invalidateDietaryCache' },
    });
  }
}

/**
 * Cache allergens for a dish
 *
 * @param {string} dishId - Dish ID
 * @param {string[]} allergens - Allergen codes to cache
 */
export async function cacheDishAllergens(dishId: string, allergens: string[]): Promise<void> {
  const { error: cacheError } = await supabaseAdmin
    .from('dishes')
    .update({ allergens })
    .eq('id', dishId);

  if (cacheError) {
    logger.error('[Allergen Aggregation] Failed to cache dish allergens:', {
      dishId,
      error: cacheError.message,
    });
    return;
  }

  // Invalidate dietary cache when allergens change (forces recalculation)
  try {
    await invalidateDietaryCache(dishId, 'dish');
  } catch (err) {
    logger.error('[Allergen Aggregation] Failed to invalidate dietary cache:', {
      error: err instanceof Error ? err.message : String(err),
      context: { dishId, operation: 'invalidateDietaryCache' },
    });
  }
}

