import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { invalidateDietaryCache } from '@/lib/dietary/dietary-aggregation';

/**
 * Invalidate cached allergens for all recipes containing a specific ingredient
 */
export async function invalidateRecipesWithIngredient(ingredientId: string): Promise<void> {
  if (!supabaseAdmin) {
    logger.error('[Cache Invalidation] Supabase admin client not available');
    return;
  }

  try {
    const { data: recipeIngredients, error: fetchError } = await supabaseAdmin
      .from('recipe_ingredients')
      .select('recipe_id')
      .eq('ingredient_id', ingredientId);

    if (fetchError) {
      logger.error('[Cache Invalidation] Failed to fetch recipes with ingredient:', {
        ingredientId,
        error: fetchError.message,
      });
      return;
    }

    if (!recipeIngredients || recipeIngredients.length === 0) {
      return;
    }

    const recipeIds = [...new Set(recipeIngredients.map(ri => ri.recipe_id))];
    const { error } = await supabaseAdmin
      .from('recipes')
      .update({ allergens: null })
      .in('id', recipeIds);

    if (error) {
      logger.error('[Cache Invalidation] Failed to invalidate recipes allergen cache:', {
        ingredientId,
        recipeIds,
        error: error.message,
      });
    } else {
      logger.dev(
        `[Cache Invalidation] Invalidated allergen cache for ${recipeIds.length} recipes containing ingredient ${ingredientId}`,
      );
      await Promise.all(recipeIds.map(id => invalidateDietaryCache(id, 'recipe')));
    }
  } catch (err) {
    logger.error('[Cache Invalidation] Error invalidating recipes with ingredient:', err);
  }
}

