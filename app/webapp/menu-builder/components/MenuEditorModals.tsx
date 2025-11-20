'use client';

import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { MenuItemStatisticsModal } from './MenuItemStatisticsModal';
import CategorySelectorModal from './CategorySelectorModal';
import { MenuItem } from '../types';

interface MenuEditorModalsProps {
  showCategoryModal: boolean;
  categories: string[];
  selectedItem: { name: string } | null;
  anchorElement: HTMLElement | null;
  onSelectCategory: (category: string) => void;
  onCloseCategoryModal: () => void;
  selectedItemForStats: MenuItem | null;
  menuId: string;
  onCloseStatsModal: () => void;
  onUpdatePrice: (itemId: string, price: number | null) => void;
  confirmDialog: {
    isOpen: boolean;
    title: string;
    message: string;
    variant?: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
  };
  onCloseConfirmDialog: () => void;
}

export function MenuEditorModals({
  showCategoryModal,
  categories,
  selectedItem,
  anchorElement,
  onSelectCategory,
  onCloseCategoryModal,
  selectedItemForStats,
  menuId,
  onCloseStatsModal,
  onUpdatePrice,
  confirmDialog,
  onCloseConfirmDialog,
}: MenuEditorModalsProps) {
  return (
    <>
      <CategorySelectorModal
        isOpen={showCategoryModal}
        categories={categories}
        itemName={selectedItem?.name || ''}
        anchorElement={anchorElement}
        onSelectCategory={onSelectCategory}
        onClose={onCloseCategoryModal}
      />
      <MenuItemStatisticsModal
        isOpen={selectedItemForStats !== null}
        item={selectedItemForStats}
        menuId={menuId}
        onClose={onCloseStatsModal}
        onUpdatePrice={onUpdatePrice}
      />
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        onConfirm={confirmDialog.onConfirm}
        onCancel={onCloseConfirmDialog}
        variant={confirmDialog.variant || 'warning'}
      />
    </>
  );
}
