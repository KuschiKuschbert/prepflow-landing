/**
 * Helper for handling recipe updates
 */

import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';
import { buildUpdateData } from './buildUpdateData';
import { detectRecipeChanges } from './detectRecipeChanges';
import {
  invalidateRecipeAllergenCache,
  invalidateDishesWithRecipe,
} from '@/lib/allergens/cache-invalidation';
import { invalidateMenuItemsWithRecipe } from '@/lib/menu-pricing/cache-invalidation';

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
): Promise<any> {
  // Get user email for change tracking
  let userEmail: string | null = null;
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    userEmail = (token?.email as string) || null;
  } catch (tokenError) {
    logger.warn('[Recipes API] Could not get user email for change tracking:', tokenError);
  }

  // Fetch current recipe to detect changes
  let currentRecipe: any = null;
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
    throw updateError;
  }

  const recipeName = updatedRecipe.recipe_name || currentRecipe?.recipe_name || 'Unknown Recipe';

  // Invalidate caches if needed
  if (ingredientsChanged) {
    Promise.all([
      invalidateRecipeAllergenCache(recipeId),
      invalidateDishesWithRecipe(recipeId),
    ]).catch(err => {
      logger.error('[Recipes API] Error invalidating allergen caches:', err);
    });
  }

  // Invalidate cached recommended prices if ingredients or yield changed
  if (ingredientsChanged || yieldChanged) {
    invalidateMenuItemsWithRecipe(recipeId, recipeName, changeType, changeDetails, userEmail).catch(
      err => {
        logger.error('[Recipes API] Error invalidating menu pricing cache:', err);
      },
    );
  }

  return updatedRecipe;
}
