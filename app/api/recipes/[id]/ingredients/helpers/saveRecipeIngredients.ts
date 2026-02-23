import { ApiErrorHandler } from '@/lib/api-error-handler';
import { aggregateRecipeDietaryStatus } from '@/lib/dietary/dietary-aggregation';
import { logger } from '@/lib/logger';
import { invalidateMenuItemsWithRecipe } from '@/lib/menu-pricing/cache-invalidation';
import { supabaseAdmin } from '@/lib/supabase';

import type { RecipeIngredientRow, SaveRecipeIngredientInput } from './types';

/**
 * Save recipe ingredients (with optional update mode).
 */
export async function saveRecipeIngredients(
  recipeId: string,
  ingredients: SaveRecipeIngredientInput[],
  isUpdate: boolean,
  recipeName?: string | null,
  userEmail?: string | null,
): Promise<RecipeIngredientRow[]> {
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
        code: deleteError.code,
        context: { endpoint: '/api/recipes/[id]/ingredients', operation: 'POST', recipeId },
      });
      throw ApiErrorHandler.fromSupabaseError(deleteError, 500);
    }
  }

  // Deduplicate by ingredient_id, summing quantities when the same ingredient appears multiple times
  const byIngredient = new Map<string, SaveRecipeIngredientInput>();
  for (const ing of ingredients) {
    const existing = byIngredient.get(ing.ingredient_id);
    if (existing) {
      byIngredient.set(ing.ingredient_id, {
        ...existing,
        quantity: existing.quantity + ing.quantity,
      });
    } else {
      byIngredient.set(ing.ingredient_id, { ...ing });
    }
  }
  const deduped = Array.from(byIngredient.values());

  // Insert new ingredients
  const recipeIngredientInserts = deduped.map(ing => ({
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
      code: ingredientsError.code,
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
