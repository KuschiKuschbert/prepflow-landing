import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';

/**
 * Delete an ingredient.
 *
 * @param {string} id - Ingredient ID
 * @returns {Promise<void>}
 * @throws {Error} If delete fails
 */
export async function deleteIngredient(id: string): Promise<void> {
  const supabaseAdmin = createSupabaseAdmin();

  // Delete using admin client (bypasses RLS)
  const { error } = await supabaseAdmin.from('ingredients').delete().eq('id', id);

  if (error) {
    logger.error('[Ingredients API] Database error deleting ingredient:', {
      error: error.message,
      code: error.code,
      context: { endpoint: '/api/ingredients', operation: 'DELETE', ingredientId: id },
    });
    throw ApiErrorHandler.fromSupabaseError(error, 500);
  }
}
