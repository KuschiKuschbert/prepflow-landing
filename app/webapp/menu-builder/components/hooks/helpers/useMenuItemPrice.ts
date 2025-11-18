/**
 * Hook for updating menu item prices.
 */

import { useCallback } from 'react';
import { logger } from '@/lib/logger';

interface UseMenuItemPriceProps {
  menuId: string;
  menuItems: any[];
  setMenuItems: React.Dispatch<React.SetStateAction<any[]>>;
  loadMenuData: () => Promise<void>;
  refreshStatistics: () => Promise<void>;
  showError: (message: string) => void;
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
}: UseMenuItemPriceProps) {
  const handleUpdateActualPrice = useCallback(
    async (itemId: string, price: number | null) => {
      const item = menuItems.find(i => i.id === itemId);
      if (!item) return;

      // Store original state for rollback
      const originalMenuItems = [...menuItems];

      // Optimistically update UI
      setMenuItems(prevItems =>
        prevItems.map(i =>
          i.id === itemId ? { ...i, actual_selling_price: price ?? undefined } : i,
        ),
      );

      try {
        const response = await fetch(`/api/menus/${menuId}/items/${itemId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            actual_selling_price: price,
          }),
        });

        if (response.ok) {
          // Success - reload menu data to ensure consistency
          await loadMenuData();
          // Refresh statistics in background to ensure accuracy
          refreshStatistics().catch(err => {
            logger.error('Failed to refresh statistics:', err);
          });
        } else {
          // Error - revert optimistic update
          setMenuItems(originalMenuItems);
          const result = await response.json();
          showError(result.error || result.message || 'Failed to update price');
        }
      } catch (err) {
        // Error - revert optimistic update
        setMenuItems(originalMenuItems);
        logger.error('Failed to update price:', err);
        showError('Failed to update price. Please check your connection and try again.');
      }
    },
    [menuId, menuItems, setMenuItems, loadMenuData, refreshStatistics, showError],
  );

  return { handleUpdateActualPrice };
}
