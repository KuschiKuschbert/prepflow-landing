/**
 * Save recipe card to database
 * Handles different saving strategies based on migration status
 */

import { logger } from '@/lib/logger';
import type { SupabaseClient } from '@supabase/supabase-js';
import { findExistingCardBySignature } from '../../cardManagement';
import { linkMenuItemToCard } from '../../cardManagement';

/**
 * Save card using cross-referencing method (update existing or insert new)
 */
async function saveWithCrossReferencing(
  supabase: SupabaseClient,
  cardData: any,
  signature: string,
  menuItem: any,
  menuItemData: any,
  existingCardId?: string,
): Promise<{ success: boolean; cardId?: string; error?: string }> {
  if (existingCardId) {
    // Update existing card
    const { data: updatedCard, error: updateError } = await supabase
      .from('menu_recipe_cards')
      .update(cardData)
      .eq('id', existingCardId)
      .select('id')
      .single();

    if (updateError) {
      const errorMsg = `Failed to update card for ${menuItemData.name}: ${updateError.message || String(updateError)}`;
      logger.error(`Failed to update recipe card for item ${menuItem.id}:`, updateError);
      return { success: false, error: errorMsg };
    }

    return { success: true, cardId: updatedCard?.id || existingCardId };
  }

  // Check if card exists by signature
  const existingCard = await findExistingCardBySignature(supabase, signature, menuItem);
  if (existingCard) {
    // Update existing card
    const { data: updatedCard, error: updateError } = await supabase
      .from('menu_recipe_cards')
      .update(cardData)
      .eq('id', existingCard.id)
      .select('id')
      .single();

    if (updateError) {
      const errorMsg = `Failed to update card for ${menuItemData.name}: ${updateError.message || String(updateError)}`;
      logger.error(`Failed to update recipe card for item ${menuItem.id}:`, updateError);
      return { success: false, error: errorMsg };
    }

    return { success: true, cardId: updatedCard?.id || existingCard.id };
  }

  // Insert new card
  const { data: insertedCard, error: insertError } = await supabase
    .from('menu_recipe_cards')
    .insert(cardData)
    .select('id')
    .single();

  if (insertError) {
    const errorMsg = `Failed to save card for ${menuItemData.name}: ${insertError.message || String(insertError)}`;
    logger.error(`Failed to save recipe card for item ${menuItem.id}:`, insertError);
    return { success: false, error: errorMsg };
  }

  if (!insertedCard?.id) {
    const errorMsg = `Failed to save card for ${menuItemData.name}: No ID returned`;
    logger.error(`Failed to save recipe card for item ${menuItem.id}: No ID returned`);
    return { success: false, error: errorMsg };
  }

  return { success: true, cardId: insertedCard.id };
}

/**
 * Save card using old method (upsert by menu_item_id)
 */
async function saveWithOldMethod(
  supabase: SupabaseClient,
  cardData: any,
  menuItemData: any,
  menuItem: any,
): Promise<{ success: boolean; cardId?: string; error?: string }> {
  const { data: savedCard, error: saveError } = await supabase
    .from('menu_recipe_cards')
    .upsert(cardData, {
      onConflict: 'menu_item_id',
    })
    .select('id')
    .single();

  if (saveError) {
    const errorMsg = `Failed to save card for ${menuItemData.name}: ${saveError.message || String(saveError)}`;
    logger.error(`Failed to save recipe card for item ${menuItem.id}:`, saveError);
    return { success: false, error: errorMsg };
  }

  if (!savedCard?.id) {
    const errorMsg = `Failed to save card for ${menuItemData.name}: No ID returned`;
    logger.error(`Failed to save recipe card for item ${menuItem.id}: No ID returned`);
    return { success: false, error: errorMsg };
  }

  return { success: true, cardId: savedCard.id };
}

/**
 * Save recipe card to database
 *
 * @param supabase - Supabase client
 * @param cardData - Card data to save
 * @param signature - Recipe signature
 * @param menuItem - Menu item
 * @param menuItemData - Menu item data
 * @param crossReferencingEnabled - Whether cross-referencing is enabled
 * @param existingCardId - Existing card ID if updating
 * @returns Save result with card ID
 */
export async function saveCard(
  supabase: SupabaseClient,
  cardData: any,
  signature: string,
  menuItem: any,
  menuItemData: any,
  crossReferencingEnabled: boolean,
  existingCardId?: string,
): Promise<{ success: boolean; cardId?: string; error?: string }> {
  if (crossReferencingEnabled) {
    return await saveWithCrossReferencing(
      supabase,
      cardData,
      signature,
      menuItem,
      menuItemData,
      existingCardId,
    );
  } else {
    return await saveWithOldMethod(supabase, cardData, menuItemData, menuItem);
  }
}

/**
 * Link menu item to card and return final result
 */
export async function finalizeCardSave(
  supabase: SupabaseClient,
  menuItemId: string,
  cardId: string,
  menuItemData: any,
  crossReferencingEnabled: boolean,
): Promise<{ success: boolean }> {
  // Link menu item to card (only if cross-referencing is enabled)
  if (crossReferencingEnabled) {
    await linkMenuItemToCard(supabase, menuItemId, cardId);
  }

  logger.dev(`Successfully generated recipe card for ${menuItemData.name}`);
  return { success: true };
}

