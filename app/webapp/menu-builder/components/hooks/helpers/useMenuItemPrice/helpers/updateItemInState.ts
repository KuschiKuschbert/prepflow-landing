/**
 * Helper to update item in state from API response.
 */

import { logger } from '@/lib/logger';

/**
 * Update menu item in state from API response.
 */
export function updateItemInState(
  menuItems: any[],
  itemId: string,
  updatedItemFromApi: any,
): any[] {
  // Log current state before update
  const currentItem = menuItems.find(i => i.id === itemId);
  logger.dev('[useMenuItemPrice] Current state before update', {
    itemId,
    currentArrayReference: menuItems,
    currentItemReference: currentItem,
    currentItemPrice: currentItem?.actual_selling_price,
    currentItemPriceType: typeof currentItem?.actual_selling_price,
    arrayLength: menuItems.length,
  });

  const arrayRefBefore = menuItems;
  const itemRefBefore = menuItems.find(i => i.id === itemId);

  const updatedItems = menuItems.map(i => {
    if (i.id === itemId) {
      // Create completely new object with all properties spread
      // This ensures React detects the reference change and triggers re-renders
      const newItem = {
        ...i,
        actual_selling_price: updatedItemFromApi.actual_selling_price ?? undefined,
        // Also update other fields that might have changed (category, position, etc.)
        category: updatedItemFromApi.category ?? i.category,
        position: updatedItemFromApi.position ?? i.position,
      };

      // Log item object reference comparison
      logger.dev('[useMenuItemPrice] Created new item object - reference comparison', {
        itemId,
        oldPrice: i.actual_selling_price,
        oldPriceType: typeof i.actual_selling_price,
        newPrice: newItem.actual_selling_price,
        newPriceType: typeof newItem.actual_selling_price,
        oldItemReference: i,
        newItemReference: newItem,
        referencesEqual: i === newItem,
        oldItemId: i.id,
        newItemId: newItem.id,
      });
      return newItem;
    }
    return i; // Keep other items as-is (same reference is fine)
  });

  // Log array reference comparison
  const arrayRefAfter = updatedItems;
  const itemRefAfter = updatedItems.find(i => i.id === itemId);
  logger.dev('[useMenuItemPrice] Updated menuItems array - reference comparison', {
    itemId,
    arrayLength: updatedItems.length,
    arrayReferenceBefore: arrayRefBefore,
    arrayReferenceAfter: arrayRefAfter,
    arraysEqual: arrayRefBefore === arrayRefAfter,
    itemReferenceBefore: itemRefBefore,
    itemReferenceAfter: itemRefAfter,
    itemsEqual: itemRefBefore === itemRefAfter,
    updatedItem: itemRefAfter,
    updatedItemPrice: itemRefAfter?.actual_selling_price,
    updatedItemPriceType: typeof itemRefAfter?.actual_selling_price,
  });

  return updatedItems;
}
