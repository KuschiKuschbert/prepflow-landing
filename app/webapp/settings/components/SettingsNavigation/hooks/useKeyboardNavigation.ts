import { useCallback } from 'react';
import { categories } from '../navItems';
import type { FocusedIndex } from '../types';

interface UseKeyboardNavigationProps {
  handleNavClick: (hash: string) => void;
  setFocusedIndex: (index: FocusedIndex | null) => void;
  setExpandedCategories: React.Dispatch<React.SetStateAction<Set<string>>>;
  navRefs: React.MutableRefObject<Map<string, HTMLButtonElement>>;
}

/**
 * Hook for keyboard navigation in settings navigation
 */
export function useKeyboardNavigation({
  handleNavClick,
  setFocusedIndex,
  setExpandedCategories,
  navRefs,
}: UseKeyboardNavigationProps) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, categoryId: string, itemIndex: number, itemHash: string) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleNavClick(itemHash);
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const allItems: Array<{ categoryId: string; itemIndex: number; hash: string }> = [];
        categories.forEach(cat => {
          cat.items.forEach((item, idx) => {
            allItems.push({ categoryId: cat.id, itemIndex: idx, hash: item.hash });
          });
        });

        const currentIndex = allItems.findIndex(
          item => item.categoryId === categoryId && item.itemIndex === itemIndex,
        );
        if (currentIndex === -1) return;

        const nextIndex = e.key === 'ArrowDown' ? currentIndex + 1 : currentIndex - 1;
        if (nextIndex >= 0 && nextIndex < allItems.length) {
          const nextItem = allItems[nextIndex];
          setFocusedIndex({ categoryId: nextItem.categoryId, itemIndex: nextItem.itemIndex });
          // Ensure category is expanded
          setExpandedCategories(prev => new Set([...prev, nextItem.categoryId]));
          // Focus the element
          setTimeout(() => {
            const key = `${nextItem.categoryId}-${nextItem.itemIndex}`;
            const element = navRefs.current.get(key);
            element?.focus();
          }, 0);
        }
      }

      if (e.key === 'Escape') {
        // Close sidebar handled by parent component
      }
    },
    [handleNavClick, setFocusedIndex, setExpandedCategories, navRefs],
  );

  return {
    handleKeyDown,
  };
}
