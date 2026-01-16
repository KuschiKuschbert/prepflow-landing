/**
 * Find existing recipe card by signature
 * Checks for existing cards that match the recipe signature
 */

import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Search for card by recipe_id
 */
async function searchByRecipeId(
  supabase: SupabaseClient,
  recipeId: string,
): Promise<{ id: string; data_hash: string | null } | null> {
  logger.dev(`[findExistingCardBySignature] Searching by recipe_id: ${recipeId}`);
  const { data: card, error } = await supabase
    .from('menu_recipe_cards')
    .select('id, data_hash')
    .eq('recipe_id', recipeId)
    .single();

  if (error) {
    // Check if column doesn't exist (migration not run)
    if (error.message?.includes('column') && error.message.includes('does not exist')) {
      logger.dev(
        '[findExistingCardBySignature] recipe_id column does not exist, migration not run - skipping cross-reference lookup',
      );
      return null;
    }
    // No card found or other error - return null
    if (error.code === 'PGRST116') {
      // No rows returned - this is fine
      logger.dev(
        `[findExistingCardBySignature] No card found for recipe_id ${recipeId} (PGRST116)`,
      );
      return null;
    }
    logger.warn('[findExistingCardBySignature] Error finding card by recipe_id:', error);
    return null;
  }

  logger.dev(`[findExistingCardBySignature] ✅ Found card ${card?.id} for recipe_id ${recipeId}`);
  return card;
}

/**
 * Search for card by dish_id and recipe_signature
 */
async function searchByDishId(
  supabase: SupabaseClient,
  dishId: string,
  signature: string,
): Promise<{ id: string; data_hash: string | null } | null> {
  logger.dev(
    `[findExistingCardBySignature] Searching by dish_id: ${dishId}, signature: ${signature}`,
  );
  const { data: card, error } = await supabase
    .from('menu_recipe_cards')
    .select('id, data_hash')
    .eq('dish_id', dishId)
    .eq('recipe_signature', signature)
    .single();

  if (error) {
    // Check if columns don't exist (migration not run)
    if (error.message?.includes('column') && error.message.includes('does not exist')) {
      logger.dev(
        '[findExistingCardBySignature] dish_id or recipe_signature columns do not exist, migration not run - skipping cross-reference lookup',
      );
      return null;
    }
    // No card found or other error - return null
    if (error.code === 'PGRST116') {
      // No rows returned - this is fine
      logger.dev(
        `[findExistingCardBySignature] No card found for dish_id ${dishId} with signature ${signature} (PGRST116)`,
      );
      return null;
    }
    logger.warn(
      '[findExistingCardBySignature] Error finding card by dish_id and signature:',
      error,
    );
    return null;
  }

  logger.dev(
    `[findExistingCardBySignature] ✅ Found card ${card?.id} for dish_id ${dishId} with signature ${signature}`,
  );
  return card;
}

/**
 * Find existing recipe card by signature
 * Checks for existing cards that match the recipe signature
 *
 * @param supabase - Supabase client
 * @param signature - Recipe signature to search for
 * @param menuItem - Menu item with dish_id or recipe_id
 * @returns Existing card if found, null otherwise
 */
export async function findExistingCardBySignature(
  supabase: SupabaseClient,
  signature: string,
  menuItem: { dish_id?: string | null; recipe_id?: string | null },
): Promise<{ id: string; data_hash: string | null } | null> {
  try {
    // Case 1: Direct recipe - search by recipe_id
    if (menuItem.recipe_id && signature === menuItem.recipe_id) {
      return await searchByRecipeId(supabase, menuItem.recipe_id);
    }

    // Case 2: Dish - search by dish_id and recipe_signature
    if (menuItem.dish_id) {
      return await searchByDishId(supabase, menuItem.dish_id, signature);
    }

    logger.dev(
      '[findExistingCardBySignature] Cannot determine search method - no recipe_id or dish_id',
    );
    return null;
  } catch (err) {
    logger.warn('[findExistingCardBySignature] Exception:', err);
    return null;
  }
}
