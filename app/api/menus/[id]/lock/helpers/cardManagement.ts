/**
 * Utilities for managing recipe cards: fetching, deleting, signatures, linking.
 */

import { logger } from '@/lib/logger';
import { MenuItemData } from './fetchMenuItemData';

/**
 * Fetch existing recipe cards with their data hashes
 */
export async function fetchExistingCards(
  supabase: any,
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
export async function deleteCardsForItems(supabase: any, menuItemIds: string[]): Promise<void> {
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
  supabase: any,
  signature: string,
  menuItem: { dish_id?: string | null; recipe_id?: string | null },
): Promise<{ id: string; data_hash: string | null } | null> {
  try {
    // Case 1: Direct recipe - search by recipe_id
    if (menuItem.recipe_id && signature === menuItem.recipe_id) {
      logger.dev(`[findExistingCardBySignature] Searching by recipe_id: ${menuItem.recipe_id}`);
      const { data: card, error } = await supabase
        .from('menu_recipe_cards')
        .select('id, data_hash')
        .eq('recipe_id', menuItem.recipe_id)
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
            `[findExistingCardBySignature] No card found for recipe_id ${menuItem.recipe_id} (PGRST116)`,
          );
          return null;
        }
        logger.warn('[findExistingCardBySignature] Error finding card by recipe_id:', error);
        return null;
      }

      logger.dev(
        `[findExistingCardBySignature] ✅ Found card ${card?.id} for recipe_id ${menuItem.recipe_id}`,
      );
      return card;
    }

    // Case 2: Dish - search by dish_id and recipe_signature
    if (menuItem.dish_id) {
      logger.dev(
        `[findExistingCardBySignature] Searching by dish_id: ${menuItem.dish_id}, signature: ${signature}`,
      );
      const { data: card, error } = await supabase
        .from('menu_recipe_cards')
        .select('id, data_hash')
        .eq('dish_id', menuItem.dish_id)
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
            `[findExistingCardBySignature] No card found for dish_id ${menuItem.dish_id} with signature ${signature} (PGRST116)`,
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
        `[findExistingCardBySignature] ✅ Found card ${card?.id} for dish_id ${menuItem.dish_id} with signature ${signature}`,
      );
      return card;
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

/**
 * Link menu item to recipe card
 * Creates a junction record in menu_item_recipe_card_links
 *
 * @param supabase - Supabase client
 * @param menuItemId - Menu item ID
 * @param cardId - Recipe card ID
 */
export async function linkMenuItemToCard(
  supabase: any,
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
