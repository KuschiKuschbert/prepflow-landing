import { useNotification } from '@/contexts/NotificationContext';
import { useCallback } from 'react';
import { handleBulkAutoCategorize as categorizeBulk } from './useIngredientBulkUpdate/helpers/handleBulkAutoCategorize';
import { handleBulkUpdate as updateBulk } from './useIngredientBulkUpdate/helpers/handleBulkUpdate';
import { handleCategorizeAllUncategorized as categorizeAll } from './useIngredientBulkUpdate/helpers/handleCategorizeAll';

interface UseIngredientBulkUpdateProps<T> {
  ingredients: T[];
  setIngredients: React.Dispatch<React.SetStateAction<T[]>>;
  setSelectedIngredients: React.Dispatch<React.SetStateAction<Set<string>>>;
  exitSelectionMode: () => void;
}

export function useIngredientBulkUpdate<
  T extends { id: string; category?: string; is_active?: boolean },
>({
  ingredients,
  setIngredients,
  setSelectedIngredients,
  exitSelectionMode,
}: UseIngredientBulkUpdateProps<T>) {
  const { showSuccess, showError } = useNotification();

  const handleBulkUpdate = useCallback(
    async (ids: string[], updates: Partial<T>) => {
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
        ingredients,
        setIngredients,
        showSuccess,
        showError,
      });
    },
    [ingredients, setIngredients, showSuccess, showError],
  );

  return { handleBulkUpdate, handleBulkAutoCategorize, handleCategorizeAllUncategorized };
}
