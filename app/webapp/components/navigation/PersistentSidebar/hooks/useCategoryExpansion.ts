/**
 * Hook for managing category expansion state
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { NavigationItemConfig } from '../../nav-items';

/**
 * Hook for managing category expansion state
 *
 * @param {Record<string, NavigationItemConfig[]>} groupedItems - Grouped navigation items
 * @param {Function} isActive - Function to check if a route is active
 * @param {boolean} mounted - Whether component is mounted
 * @returns {Object} Category expansion state and handlers
 */
export function useCategoryExpansion(
  groupedItems: Record<string, NavigationItemConfig[]>,
  isActive: (href: string) => boolean,
  mounted: boolean,
) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [hasLoadedSavedCategory, setHasLoadedSavedCategory] = useState(false);
  const [userManuallyToggled, setUserManuallyToggled] = useState(false);
  const lastActiveCategoryRef = useRef<string | null>(null);

  // Load saved expansion state from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && mounted && !hasLoadedSavedCategory) {
      const savedCategory = localStorage.getItem('sidebar-expanded-category');
      if (savedCategory && groupedItems[savedCategory]) {
        setExpandedCategory(savedCategory);
      }
      setHasLoadedSavedCategory(true);
    }
  }, [mounted, hasLoadedSavedCategory, groupedItems]);

  const getActiveCategory = useCallback(() => {
    return Object.entries(groupedItems).find(([category, items]) => {
      if (category === 'primary') return false;
      return items.some(item => isActive(item.href));
    })?.[0];
  }, [groupedItems, isActive]);

  // Auto-expand category if it contains active item
  useEffect(() => {
    if (!mounted || !hasLoadedSavedCategory) return;

    const activeCategory = getActiveCategory();

    if (activeCategory) {
      const lastActive = lastActiveCategoryRef.current;

      if (lastActive && lastActive !== activeCategory) {
        setUserManuallyToggled(false);
        setExpandedCategory(activeCategory);
        if (typeof window !== 'undefined') {
          localStorage.setItem('sidebar-expanded-category', activeCategory);
        }
        lastActiveCategoryRef.current = activeCategory;
        return;
      }

      if (!userManuallyToggled) {
        if (!expandedCategory || expandedCategory !== activeCategory) {
          setExpandedCategory(activeCategory);
          if (typeof window !== 'undefined') {
            localStorage.setItem('sidebar-expanded-category', activeCategory);
          }
        }
      }

      if (lastActive !== activeCategory) {
        lastActiveCategoryRef.current = activeCategory;
      }
    }
  }, [mounted, hasLoadedSavedCategory, getActiveCategory, expandedCategory, userManuallyToggled]);

  const handleCategoryToggle = useCallback((category: string) => {
    setUserManuallyToggled(true);
    setExpandedCategory(prev => {
      const newCategory = prev === category ? null : category;
      if (typeof window !== 'undefined') {
        if (newCategory) {
          localStorage.setItem('sidebar-expanded-category', newCategory);
        } else {
          localStorage.removeItem('sidebar-expanded-category');
        }
      }
      return newCategory;
    });
  }, []);

  return { expandedCategory, handleCategoryToggle };
}
