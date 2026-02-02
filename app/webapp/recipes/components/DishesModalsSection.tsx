'use client';
import { Menu } from '@/lib/types/menu-builder';
import { Dish, Recipe } from '@/lib/types/recipes';
import { BulkAddToMenuDialog } from './BulkAddToMenuDialog';
import { UnifiedBulkDeleteConfirmationModal } from './UnifiedBulkDeleteConfirmationModal';

interface DishesModalsSectionProps {
  showMenuDialog: boolean;
  menus: Menu[];
  loadingMenus: boolean;
  showBulkDeleteConfirm: boolean;
  selectedItems: Set<string>;
  selectedItemTypes: Map<string, 'recipe' | 'dish'>;
  recipes: Recipe[];
  dishes: Dish[];
  capitalizeRecipeName: (name: string) => string;
  onCloseMenuDialog: () => void;
  onSelectMenu: (menuId: string) => void;
  onCreateNewMenu: () => void;
  onConfirmBulkDelete: () => void;
  onCancelBulkDelete: () => void;
}

export function DishesModalsSection({
  showMenuDialog,
  menus,
  loadingMenus,
  showBulkDeleteConfirm,
  selectedItems,
  selectedItemTypes,
  recipes,
  dishes,
  capitalizeRecipeName,
  onCloseMenuDialog,
  onSelectMenu,
  onCreateNewMenu,
  onConfirmBulkDelete,
  onCancelBulkDelete,
}: DishesModalsSectionProps) {
  return (
    <>
      <BulkAddToMenuDialog
        show={showMenuDialog}
        menus={menus}
        loadingMenus={loadingMenus}
        onClose={onCloseMenuDialog}
        onSelectMenu={onSelectMenu}
        onCreateNew={onCreateNewMenu}
      />
      <UnifiedBulkDeleteConfirmationModal
        show={showBulkDeleteConfirm}
        selectedItems={selectedItems}
        selectedItemTypes={selectedItemTypes}
        recipes={recipes}
        dishes={dishes}
        capitalizeRecipeName={capitalizeRecipeName}
        onConfirm={onConfirmBulkDelete}
        onCancel={onCancelBulkDelete}
      />
    </>
  );
}
