/**
 * Check if dishes have ingredients.
 */

import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

import { ApiErrorHandler } from '@/lib/api-error-handler';

/**
 * Check if a dish has direct ingredients (not via recipes)
 * The UI only shows direct dish_ingredients, so we need to ensure all dishes have them
 */
export async function dishHasDirectIngredients(dishId: string): Promise<boolean> {
  if (!supabaseAdmin) {
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  // Check direct ingredients only (UI requirement)
  const { data: dishIngredients, error: diError } = await supabaseAdmin
    .from('dish_ingredients')
    .select('id')
    .eq('dish_id', dishId)
    .limit(1);

  if (diError && diError.code !== 'PGRST116') {
    logger.warn('[dishHasDirectIngredients] Error checking dish_ingredients:', {
      dishId,
      error: diError.message,
    });
  }

  return (dishIngredients && dishIngredients.length > 0) || false;
}

/**
 * Check if a dish has any ingredients (direct or via recipes)
 * @deprecated Use dishHasDirectIngredients for UI population
 */
export async function dishHasIngredients(dishId: string): Promise<boolean> {
  return dishHasDirectIngredients(dishId);
}
