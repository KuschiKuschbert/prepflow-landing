import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';
import { buildChangeDetails } from './buildChangeDetails';
import { formatIngredientUpdates } from './formatIngredientUpdates';
import { UpdateIngredientData } from './schemas';
import { detectCurrentAllergens } from './update/detectCurrentAllergens';
import { invalidateAllergenCaches } from './update/invalidateAllergenCaches';
import { invalidateCostCaches } from './update/invalidateCostCaches';

/**
 * Update an ingredient.
 *
 * @param {string} id - Ingredient ID
 * @param {UpdateIngredientData} updates - Update data
 * @param {string} userEmail - User email (for change tracking)
 * @returns {Promise<Object>} Updated ingredient
 * @throws {Error} If update fails
 */
export async function updateIngredient(
  id: string,
  updates: UpdateIngredientData,
  userEmail?: string | null,
) {
  const supabaseAdmin = createSupabaseAdmin();

  // Format updates first as they are needed for allergen detection
  const formattedUpdates = await formatIngredientUpdates(updates);

  // Check/Detect allergens
  const allergensChanged = await detectCurrentAllergens(id, updates, formattedUpdates);

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
      code: error.code,
      context: { endpoint: '/api/ingredients', operation: 'PUT', ingredientId: id },
    });
    throw ApiErrorHandler.fromSupabaseError(error, 500);
  }

  if (!data) {
    throw ApiErrorHandler.createError('Ingredient not found', 'NOT_FOUND', 404, {
      ingredientId: id,
    });
  }

  // Invalidate cached allergens for affected recipes and dishes if allergens changed
  if (allergensChanged) {
    invalidateAllergenCaches(id);
  }

  // Invalidate cached recommended prices if cost changed
  const costChanged =
    formattedUpdates.cost_per_unit !== undefined ||
    formattedUpdates.cost_per_unit_as_purchased !== undefined ||
    formattedUpdates.cost_per_unit_incl_trim !== undefined ||
    formattedUpdates.trim_peel_waste_percentage !== undefined ||
    formattedUpdates.yield_percentage !== undefined;

  if (costChanged) {
    const changeDetails = buildChangeDetails(formattedUpdates);
    const ingredientName = data.ingredient_name || 'Unknown Ingredient';
    invalidateCostCaches(id, ingredientName, changeDetails, userEmail);
  }

  return data;
}
