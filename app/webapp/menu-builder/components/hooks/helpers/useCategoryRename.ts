/**
 * Hook for renaming categories.
 */
import { useCallback } from 'react';
import { logger } from '@/lib/logger';
import type { MenuItem } from '../../../types';

interface UseCategoryRenameProps {
  menuId: string;
  menuItems: MenuItem[];
  categories: string[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
  refreshStatistics: () => Promise<void>;
}

/**
 * Hook for renaming categories.
 *
 * @param {UseCategoryRenameProps} props - Hook dependencies
 * @returns {Function} handleRenameCategory function
 */
export function useCategoryRename({
  menuId,
  menuItems,
  categories,
  setMenuItems,
  setCategories,
  refreshStatistics,
}: UseCategoryRenameProps) {
  const handleRenameCategory = useCallback(
    async (oldName: string, newName: string) => {
      if (newName !== oldName && categories.includes(newName)) {
        throw new Error(`Category "${newName}" already exists`);
      }
      const originalMenuItems = [...menuItems];
      const originalCategories = [...categories];
      const itemsToUpdate = menuItems.filter(item => item.category === oldName);
      if (itemsToUpdate.length > 0) {
        setMenuItems(prevItems =>
          prevItems.map(item =>
            item.category === oldName ? { ...item, category: newName } : item,
          ),
        );
      }
      setCategories(categories.map(c => (c === oldName ? newName : c)));
      refreshStatistics().catch(err => logger.error('Failed to refresh statistics:', err));
      if (itemsToUpdate.length === 0) return;
      let hasError = false;
      const errors: string[] = [];

      for (const item of itemsToUpdate) {
        try {
          const response = await fetch(`/api/menus/${menuId}/items/${item.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              category: newName,
              position: item.position,
            }),
          });

          if (!response.ok) {
            const result = await response.json();
            logger.error('Failed to update item category:', result.error || result.message);
            hasError = true;
            errors.push(
              `${item.dishes?.dish_name || item.recipes?.recipe_name || 'Item'}: ${result.error || result.message}`,
            );
          }
        } catch (err) {
          logger.error('Failed to update item category:', err);
          hasError = true;
          errors.push(
            `Failed to update item: ${err instanceof Error ? err.message : 'Unknown error'}`,
          );
        }
      }

      if (hasError) {
        setMenuItems(originalMenuItems);
        setCategories(originalCategories);
        throw new Error(`Some items could not be updated:\n${errors.join('\n')}`);
      }
      refreshStatistics().catch(err => logger.error('Failed to refresh statistics:', err));
    },
    [menuId, menuItems, categories, setMenuItems, setCategories, refreshStatistics],
  );

  return { handleRenameCategory };
}
