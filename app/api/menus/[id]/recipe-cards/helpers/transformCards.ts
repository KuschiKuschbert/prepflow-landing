/**
 * Helper to transform cards for response.
 */

import type { CardMapEntry, ItemOrder, RecipeCard, SubRecipeCard } from '../types';

/**
 * Transform cards for response, separating main cards from sub-recipe cards.
 */
interface SubRecipeUsage {
  menu_item_id: string;
  menu_item_name?: string;
  quantity?: number;
}

export function transformCards(
  cardMap: Map<string, CardMapEntry>,
  itemOrderMap: Map<string, ItemOrder>,
  menuItemNameMap: Map<string, string>,
): { mainCards: (RecipeCard & { _order: ItemOrder })[]; subRecipeCards: SubRecipeCard[] } {
  const mainCards: (RecipeCard & { _order: ItemOrder })[] = [];
  const subRecipeCards: SubRecipeCard[] = [];

  // Transform cards for response
  Array.from(cardMap.values()).forEach(({ card, menuItemIds, menuItemNames }) => {
    // Use first menu item for ordering (cards appear once per unique recipe)
    const firstMenuItemId = menuItemIds[0];
    const firstMenuItemName = menuItemNames[0];

    const transformedCard: RecipeCard = {
      id: card.id,
      menuItemId: firstMenuItemId, // Keep for backward compatibility
      menuItemIds, // New: all menu items using this card
      menuItemName: firstMenuItemName, // Keep for backward compatibility
      menuItemNames, // New: all menu item names
      title: card.title || firstMenuItemName,
      baseYield: card.base_yield || 1,
      ingredients: card.ingredients || [],
      methodSteps: card.method_steps || [],
      notes: card.notes
        ? typeof card.notes === 'string'
          ? (card.notes as string).split('\n').filter((n: string) => n.trim().length > 0)
          : Array.isArray(card.notes)
          ? (card.notes as string[])
          : []
        : [],
      parsedAt: card.parsed_at,
      recipeId: card.recipe_id || null,
      dishId: card.dish_id || null,
      recipeSignature: card.recipe_signature || null,
    };

    // Check if this is a sub-recipe card (recipe_id set, dish_id null)
    const isSubRecipe = transformedCard.recipeId && !transformedCard.dishId;

    if (isSubRecipe) {
      // Extract sub-recipe metadata from card_content
      const cardContent = (card.card_content || {}) as Record<string, unknown>;
      const subRecipeType = (cardContent.sub_recipe_type as string) || 'other';
      const usedByMenuItems = (cardContent.used_by_menu_items as SubRecipeUsage[]) || [];

      subRecipeCards.push({
        ...transformedCard,
        subRecipeType,
        usedByMenuItems: usedByMenuItems.map((mi) => ({
          menuItemId: mi.menu_item_id,
          menuItemName: mi.menu_item_name || menuItemNameMap.get(mi.menu_item_id) || 'Unknown Item',
          quantity: mi.quantity || 1,
        })),
      });
    } else {
      mainCards.push({
        ...transformedCard,
        _order: itemOrderMap.get(firstMenuItemId) || { category: '', position: 999 },
      });
    }
  });

  return { mainCards, subRecipeCards };
}
