/**
 * Utilities for managing recipe cards: fetching, deleting, signatures, linking.
 */

import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';
import { MenuItemData } from './types';

/**
 * Fetch existing recipe cards with their data hashes
 */
export async function fetchExistingCards(
  supabase: SupabaseClient,
  menuItemIds: string[],
): Promise<Map<string, { dataHash: string | null; parsedAt: string | null }>> {
  if (menuItemIds.length === 0) {
    return new Map();
  }

  const { data: cards, error } = await supabase
    .from('menu_recipe_cards')
    .select('menu_item_id, data_hash, parsed_at')
    .in('menu_item_id', menuItemIds);

  if (error) {
    logger.warn('Failed to fetch existing recipe cards:', error);
    return new Map();
  }

  const cardMap = new Map<string, { dataHash: string | null; parsedAt: string | null }>();
  for (const card of cards || []) {
    cardMap.set(card.menu_item_id, {
      dataHash: card.data_hash || null,
      parsedAt: card.parsed_at || null,
    });
  }

  return cardMap;
}

/**
 * Delete specific recipe cards by menu item IDs
 */
export async function deleteCardsForItems(
  supabase: SupabaseClient,
  menuItemIds: string[],
): Promise<void> {
  if (menuItemIds.length === 0) {
    return;
  }

  const { error: deleteError } = await supabase
    .from('menu_recipe_cards')
    .delete()
    .in('menu_item_id', menuItemIds);

  if (deleteError) {
    logger.warn('Failed to delete recipe cards:', deleteError);
  }
}

/**
 * Get recipe signature for cross-referencing
 * Returns a unique identifier for the recipe(s) used by a menu item
 *
 * @param menuItemData - Menu item data with type and sub-recipes
 * @param menuItem - Menu item with dish_id or recipe_id
 * @returns Recipe signature string or null if cannot determine
 */
export function getRecipeSignature(
  menuItemData: MenuItemData,
  menuItem: { dish_id?: string | null; recipe_id?: string | null },
): string | null {
  // Case 1: Direct recipe menu item
  if (menuItem.recipe_id) {
    return menuItem.recipe_id;
  }

  // Case 2: Dish menu item
  if (menuItem.dish_id) {
    // Case 2a: Dish with recipes - use sorted recipe IDs joined with ":"
    if (menuItemData.subRecipes && menuItemData.subRecipes.length > 0) {
      const recipeIds = menuItemData.subRecipes
        .map(sr => sr.recipeId)
        .sort()
        .join(':');
      return recipeIds;
    }

    // Case 2b: Dish without recipes (direct ingredients only) - use dish_id
    return `dish:${menuItem.dish_id}`;
  }

  // Cannot determine signature
  logger.warn('Cannot determine recipe signature - menu item has neither dish_id nor recipe_id');
  return null;
}

export { findExistingCardBySignature } from './cardManagement/findBySignature';

/**
 * Link menu item to recipe card
 * Creates a junction record in menu_item_recipe_card_links
 *
 * @param supabase - Supabase client
 * @param menuItemId - Menu item ID
 * @param cardId - Recipe card ID
 */
export async function linkMenuItemToCard(
  supabase: SupabaseClient,
  menuItemId: string,
  cardId: string,
): Promise<void> {
  try {
    const { error } = await supabase.from('menu_item_recipe_card_links').upsert(
      {
        menu_item_id: menuItemId,
        recipe_card_id: cardId,
      },
      { onConflict: 'menu_item_id,recipe_card_id' },
    );

    if (error) {
      // Check if table doesn't exist (migration not run)
      if (error.message?.includes('relation') && error.message.includes('does not exist')) {
        logger.dev(
          'menu_item_recipe_card_links table does not exist, migration not run - skipping link creation',
        );
        return;
      }
      logger.warn('Failed to link menu item to card:', error);
      // Don't throw - this is not critical, card still exists
    }
  } catch (err) {
    logger.warn('Exception in linkMenuItemToCard:', err);
    // Don't throw - this is not critical
  }
}
