/**
 * Hook for handling dish save operations.
 */

import { useState } from 'react';
import { logger } from '@/lib/logger';
import { useNotification } from '@/contexts/NotificationContext';
import { useOnRecipeCreated, useOnDishCreated } from '@/lib/personality/hooks';

interface UseSaveHandlerProps {
  dishState: {
    dishName: string;
    itemType: 'dish' | 'recipe';
  };
  saveDish: () => Promise<{ success: boolean; error?: string }>;
  setError: (error: string) => void;
  onSaveSuccess?: () => void;
}

export function useSaveHandler({
  dishState,
  saveDish,
  setError,
  onSaveSuccess,
}: UseSaveHandlerProps) {
  const [saving, setSaving] = useState(false);
  const { showSuccess, showError } = useNotification();
  const onRecipeCreated = useOnRecipeCreated();
  const onDishCreated = useOnDishCreated();

  const handleSave = async () => {
    if (saving) return; // Prevent double-clicks

    setSaving(true);
    try {
      const result = await saveDish();
      if (result.success) {
        const itemType = dishState.itemType === 'dish' ? 'Dish' : 'Recipe';
        showSuccess(`${itemType} "${dishState.dishName}" saved successfully!`);

        // Trigger personality hooks
        if (dishState.itemType === 'recipe') {
          onRecipeCreated();
        } else {
          onDishCreated();
        }

        // Notify parent after a delay
        setTimeout(() => {
          if (onSaveSuccess) {
            onSaveSuccess();
          }
        }, 2000);
      } else {
        // Error is already set by saveDish via setError
        showError(`Failed to save ${dishState.itemType}`);
      }
    } catch (err) {
      logger.error('[DishBuilderClient] Error in handleSave:', err);
      const errorMessage =
        err instanceof Error ? err.message : `Failed to save ${dishState.itemType}`;
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return { saving, handleSave };
}
