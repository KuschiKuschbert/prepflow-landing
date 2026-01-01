/**
 * Hook for updating menu item region.
 */

import { logger } from '@/lib/logger';
import { useCallback } from 'react';
import { MenuItem } from '../../../types';

interface UseMenuItemRegionProps {
  menuId: string;
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  refreshStatistics: () => Promise<void>;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
}

/**
 * Hook for updating menu item region.
 *
 * @param {UseMenuItemRegionProps} props - Hook dependencies
 * @returns {Function} handleUpdateRegion function
 */
export function useMenuItemRegion({
  menuId,
  menuItems,
  setMenuItems,
  refreshStatistics,
  showError,
  showSuccess,
}: UseMenuItemRegionProps) {
  const handleUpdateRegion = useCallback(
    async (itemId: string, region: string | null) => {
      logger.dev('[useMenuItemRegion] Starting region update', {
        itemId,
        region,
        menuId,
      });

      const item = menuItems.find(i => i.id === itemId);
      if (!item) {
        logger.warn('[useMenuItemRegion] Item not found', { itemId, menuId });
        return;
      }

      const itemName = item.dishes?.dish_name || item.recipes?.recipe_name || 'Unknown Item';

      // Store original state for rollback
      const originalMenuItems = [...menuItems];

      // Optimistically update UI
      setMenuItems(prevItems => prevItems.map(i => (i.id === itemId ? { ...i, region } : i)));

      try {
        const response = await fetch(`/api/menus/${menuId}/items/${itemId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            region,
          }),
        });

        const result = await response.json();

        if (response.ok && result.item) {
          // Update the specific item in state using API response
          setMenuItems(prevItems =>
            prevItems.map(i => (i.id === itemId ? { ...i, ...result.item } : i)),
          );

          // Show success notification
          const regionDisplay = region ? region : 'no region';
          showSuccess(`Region updated to ${regionDisplay} for "${itemName}"`);

          // Refresh statistics (though region shouldn't affect stats much, good practice)
          refreshStatistics().catch(err => {
            logger.error('[useMenuItemRegion] Failed to refresh statistics:', err);
          });
        } else {
          // Error - revert optimistic update
          logger.error('[useMenuItemRegion] API call failed', {
            itemId,
            status: response.status,
            error: result.error,
          });
          setMenuItems(originalMenuItems);
          showError(result.error || result.message || 'Failed to update region');
        }
      } catch (err) {
        // Error - revert optimistic update
        logger.error('[useMenuItemRegion] Exception during region update:', err);
        setMenuItems(originalMenuItems);
        showError('Failed to update region. Please check your connection and try again.');
      }
    },
    [menuId, menuItems, setMenuItems, refreshStatistics, showError, showSuccess],
  );

  return { handleUpdateRegion };
}
