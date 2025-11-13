'use client';

import { useNotification } from '@/contexts/NotificationContext';
import { useCallback } from 'react';

interface UseIngredientBulkUpdateProps {
  refetchIngredients: () => Promise<void>;
  setSelectedIngredients: React.Dispatch<React.SetStateAction<Set<string>>>;
  exitSelectionMode: () => void;
}

export function useIngredientBulkUpdate({
  refetchIngredients,
  setSelectedIngredients,
  exitSelectionMode,
}: UseIngredientBulkUpdateProps) {
  const { showSuccess, showError } = useNotification();

  const handleBulkUpdate = useCallback(
    async (ids: string[], updates: Record<string, unknown>) => {
      try {
        const response = await fetch('/api/ingredients/bulk-update', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids, updates }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to update ingredients');
        await refetchIngredients();
        setSelectedIngredients(new Set());
        exitSelectionMode();
        showSuccess(
          data.message ||
            `Successfully updated ${ids.length} ingredient${ids.length !== 1 ? 's' : ''}`,
        );
      } catch (error) {
        showError(error instanceof Error ? error.message : 'Failed to update ingredients');
        throw error;
      }
    },
    [refetchIngredients, setSelectedIngredients, exitSelectionMode, showSuccess, showError],
  );

  return { handleBulkUpdate };
}
