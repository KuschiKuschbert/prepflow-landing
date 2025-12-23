import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { invalidateMenuItemsWithRecipe } from '@/lib/menu-pricing/cache-invalidation';
import { aggregateRecipeDietaryStatus } from '@/lib/dietary/dietary-aggregation';

/**
 * Save recipe ingredients (with optional update mode).
 *
 * @param {string} recipeId - Recipe ID
 * @param {Array} ingredients - Ingredients array
 * @param {boolean} isUpdate - If true, delete existing ingredients first
 * @param {string} recipeName - Recipe name (for change tracking)
 * @param {string} userEmail - User email (for change tracking)
 * @returns {Promise<Array>} Saved recipe ingredients
 * @throws {Error} If save fails
 */
export async function saveRecipeIngredients(
  recipeId: string,
  ingredients: any[],
  isUpdate: boolean,
  recipeName?: string | null,
  userEmail?: string | null,
): Promise<any[]> {
  if (!supabaseAdmin) {
    logger.error('[API] Database connection not available');
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  // If updating, delete existing ingredients first
  if (isUpdate) {
    const { error: deleteError } = await supabaseAdmin
      .from('recipe_ingredients')
      .delete()
      .eq('recipe_id', recipeId);

    if (deleteError) {
      logger.error('[Recipes API] Database error deleting existing ingredients:', {
        error: deleteError.message,
        code: (deleteError as any).code,
        context: { endpoint: '/api/recipes/[id]/ingredients', operation: 'POST', recipeId },
      });
      throw ApiErrorHandler.fromSupabaseError(deleteError, 500);
    }
  }

  // Insert new ingredients
  const recipeIngredientInserts = ingredients.map(ing => ({
    recipe_id: recipeId,
    ingredient_id: ing.ingredient_id,
    quantity: ing.quantity,
    unit: ing.unit,
  }));

  const { data, error: ingredientsError } = await supabaseAdmin
    .from('recipe_ingredients')
    .insert(recipeIngredientInserts)
    .select();

  if (ingredientsError) {
    logger.error('[Recipes API] Database error saving recipe ingredients:', {
      error: ingredientsError.message,
      code: (ingredientsError as any).code,
      context: { endpoint: '/api/recipes/[id]/ingredients', operation: 'POST', recipeId },
    });
    throw ApiErrorHandler.fromSupabaseError(ingredientsError, 500);
  }

  // Invalidate cached recommended prices for menu items using this recipe (with change tracking)
  try {
    await invalidateMenuItemsWithRecipe(
      recipeId,
      recipeName || undefined,
      'ingredients_changed',
      { field: 'ingredients', change: 'ingredients updated' },
      userEmail || null,
    );
  } catch (err) {
    logger.error('[Recipes API] Error invalidating menu pricing cache:', {
      error: err instanceof Error ? err.message : String(err),
      context: { recipeId, recipeName, operation: 'invalidateMenuPricingCache' },
    });
  }

  // Trigger dietary recalculation with force=true to ensure fresh status after ingredients change
  try {
    await aggregateRecipeDietaryStatus(recipeId, false, true);
  } catch (err) {
    logger.error('[Recipes API] Error recalculating dietary status:', {
      error: err instanceof Error ? err.message : String(err),
      context: { recipeId, operation: 'aggregateRecipeDietaryStatus' },
    });
  }

  return data || [];
}
