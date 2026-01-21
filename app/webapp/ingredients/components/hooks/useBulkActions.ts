import { useAlert } from '@/hooks/useAlert';
import { useConfirm } from '@/hooks/useConfirm';
import { usePrompt } from '@/hooks/usePrompt';
import { logger } from '@/lib/logger';
import { useState } from 'react';

// Using a structural subset or we could import from types if we unify
export interface BulkActionIngredient {
  id: string;
  ingredient_name: string;
  [key: string]: any;
}

interface UseBulkActionsProps {
  selectedIngredients: Set<string>;
  onBulkDelete: (ids: string[]) => Promise<void>;
  onBulkUpdate: (ids: string[], updates: Record<string, any>) => Promise<void>;
  onComplete?: () => void;
}

export function useBulkActions({
  selectedIngredients,
  onBulkDelete,
  onBulkUpdate,
  onComplete,
}: UseBulkActionsProps) {
  const { showConfirm, ConfirmDialog } = useConfirm();
  const { showPrompt, InputDialog } = usePrompt();
  const { showAlert, AlertDialog } = useAlert();
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  const selectedCount = selectedIngredients.size;

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const executeBulkAction = async (
    actionName: string,
    action: () => Promise<void>,
    context?: any,
  ) => {
    setBulkActionLoading(true);
    try {
      await action();
    } catch (err) {
      logger.error(`[useBulkActions] Error in ${actionName}:`, {
        error: err instanceof Error ? err.message : String(err),
        selectedCount,
        ...context,
      });
    } finally {
      setBulkActionLoading(false);
      onComplete?.();
    }
  };
  /* eslint-enable @typescript-eslint/no-explicit-any */

  const handleBulkDelete = async () => {
    if (selectedCount === 0) return;

    const confirmed = await showConfirm({
      title: `Delete ${selectedCount} Ingredient${selectedCount > 1 ? 's' : ''}?`,
      message: `Delete ${selectedCount} ingredient${selectedCount > 1 ? 's' : ''}? This action can't be undone. Last chance to back out.`,
      variant: 'danger',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    });

    if (!confirmed) return;

    await executeBulkAction('bulk delete', async () => {
      await onBulkDelete(Array.from(selectedIngredients));
    });
  };

  const handleBulkUpdateSupplier = async () => {
    if (selectedCount === 0) return;

    const newSupplier = await showPrompt({
      title: 'Update Supplier',
      message: `What supplier should these ${selectedCount} ingredient${selectedCount > 1 ? 's' : ''} use?`,
      placeholder: 'Supplier name',
      type: 'text',
      validation: v => (v.trim().length > 0 ? null : 'Supplier name is required'),
    });

    if (!newSupplier?.trim()) return;

    await executeBulkAction(
      'bulk update supplier',
      async () => {
        await onBulkUpdate(Array.from(selectedIngredients), { supplier: newSupplier.trim() });
      },
      { supplier: newSupplier.trim() },
    );
  };

  const handleBulkUpdateStorage = async () => {
    if (selectedCount === 0) return;

    const newStorage = await showPrompt({
      title: 'Update Storage Location',
      message: `Where should these ${selectedCount} ingredient${selectedCount > 1 ? 's' : ''} be stored?`,
      placeholder: 'Storage location',
      type: 'text',
      validation: v => (v.trim().length > 0 ? null : 'Storage location is required'),
    });

    if (!newStorage?.trim()) return;

    await executeBulkAction(
      'bulk update storage',
      async () => {
        await onBulkUpdate(Array.from(selectedIngredients), {
          storage_location: newStorage.trim(),
        });
      },
      { storage: newStorage.trim() },
    );
  };

  const handleBulkUpdateWastage = async () => {
    if (selectedCount === 0) return;

    const wastageInput = await showPrompt({
      title: 'Update Wastage Percentage',
      message: `What wastage percentage (0-100) for these ${selectedCount} ingredient${selectedCount > 1 ? 's' : ''}?`,
      placeholder: '0-100',
      type: 'number',
      min: 0,
      max: 100,
      validation: v => {
        const num = parseFloat(v);
        if (isNaN(num) || num < 0 || num > 100) {
          return 'Please enter a valid percentage between 0 and 100';
        }
        return null;
      },
    });

    if (!wastageInput) return;

    const wastage = parseFloat(wastageInput);
    if (isNaN(wastage) || wastage < 0 || wastage > 100) {
      await showAlert({
        title: 'Invalid Percentage',
        message: "That's not a valid percentage. Give me something between 0 and 100, chef.",
        variant: 'warning',
      });
      return;
    }

    await executeBulkAction(
      'bulk update wastage',
      async () => {
        await onBulkUpdate(Array.from(selectedIngredients), {
          trim_peel_waste_percentage: wastage,
          yield_percentage: 100 - wastage,
        });
      },
      { wastage },
    );
  };

  return {
    bulkActionLoading,
    handleBulkDelete,
    handleBulkUpdateSupplier,
    handleBulkUpdateStorage,
    handleBulkUpdateWastage,
    ConfirmDialog,
    InputDialog,
    AlertDialog,
  };
}
