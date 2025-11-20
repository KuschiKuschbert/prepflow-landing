/**
 * Hook for adding menu items to categories.
 */
import { useCallback } from 'react';
import { logger } from '@/lib/logger';
import type { MenuItem, Dish, Recipe } from '../../../types';

interface UseMenuItemAdditionProps {
  menuId: string;
  menuItems: MenuItem[];
  dishes: Dish[];
  recipes: Recipe[];
  categories: string[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
  refreshStatistics: () => Promise<void>;
  showError: (message: string) => void;
}

/**
 * Hook for adding menu items to categories.
 */
export function useMenuItemAddition({
  menuId,
  menuItems,
  dishes,
  recipes,
  categories,
  setMenuItems,
  setCategories,
  refreshStatistics,
  showError,
}: UseMenuItemAdditionProps) {
  const handleCategorySelect = useCallback(
    async (
      category: string,
      selectedItem: { type: 'dish' | 'recipe'; id: string; name: string } | null,
    ) => {
      if (!selectedItem) return;
      const dish = dishes.find(d => d.id === selectedItem.id);
      const recipe = recipes.find(r => r.id === selectedItem.id);
      if (!dish && !recipe) {
        showError('Item not found. Please try again.');
        return;
      }
      const categoryItems = menuItems.filter(item => item.category === category);
      const maxPosition = categoryItems.length > 0 ? Math.max(...categoryItems.map(item => item.position)) : -1;
      const optimisticItem: MenuItem = {
        id: `temp-${Date.now()}`,
        menu_id: menuId,
        category,
        position: maxPosition + 1,
        ...(selectedItem.type === 'dish'
          ? {
              dish_id: selectedItem.id,
              dishes: {
                id: dish!.id,
                dish_name: dish!.dish_name,
                description: dish!.description,
                selling_price: dish!.selling_price,
              },
            }
          : {
              recipe_id: selectedItem.id,
              recipes: {
                id: recipe!.id,
                recipe_name: recipe!.recipe_name,
                description: recipe!.description,
                yield: recipe!.yield,
              },
            }),
      };
      setMenuItems([...menuItems, optimisticItem]);
      if (!categories.includes(category)) setCategories([...categories, category]);
      try {
        const response = await fetch(`/api/menus/${menuId}/items`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(selectedItem.type === 'dish' ? { dish_id: selectedItem.id, category } : { recipe_id: selectedItem.id, category }),
        });

        const result = await response.json();

        if (response.ok && result.success && result.item) {
          setMenuItems(prevItems => prevItems.map(item => (item.id === optimisticItem.id ? result.item : item)));
          refreshStatistics().catch(err => logger.error('Failed to refresh statistics:', err));
        } else {
          const errorMessage = result.error || result.message || `Failed to add item (${response.status})`;
          logger.error('[Menu Editor] API Error:', { status: response.status, error: errorMessage, result });
          setMenuItems(prevItems => prevItems.filter(item => item.id !== optimisticItem.id));
          showError(errorMessage);
        }
      } catch (err) {
        logger.error('[Menu Editor] Network Error:', err);
        setMenuItems(prevItems => prevItems.filter(item => item.id !== optimisticItem.id));
        showError('Failed to add item. Please check your connection and try again.');
      }
    },
    [
      menuId,
      menuItems,
      dishes,
      recipes,
      categories,
      setMenuItems,
      setCategories,
      refreshStatistics,
      showError,
    ],
  );

  return { handleCategorySelect };
}
