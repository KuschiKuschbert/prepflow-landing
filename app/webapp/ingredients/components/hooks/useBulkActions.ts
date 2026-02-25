import { useNotification } from '@/contexts/NotificationContext';
import { useAlert } from '@/hooks/useAlert';
import { useConfirm } from '@/hooks/useConfirm';
import { usePrompt } from '@/hooks/usePrompt';
import { logger } from '@/lib/logger';
import { useCallback, useMemo, useState } from 'react';
import { createBulkHandlers } from '@/lib/ingredients/bulk-action-handlers';

export interface BulkActionIngredient {
  id: string;
  ingredient_name: string;
  [key: string]: unknown;
}

interface UseBulkActionsProps {
  selectedIngredients: Set<string>;
  onBulkDelete: (ids: string[]) => Promise<void>;
  onBulkUpdate: (ids: string[], updates: Record<string, unknown>) => Promise<void>;
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
  const { showSuccess } = useNotification();
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const selectedCount = selectedIngredients.size;

  const executeBulkAction = useCallback(
    async (actionName: string, action: () => Promise<void>, context?: Record<string, unknown>) => {
      setBulkActionLoading(true);
      try {
        await action();
        showSuccess(`${actionName} completed successfully`);
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
    },
    [showSuccess, selectedCount, onComplete],
  );

  const handlers = useMemo(
    () =>
      createBulkHandlers(
        selectedIngredients,
        selectedCount,
        onBulkDelete,
        onBulkUpdate as (ids: string[], u: Record<string, unknown>) => Promise<void>,
        showConfirm,
        showPrompt,
        showAlert,
        executeBulkAction,
      ),
    [
      selectedIngredients,
      selectedCount,
      onBulkDelete,
      onBulkUpdate,
      showConfirm,
      showPrompt,
      showAlert,
      executeBulkAction,
    ],
  );

  return {
    bulkActionLoading,
    ...handlers,
    ConfirmDialog,
    InputDialog,
    AlertDialog,
  };
}
