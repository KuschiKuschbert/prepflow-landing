import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { MenuChangeTracking } from '@/lib/menu-lock/change-tracking';
import { MenuItem } from '../../../types';
import CategorySelectorModal from '../../CategorySelectorModal';
import { MenuItemStatisticsModal } from '../../MenuItemStatisticsModal';
import { MenuUnlockChangesDialog } from '../../MenuUnlockChangesDialog';

interface MenuEditorModalsProps {
  showCategoryModal: boolean;
  categories: string[];
  selectedItem: { id: string; name: string; type: 'dish' | 'recipe' } | null;
  anchorElement: HTMLElement | null;
  handleCategorySelectWrapper: (category: string) => void;
  setShowCategoryModal: (show: boolean) => void;
  setSelectedItem: (item: { id: string; name: string; type: 'dish' | 'recipe' } | null) => void;
  setAnchorElement: (element: HTMLElement | null) => void;
  selectedItemForStats: MenuItem | null;
  setSelectedItemForStats: (item: MenuItem | null) => void;
  menuId: string;
  handleUpdateActualPrice: (itemId: string, price: number | null) => void;
  confirmDialog: {
    isOpen: boolean;
    title: string;
    message: string;
    variant: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
  };
  setConfirmDialog: React.Dispatch<
    React.SetStateAction<{
      isOpen: boolean;
      title: string;
      message: string;
      variant: 'danger' | 'warning' | 'info';
      onConfirm: () => void;
    }>
  >;
  unlockChanges: MenuChangeTracking[] | null;
  showUnlockDialog: boolean;
  handleRecalculatePrices: () => Promise<void>;
  handleDismissChanges: () => void;
  handleCloseUnlockDialog: () => void;
}

export function MenuEditorModals({
  showCategoryModal,
  categories,
  selectedItem,
  anchorElement,
  handleCategorySelectWrapper,
  setShowCategoryModal,
  setSelectedItem,
  setAnchorElement,
  selectedItemForStats,
  setSelectedItemForStats,
  menuId,
  handleUpdateActualPrice,
  confirmDialog,
  setConfirmDialog,
  unlockChanges,
  showUnlockDialog,
  handleRecalculatePrices,
  handleDismissChanges,
  handleCloseUnlockDialog,
}: MenuEditorModalsProps) {
  return (
    <>
      <CategorySelectorModal
        isOpen={showCategoryModal}
        categories={categories}
        itemName={selectedItem?.name || ''}
        anchorElement={anchorElement}
        onSelectCategory={handleCategorySelectWrapper}
        onClose={() => {
          setShowCategoryModal(false);
          setSelectedItem(null);
          setAnchorElement(null);
        }}
      />
      <MenuItemStatisticsModal
        isOpen={selectedItemForStats !== null}
        item={selectedItemForStats}
        menuId={menuId}
        onClose={() => setSelectedItemForStats(null)}
        onUpdatePrice={handleUpdateActualPrice}
      />
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        variant={confirmDialog.variant}
      />
      {unlockChanges && (
        <MenuUnlockChangesDialog
          isOpen={showUnlockDialog}
          menuId={menuId}
          changes={unlockChanges}
          onRecalculatePrices={handleRecalculatePrices}
          onDismiss={handleDismissChanges}
          onClose={handleCloseUnlockDialog}
        />
      )}
    </>
  );
}
