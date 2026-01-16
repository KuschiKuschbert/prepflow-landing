/**
 * Helper to process recipe cards (old vs new method).
 */

import type { CardMapEntry } from '../types';
import type { RecipeCardLink, RecipeCardOld } from './fetchRecipeCardLinks';

/**
 * Process cards using old method (one card per menu item).
 */
export function processCardsOldMethod(
  cards: RecipeCardOld[],
  menuItemNameMap: Map<string, string>,
): Map<string, CardMapEntry> {
  const cardMap = new Map<string, CardMapEntry>();

  for (const card of cards) {
    const cardId = card.id;
    const menuItemId = card.menu_item_id;
    const menuItemName = menuItemNameMap.get(menuItemId) || 'Unknown Item';

    if (!cardMap.has(cardId)) {
      cardMap.set(cardId, {
        card: {
          ...card,
          recipe_id: null,
          dish_id: null,
          recipe_signature: null,
        } as unknown as import('../types').RecipeCardDB, // Old cards map to DB type with nulls
        menuItemIds: [],
        menuItemNames: [],
      });
    }

    const cardData = cardMap.get(cardId)!;
    cardData.menuItemIds.push(menuItemId);
    cardData.menuItemNames.push(menuItemName);
  }

  return cardMap;
}

/**
 * Process cards using new method (cross-referencing via junction table).
 */
export function processCardsNewMethod(
  links: RecipeCardLink[],
  menuItemNameMap: Map<string, string>,
): Map<string, CardMapEntry> {
  const cardMap = new Map<string, CardMapEntry>();

  for (const link of links) {
    const card = link.menu_recipe_cards;
    if (!card) continue;

    const cardId = card.id;
    const menuItemId = link.menu_item_id;
    const menuItemName = menuItemNameMap.get(menuItemId) || 'Unknown Item';

    if (!cardMap.has(cardId)) {
      cardMap.set(cardId, {
        card,
        menuItemIds: [],
        menuItemNames: [],
      });
    }

    const cardData = cardMap.get(cardId)!;
    cardData.menuItemIds.push(menuItemId);
    cardData.menuItemNames.push(menuItemName);
  }

  return cardMap;
}
