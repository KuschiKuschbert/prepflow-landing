'use client';
import { SelectionModeBanner } from './SelectionModeBanner';
import { UnifiedBulkActionsMenu } from './UnifiedBulkActionsMenu';

interface DishesBulkActionsSectionProps {
  isSelectionMode: boolean;
  selectedCount: number;
  selectedRecipeCount: number;
  bulkActionLoading: boolean;
  bulkShareLoading: boolean;
  addToMenuLoading: boolean;
  showBulkMenu: boolean;
  onExitSelectionMode: () => void;
  onBulkDelete: () => void;
  onBulkShare: () => void;
  onBulkAddToMenu: () => void;
  onToggleBulkMenu: () => void;
}

export function DishesBulkActionsSection({
  isSelectionMode,
  selectedCount,
  selectedRecipeCount,
  bulkActionLoading,
  bulkShareLoading,
  addToMenuLoading,
  showBulkMenu,
  onExitSelectionMode,
  onBulkDelete,
  onBulkShare,
  onBulkAddToMenu,
  onToggleBulkMenu,
}: DishesBulkActionsSectionProps) {
  return (
    <>
      <SelectionModeBanner
        isSelectionMode={isSelectionMode}
        selectedCount={selectedCount}
        onExitSelectionMode={onExitSelectionMode}
      />
      {isSelectionMode && selectedCount > 0 && (
        <div className="mb-4 flex items-center justify-between">
          <UnifiedBulkActionsMenu
            selectedCount={selectedCount}
            selectedRecipeCount={selectedRecipeCount}
            bulkActionLoading={bulkActionLoading || bulkShareLoading || addToMenuLoading}
            onBulkDelete={onBulkDelete}
            onBulkShare={onBulkShare}
            onBulkAddToMenu={onBulkAddToMenu}
            showBulkMenu={showBulkMenu}
            onToggleBulkMenu={onToggleBulkMenu}
          />
        </div>
      )}
    </>
  );
}
