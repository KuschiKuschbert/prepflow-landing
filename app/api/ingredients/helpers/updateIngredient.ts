import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';
import { formatIngredientUpdates } from './formatIngredientUpdates';

/**
 * Update an ingredient.
 *
 * @param {string} id - Ingredient ID
 * @param {Object} updates - Update data
 * @returns {Promise<Object>} Updated ingredient
 * @throws {Error} If update fails
 */
export async function updateIngredient(id: string, updates: any) {
  const supabaseAdmin = createSupabaseAdmin();

  const formattedUpdates = await formatIngredientUpdates(updates);

  // Update using admin client (bypasses RLS)
  const { data, error } = await supabaseAdmin
    .from('ingredients')
    .update(formattedUpdates)
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) {
    logger.error('[Ingredients API] Database error updating ingredient:', {
      error: error.message,
      code: (error as any).code,
      context: { endpoint: '/api/ingredients', operation: 'PUT', ingredientId: id },
    });
    throw ApiErrorHandler.fromSupabaseError(error, 500);
  }

  if (!data) {
    throw ApiErrorHandler.createError('Ingredient not found', 'NOT_FOUND', 404, {
      ingredientId: id,
    });
  }

  return data;
}
