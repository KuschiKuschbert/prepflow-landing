import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { invalidateDietaryCache } from '@/lib/dietary/dietary-aggregation';

/**
 * Invalidate cached allergens for a specific dish
 */
export async function invalidateDishCache(dishId: string): Promise<void> {
  if (!supabaseAdmin) {
    logger.error('[Cache Invalidation] Supabase admin client not available');
    return;
  }

  try {
    const { error: checkError } = await supabaseAdmin
      .from('dishes')
      .select('id')
      .eq('id', dishId)
      .limit(1);

    if (checkError) {
      return;
    }

    const { error } = await supabaseAdmin
      .from('dishes')
      .update({ allergens: null })
      .eq('id', dishId);

    if (error) {
      logger.error('[Cache Invalidation] Failed to invalidate dish allergen cache:', {
        dishId,
        error: error.message,
      });
    } else {
      logger.dev(`[Cache Invalidation] Invalidated allergen cache for dish ${dishId}`);
      await invalidateDietaryCache(dishId, 'dish');
    }
  } catch (err) {
    logger.error('[Cache Invalidation] Error invalidating dish allergen cache:', err);
  }
}
