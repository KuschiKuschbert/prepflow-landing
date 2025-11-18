import { useState, useEffect, useRef } from 'react';

interface UseMenuItemDropdownsProps {
  onMoveToCategory?: (targetCategory: string) => void;
  currentCategory: string;
  availableCategories?: string[];
}

/**
 * Hook for managing menu item dropdown state and handlers.
 *
 * @param {UseMenuItemDropdownsProps} props - Hook props
 * @returns {Object} Dropdown state and handlers
 */
export function useMenuItemDropdowns({
  onMoveToCategory,
  currentCategory,
  availableCategories = [],
}: UseMenuItemDropdownsProps) {
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showReorderDropdown, setShowReorderDropdown] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const reorderDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setShowCategoryDropdown(false);
      }
      if (
        reorderDropdownRef.current &&
        !reorderDropdownRef.current.contains(event.target as Node)
      ) {
        setShowReorderDropdown(false);
      }
    };

    if (showCategoryDropdown || showReorderDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showCategoryDropdown, showReorderDropdown]);

  const handleMoveToCategory = (targetCategory: string) => {
    if (onMoveToCategory && targetCategory !== currentCategory) {
      onMoveToCategory(targetCategory);
    }
    setShowCategoryDropdown(false);
  };

  return {
    showCategoryDropdown,
    setShowCategoryDropdown,
    showReorderDropdown,
    setShowReorderDropdown,
    categoryDropdownRef,
    reorderDropdownRef,
    handleMoveToCategory,
  };
}
