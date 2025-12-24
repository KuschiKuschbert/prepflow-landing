import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { invalidateDietaryCache } from '@/lib/dietary/dietary-aggregation';

/**
 * Invalidate cached allergens for a specific recipe
 */
export async function invalidateRecipeCache(recipeId: string): Promise<void> {
  if (!supabaseAdmin) {
    logger.error('[Cache Invalidation] Supabase admin client not available');
    return;
  }

  try {
    const { error } = await supabaseAdmin
      .from('recipes')
      .update({ allergens: null })
      .eq('id', recipeId);

    if (error) {
      logger.error('[Cache Invalidation] Failed to invalidate recipe allergen cache:', {
        recipeId,
        error: error.message,
      });
    } else {
      logger.dev(`[Cache Invalidation] Invalidated allergen cache for recipe ${recipeId}`);
      await invalidateDietaryCache(recipeId, 'recipe');
    }
  } catch (err) {
    logger.error('[Cache Invalidation] Error invalidating recipe allergen cache:', err);
  }
}
