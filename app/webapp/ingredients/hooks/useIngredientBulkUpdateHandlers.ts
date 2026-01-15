import { useCallback } from 'react';

interface Ingredient {
  id: string;
  ingredient_name: string;
  supplier?: string;
  storage_location?: string;
  trim_peel_waste_percentage?: number;
  yield_percentage?: number;
}

interface InputDialogConfig {
  title: string;
  message: string;
  placeholder: string;
  type: 'text' | 'number';
  min?: number;
  max?: number;
  onConfirm: (value: string) => Promise<void>;
}

interface CreateBulkUpdateHandlerParams {
  selectedCount: number;
  onBulkUpdate?: (ids: string[], updates: Partial<Ingredient>) => Promise<void>;
  selectedIngredients: Set<string>;
  setInputDialogConfig: (config: InputDialogConfig | null) => void;
  setShowInputDialog: (show: boolean) => void;
  setBulkActionLoading: (loading: boolean) => void;
}

export function useIngredientBulkUpdateHandlers({
  selectedCount,
  onBulkUpdate,
  selectedIngredients,
  setInputDialogConfig,
  setShowInputDialog,
  setBulkActionLoading,
}: CreateBulkUpdateHandlerParams) {
  const createBulkUpdateHandler = useCallback(
    (
      title: string,
      message: string,
      placeholder: string,
      type: 'text' | 'number',
      updateFn: (value: string) => Partial<Ingredient>,
      min?: number,
      max?: number,
    ) => {
      if (selectedCount === 0 || !onBulkUpdate) return () => {};
      return () => {
        setInputDialogConfig({
          title,
          message: `${message} ${selectedCount} ingredient${selectedCount > 1 ? 's' : ''}:`,
          placeholder,
          type,
          min,
          max,
          onConfirm: async (inputValue: string) => {
            if (type === 'text' && !inputValue.trim()) return;
            if (type === 'number') {
              const numValue = parseFloat(inputValue);
              if (
                isNaN(numValue) ||
                (min !== undefined && numValue < min) ||
                (max !== undefined && numValue > max)
              ) {
                return;
              }
            }
            setShowInputDialog(false);
            setInputDialogConfig(null);
            setBulkActionLoading(true);
            try {
              await onBulkUpdate(Array.from(selectedIngredients), updateFn(inputValue));
            } finally {
              setBulkActionLoading(false);
            }
          },
        });
        setShowInputDialog(true);
      };
    },
    [
      selectedCount,
      onBulkUpdate,
      selectedIngredients,
      setInputDialogConfig,
      setShowInputDialog,
      setBulkActionLoading,
    ],
  );

  return { createBulkUpdateHandler };
}
