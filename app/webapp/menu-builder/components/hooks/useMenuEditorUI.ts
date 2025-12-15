import { useState } from 'react';
import type { MenuItem } from '../../types';
import { createInitialDialogState } from './useMenuEditorUI/helpers/createInitialDialogState';
import { createRemoveHandlers } from './useMenuEditorUI/helpers/createRemoveHandlers';

interface UseMenuEditorUIProps {
  handleAddCategoryBase: (category: string, setNewCategory: (cat: string) => void) => void;
  handleRemoveCategoryBase: (category: string, onConfirm: () => void) => void;
  performRemoveCategory: (category: string) => Promise<void>;
  handleRemoveItemBase: (itemId: string, onConfirm: () => void) => void;
  performRemoveItem: (itemId: string, itemName: string) => Promise<void>;
  handleCategorySelect: (
    category: string,
    selectedItem: { type: 'dish' | 'recipe'; id: string; name: string } | null,
  ) => Promise<void>;
  menuItems: MenuItem[];
}

/**
 * Hook for managing MenuEditor UI state and wrapper handlers.
 *
 * @param {UseMenuEditorUIProps} props - Hook props
 * @returns {Object} UI state and handlers
 */
export function useMenuEditorUI({
  handleAddCategoryBase,
  handleRemoveCategoryBase,
  performRemoveCategory,
  handleRemoveItemBase,
  performRemoveItem,
  handleCategorySelect,
  menuItems,
}: UseMenuEditorUIProps) {
  const [newCategory, setNewCategory] = useState('');
  const [selectedItem, setSelectedItem] = useState<{
    type: 'dish' | 'recipe';
    id: string;
    name: string;
  } | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
  const [selectedItemForStats, setSelectedItemForStats] = useState<MenuItem | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    variant?: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
  }>(createInitialDialogState());
  const handleAddCategory = () => handleAddCategoryBase(newCategory, setNewCategory);
  const { handleRemoveCategory, handleRemoveItem } = createRemoveHandlers({
    handleRemoveCategoryBase,
    performRemoveCategory,
    handleRemoveItemBase,
    performRemoveItem,
    menuItems,
    setConfirmDialog,
  });

  const handleItemTap = (
    item: { type: 'dish' | 'recipe'; id: string; name: string },
    element: HTMLElement,
  ) => {
    setSelectedItem(item);
    setAnchorElement(element);
    setShowCategoryModal(true);
  };

  const handleCategorySelectWrapper = async (category: string) => {
    await handleCategorySelect(category, selectedItem);
    setShowCategoryModal(false);
    setSelectedItem(null);
    setAnchorElement(null);
  };

  return {
    newCategory,
    setNewCategory,
    selectedItem,
    setSelectedItem,
    showCategoryModal,
    setShowCategoryModal,
    anchorElement,
    setAnchorElement,
    selectedItemForStats,
    setSelectedItemForStats,
    confirmDialog,
    setConfirmDialog,
    handleAddCategory,
    handleRemoveCategory,
    handleRemoveItem,
    handleItemTap,
    handleCategorySelectWrapper,
  };
}
