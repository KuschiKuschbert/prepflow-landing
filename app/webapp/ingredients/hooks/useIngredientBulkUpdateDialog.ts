import { useState, useCallback } from 'react';
import { useIngredientBulkUpdateHandlers } from './useIngredientBulkUpdateHandlers';

interface Ingredient {
  id: string;
  ingredient_name: string;
  supplier?: string;
  storage_location?: string;
  trim_peel_waste_percentage?: number;
  yield_percentage?: number;
}

type InputDialogConfig = {
  title: string;
  message: string;
  placeholder?: string;
  type?: 'text' | 'number';
  min?: number;
  max?: number;
  onConfirm: (value: string) => void;
};

export function useIngredientBulkUpdateDialog({
  selectedIngredients,
  onBulkUpdate,
}: {
  selectedIngredients: Set<string>;
  onBulkUpdate?: (ids: string[], updates: Partial<Ingredient>) => Promise<void>;
}) {
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [showInputDialog, setShowInputDialog] = useState(false);
  const [inputDialogConfig, setInputDialogConfig] = useState<InputDialogConfig | null>(null);

  const selectedCount = selectedIngredients.size;

  const { createBulkUpdateHandler } = useIngredientBulkUpdateHandlers({
    selectedCount,
    onBulkUpdate,
    selectedIngredients,
    setInputDialogConfig,
    setShowInputDialog,
    setBulkActionLoading,
  });

  const handleBulkUpdateSupplier = useCallback(
    () =>
      createBulkUpdateHandler(
        'Update Supplier',
        'Enter new supplier for',
        'Supplier name',
        'text',
        (value: string) => ({ supplier: value.trim() }),
      )(),
    [createBulkUpdateHandler],
  );

  const handleBulkUpdateStorage = useCallback(
    () =>
      createBulkUpdateHandler(
        'Update Storage Location',
        'Enter new storage location for',
        'Storage location',
        'text',
        (value: string) => ({ storage_location: value.trim() }),
      )(),
    [createBulkUpdateHandler],
  );

  const handleBulkUpdateWastage = useCallback(() => {
    const wastageFn = (value: string) => {
      const wastage = parseFloat(value);
      return { trim_peel_waste_percentage: wastage, yield_percentage: 100 - wastage };
    };
    return createBulkUpdateHandler(
      'Update Wastage Percentage',
      'Enter wastage percentage (0-100) for',
      '0-100',
      'number',
      wastageFn,
      0,
      100,
    )();
  }, [createBulkUpdateHandler]);

  return {
    bulkActionLoading,
    showInputDialog,
    setShowInputDialog,
    inputDialogConfig,
    handleBulkUpdateSupplier,
    handleBulkUpdateStorage,
    handleBulkUpdateWastage,
  };
}
