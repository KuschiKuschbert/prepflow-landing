/**
 * Create confirm dialog configuration for category/item removal.
 */
export function createCategoryRemoveDialog(
  category: string,
  onConfirm: () => void,
): {
  isOpen: boolean;
  title: string;
  message: string;
  variant: 'warning';
  onConfirm: () => void;
} {
  return {
    isOpen: true,
    title: 'Remove Category',
    message: `Remove category "${category}"? Items in this category will be moved to "Uncategorized".`,
    variant: 'warning',
    onConfirm,
  };
}

export function createItemRemoveDialog(
  itemName: string,
  onConfirm: () => void,
): {
  isOpen: boolean;
  title: string;
  message: string;
  variant: 'warning';
  onConfirm: () => void;
} {
  return {
    isOpen: true,
    title: 'Remove Item',
    message: `Remove "${itemName}" from this menu?`,
    variant: 'warning',
    onConfirm,
  };
}
