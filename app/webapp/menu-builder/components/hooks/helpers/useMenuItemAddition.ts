import { useOnMenuBuilt } from '@/lib/personality/hooks';
import { useCallback } from 'react';
import type { Dish, MenuItem, Recipe } from '../../../types';
import { createOptimisticItem } from './useMenuItemAddition/createOptimisticItem';
import { handleMenuItemAPI } from './useMenuItemAddition/handleMenuItemAPI';

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
  const onMenuBuilt = useOnMenuBuilt();

  const handleCategorySelect = useCallback(
    async (
      category: string,
      selectedItem: { type: 'dish' | 'recipe'; id: string; name: string } | null,
    ) => {
      if (!selectedItem) return;
      const dish = dishes.find(d => d.id === selectedItem.id);
      const recipe = recipes.find(r => r.id === selectedItem.id);
      if (!dish && !recipe) {
        showError('Item not found. Give it another go, chef.');
        return;
      }
      const categoryItems = menuItems.filter(item => item.category === category);
      const optimisticItem = createOptimisticItem({
        menuId,
        category,
        selectedItem,
        dish,
        recipe,
        categoryItems,
      });
      setMenuItems(prevItems => [...prevItems, optimisticItem]);
      if (!categories.includes(category)) setCategories([...categories, category]);

      // Make API call and handle response
      await handleMenuItemAPI({
        menuId,
        selectedItem,
        optimisticItem,
        dishes,
        recipes,
        prevItems: menuItems,
        setMenuItems,
        refreshStatistics,
        showError,
      });

      // Trigger personality hook when first item is added to menu (menu is "built")
      if (menuItems.length === 0) {
        onMenuBuilt();
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
      onMenuBuilt,
    ],
  );

  return { handleCategorySelect };
}
