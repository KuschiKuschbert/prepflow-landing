/**
 * Square Sync Hooks
 *
 * Utility functions to trigger Square sync operations after PrepFlow entity changes.
 * These hooks are called from API routes after successful create/update operations.
 *
 * 📚 Complete Reference: See `docs/SQUARE_API_REFERENCE.md` (Automatic Sync, API Route Hooks sections) for
 * detailed hook documentation and integration examples.
 */

import { logger } from '@/lib/logger';
import { getUserFromRequest } from '@/lib/auth0-api-helpers';
import { getSquareConfig } from '../config';
import { isSquarePOSEnabled } from '../feature-flags';
import { queueSyncOperation } from './auto-sync-queue';
import { NextRequest } from 'next/server';

/**
 * Get user UUID from request (for sync hooks)
 * Converts email to UUID by querying the users table
 * Returns null if user cannot be determined
 */
async function getUserIdFromRequest(req: NextRequest): Promise<string | null> {
  try {
    const user = await getUserFromRequest(req);
    if (!user?.email) {
      return null;
    }

    // Convert email to UUID by querying users table
    const { supabaseAdmin } = await import('@/lib/supabase');
    if (!supabaseAdmin) {
      logger.warn('[Square Sync Hooks] Supabase not available, cannot get user UUID');
      return null;
    }

    const { data: dbUser, error } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', user.email)
      .single();

    if (error || !dbUser) {
      logger.warn('[Square Sync Hooks] User not found in database:', {
        email: user.email,
        error: error?.message,
      });
      return null;
    }

    return dbUser.id;
  } catch (error) {
    logger.error('[Square Sync Hooks] Failed to get user from request:', {
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

/**
 * Check if auto-sync should be triggered for this user
 */
async function shouldTriggerAutoSync(userId: string): Promise<boolean> {
  try {
    // Check feature flag
    const isEnabled = await isSquarePOSEnabled(userId);
    if (!isEnabled) {
      return false;
    }

    // Check Square configuration
    const config = await getSquareConfig(userId);
    if (!config) {
      return false;
    }

    // Check if auto-sync is enabled
    if (!config.auto_sync_enabled) {
      return false;
    }

    return true;
  } catch (error) {
    logger.error('[Square Sync Hooks] Error checking auto-sync configuration:', {
      error: error instanceof Error ? error.message : String(error),
      userId,
    });
    return false;
  }
}

/**
 * Trigger Square sync for a dish after create/update
 */
export async function triggerDishSync(
  req: NextRequest,
  dishId: string,
  operation: 'create' | 'update',
): Promise<void> {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      logger.dev('[Square Sync Hooks] No user ID, skipping dish sync');
      return;
    }

    const shouldSync = await shouldTriggerAutoSync(userId);
    if (!shouldSync) {
      logger.dev('[Square Sync Hooks] Auto-sync disabled, skipping dish sync');
      return;
    }

    const config = await getSquareConfig(userId);
    if (!config?.auto_sync_dishes) {
      logger.dev('[Square Sync Hooks] Dish auto-sync disabled, skipping');
      return;
    }

    // Queue sync operation
    await queueSyncOperation({
      userId,
      entityType: 'dish',
      entityId: dishId,
      operation,
      direction: config.auto_sync_direction === 'bidirectional' ? 'bidirectional' : 'prepflow_to_square',
    });

    logger.dev(`[Square Sync Hooks] Queued ${operation} sync for dish: ${dishId}`);
  } catch (error) {
    // Don't throw - sync failures shouldn't break the main operation
    logger.error('[Square Sync Hooks] Error triggering dish sync:', {
      error: error instanceof Error ? error.message : String(error),
      dishId,
    });
  }
}

/**
 * Trigger Square sync for an employee after create/update
 */
export async function triggerEmployeeSync(
  req: NextRequest,
  employeeId: string,
  operation: 'create' | 'update',
): Promise<void> {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      logger.dev('[Square Sync Hooks] No user ID, skipping employee sync');
      return;
    }

    const shouldSync = await shouldTriggerAutoSync(userId);
    if (!shouldSync) {
      logger.dev('[Square Sync Hooks] Auto-sync disabled, skipping employee sync');
      return;
    }

    const config = await getSquareConfig(userId);
    if (!config?.auto_sync_staff) {
      logger.dev('[Square Sync Hooks] Staff auto-sync disabled, skipping');
      return;
    }

    // Queue sync operation
    await queueSyncOperation({
      userId,
      entityType: 'employee',
      entityId: employeeId,
      operation,
      direction: config.auto_sync_direction === 'bidirectional' ? 'bidirectional' : 'prepflow_to_square',
    });

    logger.dev(`[Square Sync Hooks] Queued ${operation} sync for employee: ${employeeId}`);
  } catch (error) {
    // Don't throw - sync failures shouldn't break the main operation
    logger.error('[Square Sync Hooks] Error triggering employee sync:', {
      error: error instanceof Error ? error.message : String(error),
      employeeId,
    });
  }
}

/**
 * Trigger Square cost sync for a dish after recipe/ingredient changes
 * This is called when recipes or ingredients are updated, which affects dish costs
 */
export async function triggerCostSync(
  req: NextRequest,
  dishId: string,
  reason: 'recipe_updated' | 'ingredient_updated' | 'dish_updated',
): Promise<void> {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      logger.dev('[Square Sync Hooks] No user ID, skipping cost sync');
      return;
    }

    const shouldSync = await shouldTriggerAutoSync(userId);
    if (!shouldSync) {
      logger.dev('[Square Sync Hooks] Auto-sync disabled, skipping cost sync');
      return;
    }

    const config = await getSquareConfig(userId);
    if (!config?.auto_sync_costs) {
      logger.dev('[Square Sync Hooks] Cost auto-sync disabled, skipping');
      return;
    }

    // Queue cost sync operation (costs always go PrepFlow → Square)
    await queueSyncOperation({
      userId,
      entityType: 'dish', // Cost sync uses dish entity type
      entityId: dishId,
      operation: 'update', // Cost updates are treated as updates
      direction: 'prepflow_to_square',
    });

    logger.dev(`[Square Sync Hooks] Queued cost sync for dish: ${dishId} (reason: ${reason})`);
  } catch (error) {
    // Don't throw - sync failures shouldn't break the main operation
    logger.error('[Square Sync Hooks] Error triggering cost sync:', {
      error: error instanceof Error ? error.message : String(error),
      dishId,
      reason,
    });
  }
}

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

    logger.dev(`[Square Sync Hooks] Triggered cost sync for ${dishRecipes?.length || 0} dishes using recipe: ${recipeId}`);
  } catch (error) {
    // Don't throw - sync failures shouldn't break the main operation
    logger.error('[Square Sync Hooks] Error triggering recipe sync:', {
      error: error instanceof Error ? error.message : String(error),
      recipeId,
    });
  }
}

/**
 * Trigger Square sync for an ingredient after create/update
 * This will trigger cost sync for all dishes that use this ingredient
 */
export async function triggerIngredientSync(
  req: NextRequest,
  ingredientId: string,
  operation: 'create' | 'update',
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

    logger.dev(`[Square Sync Hooks] Triggered cost sync for ${dishIds.size} dishes using ingredient: ${ingredientId}`);
  } catch (error) {
    // Don't throw - sync failures shouldn't break the main operation
    logger.error('[Square Sync Hooks] Error triggering ingredient sync:', {
      error: error instanceof Error ? error.message : String(error),
      ingredientId,
    });
  }
}
