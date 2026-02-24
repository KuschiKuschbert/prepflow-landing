import { logger } from '@/lib/logger';
import { useState } from 'react';
import { useCSVParser } from './useCSVParser';
import type { Ingredient } from './csv-import-types';

export type { Ingredient } from './csv-import-types';

interface UseCSVImportProps {
  onImport: (ingredients: Partial<Ingredient>[]) => Promise<void>;
  onClose: () => void;
}

export function useCSVImport({ onImport, onClose }: UseCSVImportProps) {
  const {
    csvData,
    setCsvData,
    parsedIngredients,
    setParsedIngredients,
    error,
    setError,
    handleFileUpload,
    resetParser,
  } = useCSVParser();

  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(new Set());

  const handleSelectIngredient = (index: string, selected: boolean) => {
    const newSelected = new Set(selectedIngredients);
    if (selected) {
      newSelected.add(index);
    } else {
      newSelected.delete(index);
    }
    setSelectedIngredients(newSelected);
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedIngredients(new Set(parsedIngredients.map((_, i) => i.toString())));
    } else {
      setSelectedIngredients(new Set());
    }
  };

  const handleImport = async () => {
    try {
      const ingredientsToImport = parsedIngredients.filter((_, index) =>
        selectedIngredients.has(index.toString()),
      );

      await onImport(ingredientsToImport);

      // Reset state
      resetParser();
      setSelectedIngredients(new Set());
    } catch (err) {
      logger.error('Failed to import ingredients:', err);
    }
  };

  const handleClose = () => {
    resetParser();
    setSelectedIngredients(new Set());
    onClose();
  };

  const formatCost = (cost: number): string => {
    if (cost < 1) {
      return cost.toFixed(3);
    } else if (cost < 10) {
      return cost.toFixed(2);
    } else {
      return cost.toFixed(2);
    }
  };

  const getDisplayCost = (ingredient: Partial<Ingredient>) => {
    const cost = ingredient.cost_per_unit || 0;
    const unit = ingredient.unit || '';
    const formattedCost = formatCost(cost);

    let packInfo = '';
    if (ingredient.pack_price && ingredient.pack_size && ingredient.pack_size_unit) {
      packInfo = `Pack: $${ingredient.pack_price} for ${ingredient.pack_size}${ingredient.pack_size_unit}`;
    }

    return { cost, unit, formattedCost, packInfo };
  };

  return {
    csvData,
    parsedIngredients,
    selectedIngredients,
    error,
    handleFileUpload,
    handleSelectIngredient,
    handleSelectAll,
    handleImport,
    handleClose,
    getDisplayCost,
  };
}
