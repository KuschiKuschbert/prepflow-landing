import { arrayMove } from '@dnd-kit/sortable';
import { MenuItem } from '@/lib/types/menu-builder';

import { logger } from '@/lib/logger';

interface NotificationFunctions {
  showError: (message: string) => void;
}

export async function addDishToMenu(
  menuId: string,
  dishId: string,
  category: string,
  onMenuDataReload: () => Promise<void>,
  onStatisticsUpdate: () => void,
  notifications?: NotificationFunctions,
) {
  try {
    const response = await fetch(`/api/menus/${menuId}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dish_id: dishId,
        category,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      // Refresh data in background (non-blocking)
      onMenuDataReload().catch(err => logger.error('Failed to reload menu data:', err));
      onStatisticsUpdate();
    } else {
      logger.error('Failed to add dish to menu:', result.error || result.message);
      // Show user-friendly error
      notifications?.showError(
        `Failed to add dish: ${result.error || result.message || 'Unknown error'}`,
      );
    }
  } catch (err) {
    logger.error('Failed to add dish to menu:', err);
    notifications?.showError('Failed to add dish. Please check your connection and try again.');
  }
}

export async function addRecipeToMenu(
  menuId: string,
  recipeId: string,
  category: string,
  onMenuDataReload: () => Promise<void>,
  onStatisticsUpdate: () => void,
  notifications?: NotificationFunctions,
) {
  try {
    const response = await fetch(`/api/menus/${menuId}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipe_id: recipeId,
        category,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      // Refresh data in background (non-blocking)
      onMenuDataReload().catch(err => logger.error('Failed to reload menu data:', err));
      onStatisticsUpdate();
    } else {
      logger.error('Failed to add recipe to menu:', result.error || result.message);
      // Show user-friendly error
      notifications?.showError(
        `Failed to add recipe: ${result.error || result.message || 'Unknown error'}`,
      );
    }
  } catch (err) {
    logger.error('Failed to add recipe to menu:', err);
    notifications?.showError('Failed to add recipe. Please check your connection and try again.');
  }
}

export async function reorderMenuItems(
  menuId: string,
  menuItems: MenuItem[],
  activeItem: MenuItem,
  activeId: string,
  overId: string,
  setMenuItems: (items: MenuItem[]) => void,
  onStatisticsUpdate: () => void,
  _onMenuDataReload: () => Promise<void>,
) {
  const categoryItems = menuItems
    .filter(item => item.category === activeItem.category)
    .sort((a, b) => a.position - b.position);

  const oldIndex = categoryItems.findIndex(item => item.id === activeId);
  const newIndex = categoryItems.findIndex(item => item.id === overId);

  if (oldIndex === -1 || newIndex === -1) return;

  const reordered = arrayMove(categoryItems, oldIndex, newIndex);
  const updatedItems = reordered.map((item, index) => ({
    ...item,
    position: index,
  }));

  // Store original state for rollback
  const originalMenuItems = [...menuItems];

  // Optimistically update UI immediately
  const otherItems = menuItems.filter(item => item.category !== activeItem.category);
  setMenuItems([...otherItems, ...updatedItems]);

  try {
    const response = await fetch(`/api/menus/${menuId}/reorder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: updatedItems.map(item => ({
          id: item.id,
          category: item.category,
          position: item.position,
        })),
      }),
    });

    const result = await response.json();

    if (response.ok) {
      // Refresh statistics in background (non-blocking)
      onStatisticsUpdate();
    } else {
      // Rollback on error
      setMenuItems(originalMenuItems);
      logger.error('Failed to reorder items:', result.error || result.message);
    }
  } catch (err) {
    // Rollback on error
    setMenuItems(originalMenuItems);
    logger.error('Failed to reorder items:', err);
  }
}
