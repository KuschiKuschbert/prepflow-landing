/**
 * Trigger Square sync for a recipe after create/update.
 */
import { NextRequest } from 'next/server';
import { logger } from '@/lib/logger';
import { getUserIdFromRequest } from './helpers/getUserIdFromRequest';
import { shouldTriggerAutoSync } from './helpers/shouldTriggerAutoSync';
import { triggerCostSync } from './triggerCostSync';

/**
 * Trigger Square sync for a recipe after create/update
 * This will trigger cost sync for all dishes that use this recipe
 */
export async function triggerRecipeSync(
  req: NextRequest,
  recipeId: string,
  operation: 'create' | 'update',
): Promise<void> {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      logger.dev('[Square Sync Hooks] No user ID, skipping recipe sync');
      return;
    }

    const shouldSync = await shouldTriggerAutoSync(userId);
    if (!shouldSync) {
      logger.dev('[Square Sync Hooks] Auto-sync disabled, skipping recipe sync');
      return;
    }

    // Recipes don't sync directly to Square, but they affect dish costs
    // Find all dishes that use this recipe and trigger cost sync for them
    const { supabaseAdmin } = await import('@/lib/supabase');
    if (!supabaseAdmin) {
      logger.warn('[Square Sync Hooks] Supabase not available, cannot find dishes for recipe');
      return;
    }

    const { data: dishRecipes, error } = await supabaseAdmin
      .from('dish_recipes')
      .select('dish_id')
      .eq('recipe_id', recipeId);

    if (error) {
      logger.error('[Square Sync Hooks] Error finding dishes for recipe:', {
        error: error.message,
        recipeId,
      });
      return;
    }

    // Trigger cost sync for each dish that uses this recipe
    for (const dishRecipe of dishRecipes || []) {
      await triggerCostSync(req, dishRecipe.dish_id, 'recipe_updated');
    }

    logger.dev(
      `[Square Sync Hooks] Triggered cost sync for ${dishRecipes?.length || 0} dishes using recipe: ${recipeId}`,
    );
  } catch (error) {
    // Don't throw - sync failures shouldn't break the main operation
    logger.error('[Square Sync Hooks] Error triggering recipe sync:', {
      error: error instanceof Error ? error.message : String(error),
      recipeId,
    });
  }
}


