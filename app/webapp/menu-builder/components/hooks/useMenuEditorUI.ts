import { useState } from 'react';
import { MenuItem } from '../../types';

interface UseMenuEditorUIProps {
  handleAddCategoryBase: (category: string, setNewCategory: (cat: string) => void) => void;
  handleRemoveCategoryBase: (category: string, onConfirm: () => void) => void;
  performRemoveCategory: (category: string) => Promise<void>;
  handleRemoveItemBase: (itemId: string, onConfirm: () => void) => void;
  performRemoveItem: (itemId: string, itemName: string) => Promise<void>;
  handleCategorySelect: (category: string, selectedItem: { type: 'dish' | 'recipe'; id: string; name: string } | null) => Promise<void>;
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
    onConfirm: () => void;
    variant?: 'danger' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    variant: 'warning',
  });

  const handleAddCategory = () => {
    handleAddCategoryBase(newCategory, setNewCategory);
  };

  const handleRemoveCategory = async (category: string) => {
    handleRemoveCategoryBase(category, () => {
      setConfirmDialog({
        isOpen: true,
        title: 'Remove Category',
        message: `Remove category "${category}"? Items in this category will be moved to "Uncategorized".`,
        variant: 'warning',
        onConfirm: async () => {
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
          await performRemoveCategory(category);
        },
      });
    });
  };

  const handleRemoveItem = async (itemId: string) => {
    handleRemoveItemBase(itemId, () => {
      const item = menuItems.find(i => i.id === itemId);
      const itemName = item?.dishes?.dish_name || item?.recipes?.recipe_name || 'this item';
      setConfirmDialog({
        isOpen: true,
        title: 'Remove Item',
        message: `Remove "${itemName}" from this menu?`,
        variant: 'warning',
        onConfirm: async () => {
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
          await performRemoveItem(itemId, itemName);
        },
      });
    });
  };

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
