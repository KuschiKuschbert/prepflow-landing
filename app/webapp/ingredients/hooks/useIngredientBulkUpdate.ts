import { useCallback } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { handleBulkUpdate as updateBulk } from './useIngredientBulkUpdate/helpers/handleBulkUpdate';
import { handleBulkAutoCategorize as categorizeBulk } from './useIngredientBulkUpdate/helpers/handleBulkAutoCategorize';
import { handleCategorizeAllUncategorized as categorizeAll } from './useIngredientBulkUpdate/helpers/handleCategorizeAll';

interface UseIngredientBulkUpdateProps {
  ingredients: any[];
  setIngredients: React.Dispatch<React.SetStateAction<any[]>>;
  setSelectedIngredients: React.Dispatch<React.SetStateAction<Set<string>>>;
  exitSelectionMode: () => void;
}

export function useIngredientBulkUpdate({
  ingredients,
  setIngredients,
  setSelectedIngredients,
  exitSelectionMode,
}: UseIngredientBulkUpdateProps) {
  const { showSuccess, showError } = useNotification();

  const handleBulkUpdate = useCallback(
    async (ids: string[], updates: Partial<any>) => {
      await updateBulk(ids, updates, {
        ingredients,
        setIngredients,
        setSelectedIngredients,
        exitSelectionMode,
        showSuccess,
        showError,
      });
    },
    [
      ingredients,
      setIngredients,
      setSelectedIngredients,
      exitSelectionMode,
      showSuccess,
      showError,
    ],
  );

  const handleBulkAutoCategorize = useCallback(
    async (ids: string[], useAI: boolean = true) => {
      await categorizeBulk(ids, useAI, {
        ingredients,
        setIngredients,
        setSelectedIngredients,
        exitSelectionMode,
        showSuccess,
        showError,
      });
    },
    [
      ingredients,
      setIngredients,
      setSelectedIngredients,
      exitSelectionMode,
      showSuccess,
      showError,
    ],
  );

  const handleCategorizeAllUncategorized = useCallback(
    async (useAI: boolean = true, onRefresh?: () => void) => {
      await categorizeAll(useAI, onRefresh, {
        setIngredients,
        showSuccess,
        showError,
      });
    },
    [setIngredients, showSuccess, showError],
  );

  return { handleBulkUpdate, handleBulkAutoCategorize, handleCategorizeAllUncategorized };
}
