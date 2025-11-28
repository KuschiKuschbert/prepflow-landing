/**
 * Hook for updating menu item prices.
 */

import { logger } from '@/lib/logger';
import { useCallback } from 'react';

interface UseMenuItemPriceProps {
  menuId: string;
  menuItems: any[];
  setMenuItems: React.Dispatch<React.SetStateAction<any[]>>;
  loadMenuData: () => Promise<void>;
  refreshStatistics: () => Promise<void>;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
}

/**
 * Hook for updating menu item prices.
 *
 * @param {UseMenuItemPriceProps} props - Hook dependencies
 * @returns {Function} handleUpdateActualPrice function
 */
export function useMenuItemPrice({
  menuId,
  menuItems,
  setMenuItems,
  loadMenuData,
  refreshStatistics,
  showError,
  showSuccess,
}: UseMenuItemPriceProps) {
  const handleUpdateActualPrice = useCallback(
    async (itemId: string, price: number | null) => {
      logger.dev('[useMenuItemPrice] Starting price update', {
        itemId,
        price,
        menuId,
      });

      const item = menuItems.find(i => i.id === itemId);
      if (!item) {
        logger.warn('[useMenuItemPrice] Item not found', { itemId, menuId });
        return;
      }

      const itemName = item.dishes?.dish_name || item.recipes?.recipe_name || 'Unknown Item';
      const oldPrice = item.actual_selling_price;

      // Store original state for rollback
      const originalMenuItems = [...menuItems];

      // Optimistically update UI
      logger.dev('[useMenuItemPrice] Applying optimistic update', {
        itemId,
        oldPrice,
        newPrice: price,
      });
      setMenuItems(prevItems =>
        prevItems.map(i =>
          i.id === itemId ? { ...i, actual_selling_price: price ?? undefined } : i,
        ),
      );

      try {
        logger.dev('[useMenuItemPrice] Making API call', {
          itemId,
          price,
          url: `/api/menus/${menuId}/items/${itemId}`,
        });

        const response = await fetch(`/api/menus/${menuId}/items/${itemId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            actual_selling_price: price,
          }),
        });

        logger.dev('[useMenuItemPrice] API response received', {
          itemId,
          status: response.status,
          ok: response.ok,
        });

        if (response.ok) {
          const result = await response.json();

          // Log API response with exact value and type
          const apiPrice = result.item?.actual_selling_price;
          logger.dev('[useMenuItemPrice] API call successful - API response details', {
            itemId,
            updatedItem: result.item,
            actual_selling_price: apiPrice,
            actual_selling_price_type: typeof apiPrice,
            actual_selling_price_is_null: apiPrice === null,
            actual_selling_price_is_undefined: apiPrice === undefined,
            full_response: result,
          });

          // Update the specific item in state using API response
          // This ensures we use the server's authoritative data without reloading all items
          const updatedItemFromApi = result.item;

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

          setMenuItems(prevItems => {
            // Log array reference before update
            const arrayRefBefore = prevItems;
            const itemRefBefore = prevItems.find(i => i.id === itemId);

            const updatedItems = prevItems.map(i => {
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
          });

          // Show success notification
          const priceDisplay = price != null ? `$${price.toFixed(2)}` : 'default price';
          showSuccess(`Price updated to ${priceDisplay} for "${itemName}"`);

          // Refresh statistics in background to ensure accuracy
          // Don't reload all menu data - we've already updated the specific item from API response
          logger.dev('[useMenuItemPrice] Refreshing statistics', { itemId });
          refreshStatistics().catch(err => {
            logger.error('[useMenuItemPrice] Failed to refresh statistics:', err);
          });
        } else {
          // Error - revert optimistic update
          logger.error('[useMenuItemPrice] API call failed', {
            itemId,
            status: response.status,
          });
          setMenuItems(originalMenuItems);
          const result = await response.json();
          showError(result.error || result.message || 'Failed to update price');
        }
      } catch (err) {
        // Error - revert optimistic update
        logger.error('[useMenuItemPrice] Exception during price update:', err);
        setMenuItems(originalMenuItems);
        showError('Failed to update price. Please check your connection and try again.');
      }
    },
    [menuId, menuItems, setMenuItems, refreshStatistics, showError, showSuccess],
  );

  return { handleUpdateActualPrice };
}
