/**
 * Handle Menu Item API Call
 * Makes API call to add menu item and handles response
 */

import { logger } from '@/lib/logger';
import type { Dish, MenuItem, Recipe } from '../../../../types';
import { normalizeMenuItem } from '../../../../utils/normalizeMenuItem';
import { updateMenuItemsWithServerItem } from './updateMenuItemsWithServerItem';

interface HandleMenuItemAPIParams {
  menuId: string;
  selectedItem: { type: 'dish' | 'recipe'; id: string; name: string };
  optimisticItem: MenuItem;
  dishes: Dish[];
  recipes: Recipe[];
  prevItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  refreshStatistics: () => Promise<void>;
  showError: (message: string) => void;
}

export async function handleMenuItemAPI({
  menuId,
  selectedItem,
  optimisticItem,
  dishes,
  recipes,
  prevItems,
  setMenuItems,
  refreshStatistics,
  showError,
}: HandleMenuItemAPIParams): Promise<void> {
  // Store original state for rollback
  const originalItems = [...prevItems];

  try {
    const response = await fetch(`/api/menus/${menuId}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        selectedItem.type === 'dish'
          ? { dish_id: selectedItem.id, category: optimisticItem.category }
          : { recipe_id: selectedItem.id, category: optimisticItem.category },
      ),
    });

    const result = await response.json();

    if (response.ok && result.success && result.item) {
      // Normalize server item to ensure it has all required fields and nested objects
      const serverItem = normalizeMenuItem({
        serverItem: result.item,
        menuId,
        optimisticItem,
        dishes,
        recipes,
      });

      logger.dev('[useMenuItemAddition] Normalized server item', {
        serverItemId: serverItem.id,
        hasDishes: !!serverItem.dishes,
        hasRecipes: !!serverItem.recipes,
      });

      // Replace optimistic item with real item from server
      setMenuItems(prevItems =>
        updateMenuItemsWithServerItem({
          prevItems,
          optimisticItem,
          serverItem,
        }),
      );

      // Refresh statistics in background (non-blocking)
      refreshStatistics().catch(err => logger.error('Failed to refresh statistics:', err));
    } else {
      // Rollback on error
      setMenuItems(originalItems);
      const errorMessage =
        result.error || result.message || `Failed to add item (${response.status})`;
      logger.error('[Menu Editor] API Error:', {
        status: response.status,
        error: errorMessage,
        result,
      });
      showError(errorMessage);
    }
  } catch (err) {
    // Rollback on error
    setMenuItems(originalItems);
    logger.error('[Menu Editor] Network Error:', err);
    showError('Failed to add item. Please check your connection and try again.');
  }
}
