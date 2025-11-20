/**
 * Hook for adding categories.
 */

import { useCallback } from 'react';

interface UseCategoryAdditionProps {
  categories: string[];
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
}

/**
 * Hook for adding categories.
 *
 * @param {UseCategoryAdditionProps} props - Hook dependencies
 * @returns {Function} handleAddCategory function
 */
export function useCategoryAddition({ categories, setCategories }: UseCategoryAdditionProps) {
  const handleAddCategory = useCallback(
    (newCategory: string, setNewCategory: (value: string) => void) => {
      if (newCategory.trim() && !categories.includes(newCategory.trim())) {
        setCategories([...categories, newCategory.trim()]);
        setNewCategory('');
      }
    },
    [categories, setCategories],
  );

  return { handleAddCategory };
}
