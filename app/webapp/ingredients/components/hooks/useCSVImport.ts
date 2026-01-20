import { parseIngredientsCSV } from '@/app/webapp/ingredients/hooks/helpers/csvImport';
import { logger } from '@/lib/logger';
import { useState } from 'react';

export interface Ingredient {
  id: string;
  ingredient_name: string;
  brand?: string;
  pack_size?: string;
  pack_size_unit?: string;
  pack_price?: number;
  unit?: string;
  cost_per_unit: number;
  cost_per_unit_as_purchased?: number;
  cost_per_unit_incl_trim?: number;
  trim_peel_waste_percentage?: number;
  yield_percentage?: number;
  supplier?: string;
  product_code?: string;
  storage_location?: string;
  min_stock_level?: number;
  current_stock?: number;
  created_at?: string;
  updated_at?: string;
}

interface UseCSVImportProps {
  onImport: (ingredients: Partial<Ingredient>[]) => Promise<void>;
  onClose: () => void;
}

export function useCSVImport({ onImport, onClose }: UseCSVImportProps) {
  const [csvData, setCsvData] = useState<string>('');
  const [parsedIngredients, setParsedIngredients] = useState<Partial<Ingredient>[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const parseCSVWithAI = (csvText: string) => {
    try {
      if (!csvText || csvText.trim().length === 0) {
        setError('CSV file is empty');
        setParsedIngredients([]);
        return;
      }

      const result = parseIngredientsCSV(csvText);

      if (result.errors.length > 0) {
        setError(
          `CSV parsing errors:\n${result.errors.slice(0, 5).join('\n')}${result.errors.length > 5 ? `\n... and ${result.errors.length - 5} more errors` : ''}`,
        );
      } else {
        setError(null);
      }

      if (result.ingredients.length === 0) {
        setError('No valid ingredients found in CSV file');
        setParsedIngredients([]);
        return;
      }

      setParsedIngredients(result.ingredients);
    } catch (err) {
      logger.error('[CSV Import Modal] Failed to parse CSV:', err);
      setError(err instanceof Error ? err.message : 'Failed to parse CSV file');
      setParsedIngredients([]);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      const csvText = e.target?.result as string;
      setCsvData(csvText);
      parseCSVWithAI(csvText);
    };
    reader.readAsText(file);
  };

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
      setCsvData('');
      setParsedIngredients([]);
      setSelectedIngredients(new Set());
      setError(null);
    } catch (err) {
      logger.error('Failed to import ingredients:', err);
    }
  };

  const handleClose = () => {
    setCsvData('');
    setParsedIngredients([]);
    setSelectedIngredients(new Set());
    setError(null);
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
