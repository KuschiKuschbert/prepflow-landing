/**
 * Helper for handling recipe updates
 */

import {
    invalidateDishesWithRecipe,
    invalidateRecipeAllergenCache,
} from '@/lib/allergens/cache-invalidation';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { getUserEmail } from '@/lib/auth0-api-helpers';
import { logger } from '@/lib/logger';
import { invalidateMenuItemsWithRecipe } from '@/lib/menu-pricing/cache-invalidation';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest } from 'next/server';
import { buildUpdateData } from './buildUpdateData';
import { detectRecipeChanges } from './detectRecipeChanges';

/**
 * Handles recipe update logic
 *
 * @param {string} recipeId - Recipe ID
 * @param {any} body - Request body
 * @param {NextRequest} request - Request object
 * @returns {Promise<any>} Updated recipe
 */
export async function handleRecipeUpdate(
  recipeId: string,
  body: any,
  request: NextRequest,
): Promise<unknown> {
  // Get user email for change tracking
  let userEmail: string | null = null;
  try {
    userEmail = await getUserEmail(request);
  } catch (tokenError) {
    logger.warn('[Recipes API] Could not get user email for change tracking:', tokenError);
  }

  // Fetch current recipe to detect changes
  let currentRecipe: unknown = null;
  try {
    const { data } = await supabaseAdmin!
      .from('recipes')
      .select('recipe_name, yield, instructions')
      .eq('id', recipeId)
      .single();
    currentRecipe = data;
  } catch (err) {
    logger.warn('[Recipes API] Could not fetch current recipe for change detection:', err);
  }

  const updateData = buildUpdateData(body);
  const ingredientsChanged = body.ingredients !== undefined;
  const yieldChanged = body.yield !== undefined;

  // Detect changes
  const { changeType, changeDetails } = detectRecipeChanges(
    currentRecipe,
    updateData,
    ingredientsChanged,
    yieldChanged,
  );

  const { data: updatedRecipe, error: updateError } = await supabaseAdmin!
    .from('recipes')
    .update(updateData)
    .eq('id', recipeId)
    .select()
    .single();

  if (updateError) {
    logger.error('[Recipes API] Database error updating recipe:', {
      error: updateError.message,
      code: updateError.code,
      context: { endpoint: '/api/recipes/[id]', operation: 'PUT', recipeId },
    });
    throw ApiErrorHandler.fromSupabaseError(updateError, 500);
  }

  const recipeName = (updatedRecipe as any).recipe_name || (currentRecipe as any)?.recipe_name || 'Unknown Recipe';

  // Invalidate caches if needed
  if (ingredientsChanged) {
    (async () => {
      try {
        await Promise.all([
          invalidateRecipeAllergenCache(recipeId),
          invalidateDishesWithRecipe(recipeId),
        ]);
      } catch (err) {
        logger.error('[Recipes API] Error invalidating allergen caches:', {
          error: err instanceof Error ? err.message : String(err),
          context: { recipeId, operation: 'invalidateAllergenCaches' },
        });
      }
    })();
  }

  // Invalidate cached recommended prices if ingredients or yield changed
  if (ingredientsChanged || yieldChanged) {
    (async () => {
      try {
        await invalidateMenuItemsWithRecipe(
          recipeId,
          recipeName,
          changeType,
          changeDetails,
          userEmail,
        );
      } catch (err) {
        logger.error('[Recipes API] Error invalidating menu pricing cache:', {
          error: err instanceof Error ? err.message : String(err),
          context: { recipeId, recipeName, operation: 'invalidateMenuPricingCache' },
        });
      }
    })();
  }

  return updatedRecipe;
}
