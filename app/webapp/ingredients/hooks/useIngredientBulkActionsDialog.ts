import { useState, useCallback } from 'react';
import { useIngredientBulkUpdateDialog } from './useIngredientBulkUpdateDialog';

interface UseIngredientBulkActionsDialogProps {
  selectedIngredients: Set<string>;
  onBulkDelete?: (ids: string[]) => Promise<void>;
  onBulkUpdate?: (ids: string[], updates: Partial<any>) => Promise<void>;
}

export function useIngredientBulkActionsDialog({
  selectedIngredients,
  onBulkDelete,
  onBulkUpdate,
}: UseIngredientBulkActionsDialogProps) {
  const [showBulkMenu, setShowBulkMenu] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const {
    bulkActionLoading,
    showInputDialog,
    setShowInputDialog,
    inputDialogConfig,
    handleBulkUpdateSupplier,
    handleBulkUpdateStorage,
    handleBulkUpdateWastage,
  } = useIngredientBulkUpdateDialog({
    selectedIngredients,
    onBulkUpdate,
  });

  const selectedCount = selectedIngredients.size;

  const handleBulkDelete = useCallback(() => {
    if (selectedCount === 0 || !onBulkDelete) return;
    setShowBulkMenu(false);
    setShowConfirmDialog(true);
  }, [selectedCount, onBulkDelete]);

  const confirmBulkDelete = useCallback(async () => {
    if (!onBulkDelete) return;
    setShowConfirmDialog(false);
    await onBulkDelete(Array.from(selectedIngredients));
  }, [onBulkDelete, selectedIngredients]);

  const handleDelete = useCallback((id: string) => {
    setDeleteConfirmId(id);
    setShowConfirmDialog(true);
  }, []);

  const confirmDelete = useCallback(
    async (onDelete: (id: string) => Promise<void>) => {
      if (!deleteConfirmId) return;
      setShowConfirmDialog(false);
      await onDelete(deleteConfirmId);
      setDeleteConfirmId(null);
    },
    [deleteConfirmId],
  );

  return {
    bulkActionLoading,
    showBulkMenu,
    setShowBulkMenu,
    showConfirmDialog,
    setShowConfirmDialog,
    showInputDialog,
    setShowInputDialog,
    inputDialogConfig,
    deleteConfirmId,
    setDeleteConfirmId,
    handleBulkDelete,
    confirmBulkDelete,
    handleBulkUpdateSupplier,
    handleBulkUpdateStorage,
    handleBulkUpdateWastage,
    handleDelete,
    confirmDelete,
  };
}
