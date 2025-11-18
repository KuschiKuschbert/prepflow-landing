import { ApiErrorHandler } from '@/lib/api-error-handler';
import { createSupabaseAdmin } from '@/lib/supabase';

/**
 * Check if ingredient exists and if par level already exists for this ingredient.
 *
 * @param {string} ingredientId - Ingredient ID to check
 * @returns {Promise<void>} Resolves if checks pass
 * @throws {Error} If ingredient not found or duplicate exists
 */
export async function checkIngredientAndDuplicate(ingredientId: string) {
  const supabaseAdmin = createSupabaseAdmin();

  // Check if ingredient exists
  const { data: ingredient, error: ingredientError } = await supabaseAdmin
    .from('ingredients')
    .select('id')
    .eq('id', ingredientId)
    .single();

  if (ingredientError || !ingredient) {
    throw ApiErrorHandler.createError('Ingredient not found', 'NOT_FOUND', 404);
  }

  // Check if par level already exists for this ingredient
  const { data: existing } = await supabaseAdmin
    .from('par_levels')
    .select('id')
    .eq('ingredient_id', ingredientId)
    .single();

  if (existing) {
    throw ApiErrorHandler.createError(
      'Par level already exists for this ingredient',
      'VALIDATION_ERROR',
      400,
    );
  }
}
