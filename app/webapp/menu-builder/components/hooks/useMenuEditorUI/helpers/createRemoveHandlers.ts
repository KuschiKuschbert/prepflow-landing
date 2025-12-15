/**
 * Create remove handlers for categories and items.
 */
import { createCategoryRemoveDialog, createItemRemoveDialog } from './createConfirmDialog';
import { getItemName } from './getItemName';
import type { MenuItem } from '../../../../types';

interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  message: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
}

interface CreateRemoveHandlersParams {
  handleRemoveCategoryBase: (category: string, onConfirm: () => void) => void;
  performRemoveCategory: (category: string) => Promise<void>;
  handleRemoveItemBase: (itemId: string, onConfirm: () => void) => void;
  performRemoveItem: (itemId: string, itemName: string) => Promise<void>;
  menuItems: MenuItem[];
  setConfirmDialog: React.Dispatch<React.SetStateAction<ConfirmDialogState>>;
}

export function createRemoveHandlers({
  handleRemoveCategoryBase,
  performRemoveCategory,
  handleRemoveItemBase,
  performRemoveItem,
  menuItems,
  setConfirmDialog,
}: CreateRemoveHandlersParams) {
  const handleRemoveCategory = async (category: string) => {
    handleRemoveCategoryBase(category, () => {
      setConfirmDialog(
        createCategoryRemoveDialog(category, async () => {
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
          await performRemoveCategory(category);
        }),
      );
    });
  };

  const handleRemoveItem = async (itemId: string) => {
    handleRemoveItemBase(itemId, () => {
      const item = menuItems.find(i => i.id === itemId);
      const itemName = getItemName(item);
      setConfirmDialog(
        createItemRemoveDialog(itemName, async () => {
          setConfirmDialog((prev: ConfirmDialogState) => ({ ...prev, isOpen: false }));
          await performRemoveItem(itemId, itemName);
        }),
      );
    });
  };

  return { handleRemoveCategory, handleRemoveItem };
}
