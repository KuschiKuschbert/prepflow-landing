import type { Dish, MenuItem, Recipe } from '@/lib/types/menu-builder';

/**
 * Creates an optimistic menu item for a dish or recipe.
 */
export function createOptimisticMenuItem(
  menuId: string,
  category: string,
  position: number,
  selectedItem: { type: 'dish' | 'recipe'; id: string },
  dish?: Dish,
  recipe?: Recipe,
): MenuItem {
  const baseItem = {
    id: `temp-${Date.now()}`,
    menu_id: menuId,
    category,
    position,
  };

  if (selectedItem.type === 'dish' && dish) {
    return {
      ...baseItem,
      dish_id: selectedItem.id,
      dishes: {
        id: dish.id,
        dish_name: dish.dish_name,
        description: dish.description,
        selling_price: dish.selling_price,
      },
    };
  }

  if (selectedItem.type === 'recipe' && recipe) {
    return {
      ...baseItem,
      recipe_id: selectedItem.id,
      recipes: {
        id: recipe.id,
        recipe_name: recipe.recipe_name,
        description: recipe.description,
        yield: recipe.yield,
      },
    };
  }

  throw new Error('Invalid item type or missing data');
}

/**
 * Calculates the next position for a menu item in a category.
 */
export function calculateNextPosition(menuItems: MenuItem[], category: string): number {
  const categoryItems = menuItems.filter(item => item.category === category);
  return categoryItems.length > 0 ? Math.max(...categoryItems.map(item => item.position)) + 1 : 0;
}

/**
 * Handles successful menu item creation response.
 */
export function handleMenuItemSuccess(
  result: { success: boolean; item?: MenuItem },
  optimisticItem: MenuItem,
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>,
  refreshStatistics: () => Promise<void>,
  logger: { error: (msg: string, ...args: unknown[]) => void },
) {
  if (result.success && result.item) {
    setMenuItems(prevItems =>
      prevItems.map(item => (item.id === optimisticItem.id ? result.item! : item)),
    );
    refreshStatistics().catch(err => logger.error('Failed to refresh statistics:', err));
  }
}

/**
 * Handles menu item creation error.
 */
export function handleMenuItemError(
  error: unknown,
  optimisticItem: MenuItem,
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>,
  showError: (message: string) => void,
  logger: { error: (msg: string, ...args: unknown[]) => void },
  result?: { error?: string; message?: string },
  status?: number,
) {
  const errorMessage =
    result?.error ||
    result?.message ||
    (status ? `Failed to add item (${status})` : 'Failed to add item');

  const errorObj = error instanceof Error ? error : new Error(String(error));
  logger.error('[Menu Editor] Error:', {
    status,
    error: errorMessage,
    result,
    originalError: errorObj,
  });
  setMenuItems(prevItems => prevItems.filter(item => item.id !== optimisticItem.id));
  showError(errorMessage);
}
