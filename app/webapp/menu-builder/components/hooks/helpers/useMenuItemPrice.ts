/**
 * Hook for updating menu item prices.
 */

import { logger } from '@/lib/logger';
import { useCallback } from 'react';
import type { MenuItem } from '../../../types';
import { applyOptimisticUpdate } from './useMenuItemPrice/helpers/applyOptimisticUpdate';
import { makePriceUpdateRequest } from './useMenuItemPrice/helpers/makePriceUpdateRequest';
import { updateItemInState } from './useMenuItemPrice/helpers/updateItemInState';

interface UseMenuItemPriceProps {
  menuId: string;
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
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

      // Store original state for rollback
      const originalMenuItems = [...menuItems];

      // Optimistically update UI
      setMenuItems(prevItems => applyOptimisticUpdate(prevItems, itemId, price));

      try {
        const result = await makePriceUpdateRequest(menuId, itemId, price);

        if (result.ok && result.item) {
          // Update the specific item in state using API response
          setMenuItems(prevItems => updateItemInState(prevItems, itemId, result.item!));

          // Show success notification
          const priceDisplay = price != null ? `$${price.toFixed(2)}` : 'default price';
          showSuccess(`Price updated to ${priceDisplay} for "${itemName}"`);

          // Refresh statistics in background to ensure accuracy
          logger.dev('[useMenuItemPrice] Refreshing statistics', { itemId });
          refreshStatistics().catch(err => {
            logger.error('[useMenuItemPrice] Failed to refresh statistics:', err);
          });
        } else {
          // Error - revert optimistic update
          logger.error('[useMenuItemPrice] API call failed', {
            itemId,
            status: result.status,
          });
          setMenuItems(originalMenuItems);
          showError(result.error || 'Failed to update price');
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
