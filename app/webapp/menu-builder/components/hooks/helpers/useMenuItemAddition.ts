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
 *
 * @param {UseMenuItemAdditionProps} props - Hook dependencies
 * @returns {Function} handleCategorySelect function
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
    async (category: string, selectedItem: { type: 'dish' | 'recipe'; id: string; name: string } | null) => {
      if (!selectedItem) return;

      // Find the dish or recipe data
      const dish = dishes.find(d => d.id === selectedItem.id);
      const recipe = recipes.find(r => r.id === selectedItem.id);

      if (!dish && !recipe) {
        showError('Item not found. Please try again.');
        return;
      }

      // Get the highest position in the category for the new item
      const categoryItems = menuItems.filter(item => item.category === category);
      const maxPosition =
        categoryItems.length > 0 ? Math.max(...categoryItems.map(item => item.position)) : -1;
      const newPosition = maxPosition + 1;

      // Create optimistic menu item
      const optimisticItem: MenuItem = {
        id: `temp-${Date.now()}`, // Temporary ID
        menu_id: menuId,
        category,
        position: newPosition,
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

      // Optimistically update UI immediately
      setMenuItems([...menuItems, optimisticItem]);

      // Update categories if needed
      if (!categories.includes(category)) {
        setCategories([...categories, category]);
      }

      // Make API call in background
      try {
        const response = await fetch(`/api/menus/${menuId}/items`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            selectedItem.type === 'dish'
              ? { dish_id: selectedItem.id, category }
              : { recipe_id: selectedItem.id, category },
          ),
        });

        const result = await response.json();

        if (response.ok && result.success && result.item) {
          // Replace optimistic item with real item from API (includes full dish/recipe data)
          setMenuItems(prevItems =>
            prevItems.map(item => (item.id === optimisticItem.id ? result.item : item)),
          );

          // Update statistics in background (non-blocking)
          refreshStatistics().catch(err => {
            logger.error('Failed to refresh statistics:', err);
          });
        } else {
          // Revert optimistic update on error
          const errorMessage =
            result.error || result.message || `Failed to add item (${response.status})`;
          logger.error('[Menu Editor] API Error:', {
            status: response.status,
            error: errorMessage,
            result,
          });
          setMenuItems(prevItems => prevItems.filter(item => item.id !== optimisticItem.id));
          showError(errorMessage);
        }
      } catch (err) {
        // Revert optimistic update on error
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
