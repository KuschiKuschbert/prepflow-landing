import { ApiErrorHandler } from '@/lib/api-error-handler';
import { normalizeIngredientData } from '@/lib/ingredients/normalizeIngredientDataMain';
import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';

/**
 * Create an ingredient with normalized data.
 *
 * @param {Object} ingredientData - Raw ingredient data
 * @returns {Promise<Object>} Created ingredient
 * @throws {Error} If creation fails
 */
export async function createIngredient(ingredientData: any) {
  const supabaseAdmin = createSupabaseAdmin();

  // Normalize ingredient data
  const { normalized, error: normalizeError } = normalizeIngredientData(ingredientData);
  if (normalizeError) {
    throw ApiErrorHandler.createError(
      'Failed to normalize ingredient data',
      'VALIDATION_ERROR',
      400,
      {
        details: normalizeError,
      },
    );
  }

  // Insert using admin client (bypasses RLS)
  const { data, error } = await supabaseAdmin.from('ingredients').insert([normalized]).select();

  if (error) {
    logger.error('[Ingredients API] Database error inserting ingredient:', {
      error: error.message,
      code: (error as any).code,
      context: { endpoint: '/api/ingredients', operation: 'POST', table: 'ingredients' },
    });
    throw ApiErrorHandler.fromSupabaseError(error, 500);
  }

  return data?.[0] || null;
}
