/**
 * Save sub-recipe card to database
 */

import { logger } from '@/lib/logger';
import type { SupabaseClient } from '@supabase/supabase-js';
import { linkMenuItemToCard } from '../cardManagement';
import { CollectedSubRecipe } from '../recipe-card-types';

/**
 * Save sub-recipe card with cross-referencing enabled
 */
async function saveWithCrossReferencing(
  supabase: SupabaseClient,
  cardData: any,
  recipeId: string,
  dataHash: string,
  subRecipeName: string,
  usedByMenuItems: CollectedSubRecipe['usedByMenuItems'],
): Promise<{ success: boolean; cardId?: string; error?: string }> {
  const { data: existingCard, error: findError } = await supabase
    .from('menu_recipe_cards')
    .select('id, data_hash')
    .eq('recipe_id', recipeId)
    .is('dish_id', null)
    .single();

  if (!findError && existingCard) {
    // Card exists - check if data changed
    if (existingCard.data_hash === dataHash) {
      // Data hasn't changed, reuse existing card
      logger.dev(`Reusing existing sub-recipe card ${existingCard.id} for ${subRecipeName}`);
      return { success: true, cardId: existingCard.id };
    }

    // Data changed - update card
    const { data: updatedCard, error: updateError } = await supabase
      .from('menu_recipe_cards')
      .update(cardData)
      .eq('id', existingCard.id)
      .select('id')
      .single();

    if (updateError) {
      logger.error(`Failed to update sub-recipe card for ${subRecipeName}:`, updateError);
      return { success: false, error: updateError.message };
    }

    logger.dev(`Updated sub-recipe card ${updatedCard?.id || existingCard.id} for ${subRecipeName}`);
    return { success: true, cardId: updatedCard?.id || existingCard.id };
  }

  // Card doesn't exist - create new
  const { data: insertedCard, error: insertError } = await supabase
    .from('menu_recipe_cards')
    .insert(cardData)
    .select('id')
    .single();

  if (insertError) {
    logger.error(`Failed to create sub-recipe card for ${subRecipeName}:`, insertError);
    return { success: false, error: insertError.message };
  }

  if (!insertedCard?.id) {
    return { success: false, error: 'No ID returned from insert' };
  }

  logger.dev(`Created new sub-recipe card ${insertedCard.id} for ${subRecipeName}`);

  // Link all menu items that use this sub-recipe to the card
  for (const menuItemUsage of usedByMenuItems) {
    await linkMenuItemToCard(supabase, menuItemUsage.menuItemId, insertedCard.id);
  }

  return { success: true, cardId: insertedCard.id };
}

/**
 * Save sub-recipe card with old method
 */
async function saveWithOldMethod(
  supabase: SupabaseClient,
  cardData: any,
  subRecipeName: string,
): Promise<{ success: boolean; cardId?: string; error?: string }> {
  const { data: insertedCard, error: insertError } = await supabase
    .from('menu_recipe_cards')
    .insert(cardData)
    .select('id')
    .single();

  if (insertError) {
    logger.error(`Failed to create sub-recipe card for ${subRecipeName}:`, insertError);
    return { success: false, error: insertError.message };
  }

  if (!insertedCard?.id) {
    return { success: false, error: 'No ID returned from insert' };
  }

  return { success: true, cardId: insertedCard.id };
}

/**
 * Save sub-recipe card to database
 */
export async function saveSubRecipeCard(
  supabase: SupabaseClient,
  cardData: any,
  recipeId: string,
  dataHash: string,
  subRecipeName: string,
  usedByMenuItems: CollectedSubRecipe['usedByMenuItems'],
  crossReferencingEnabled: boolean,
): Promise<{ success: boolean; cardId?: string; error?: string }> {
  if (crossReferencingEnabled) {
    return await saveWithCrossReferencing(
      supabase,
      cardData,
      recipeId,
      dataHash,
      subRecipeName,
      usedByMenuItems,
    );
  } else {
    return await saveWithOldMethod(supabase, cardData, subRecipeName);
  }
}

