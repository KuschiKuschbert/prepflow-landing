/**
 * Trigger Square sync for an ingredient after create/update.
 */
import { NextRequest } from 'next/server';
import { logger } from '@/lib/logger';
import { getUserIdFromRequest } from './helpers/getUserIdFromRequest';
import { shouldTriggerAutoSync } from './helpers/shouldTriggerAutoSync';
import { triggerCostSync } from './triggerCostSync';

/**
 * Trigger Square sync for an ingredient after create/update
 * This will trigger cost sync for all dishes that use this ingredient
 */
export async function triggerIngredientSync(
  req: NextRequest,
  ingredientId: string,
  _operation: 'create' | 'update',
): Promise<void> {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      logger.dev('[Square Sync Hooks] No user ID, skipping ingredient sync');
      return;
    }

    const shouldSync = await shouldTriggerAutoSync(userId);
    if (!shouldSync) {
      logger.dev('[Square Sync Hooks] Auto-sync disabled, skipping ingredient sync');
      return;
    }

    // Ingredients don't sync directly to Square, but they affect dish costs
    // Find all dishes that use this ingredient and trigger cost sync for them
    const { supabaseAdmin } = await import('@/lib/supabase');
    if (!supabaseAdmin) {
      logger.warn('[Square Sync Hooks] Supabase not available, cannot find dishes for ingredient');
      return;
    }

    // Check both dish_ingredients and recipe_ingredients (via dishes that use recipes)
    const { data: dishIngredients, error: diError } = await supabaseAdmin
      .from('dish_ingredients')
      .select('dish_id')
      .eq('ingredient_id', ingredientId);

    const { data: recipeIngredients, error: riError } = await supabaseAdmin
      .from('recipe_ingredients')
      .select('recipe_id')
      .eq('ingredient_id', ingredientId);

    if (diError || riError) {
      logger.error('[Square Sync Hooks] Error finding dishes/recipes for ingredient:', {
        diError: diError?.message,
        riError: riError?.message,
        ingredientId,
      });
      return;
    }

    const dishIds = new Set<string>();

    // Add dishes that directly use this ingredient
    dishIngredients?.forEach(di => dishIds.add(di.dish_id));

    // Find dishes that use recipes containing this ingredient
    if (recipeIngredients && recipeIngredients.length > 0) {
      const recipeIds = recipeIngredients.map(ri => ri.recipe_id);
      const { data: dishRecipes, error: drError } = await supabaseAdmin
        .from('dish_recipes')
        .select('dish_id')
        .in('recipe_id', recipeIds);

      if (!drError && dishRecipes) {
        dishRecipes.forEach(dr => dishIds.add(dr.dish_id));
      }
    }

    // Trigger cost sync for each affected dish
    for (const dishId of dishIds) {
      await triggerCostSync(req, dishId, 'ingredient_updated');
    }

    logger.dev(
      `[Square Sync Hooks] Triggered cost sync for ${dishIds.size} dishes using ingredient: ${ingredientId}`,
    );
  } catch (error) {
    // Don't throw - sync failures shouldn't break the main operation
    logger.error('[Square Sync Hooks] Error triggering ingredient sync:', {
      error: error instanceof Error ? error.message : String(error),
      ingredientId,
    });
  }
}
