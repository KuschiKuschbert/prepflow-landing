import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

import { ApiErrorHandler } from '@/lib/api-error-handler';

/**
 * Get dish names by their IDs.
 *
 * @param {string[]} dishIds - Array of dish IDs
 * @returns {Promise<string[]>} Array of dish names
 */
export async function getDishNames(dishIds: string[]): Promise<string[]> {
  if (dishIds.length === 0) return [];
  if (!supabaseAdmin) {
    logger.error('[Recipes API] Database connection not available in getDishNames');
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }
  const { data: dishes, error } = await supabaseAdmin
    .from('dishes')
    .select('dish_name')
    .in('id', dishIds);
  if (error) {
    logger.error('[Recipes API] Database error fetching dish names:', {
      error: error.message,
      code: (error as any).code,
      context: { operation: 'getDishNames', dishIds },
    });
    throw ApiErrorHandler.fromSupabaseError(error, 500);
  }
  return dishes ? dishes.map((d: { dish_name: string }) => d.dish_name || 'Unknown') : [];
}
