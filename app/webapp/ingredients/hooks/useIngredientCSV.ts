'use client';

import { useCallback } from 'react';
import { exportIngredientsToCSV } from './helpers/csvExport';
import { importIngredientsFromCSV } from './helpers/csvImport';

import { ExistingIngredient as Ingredient } from '../components/types';

interface UseIngredientCSVProps {
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
  setError: (error: string) => void;
  setShowCSVImport?: (show: boolean) => void;
  setCsvData?: (data: string) => void;
  setParsedIngredients?: (ingredients: Partial<Ingredient>[]) => void;
  filteredIngredients?: Ingredient[];
}

export function useIngredientCSV({
  setIngredients,
  setError,
  setShowCSVImport,
  setCsvData,
  setParsedIngredients,
  filteredIngredients,
}: UseIngredientCSVProps) {
  const exportToCSV = useCallback(() => {
    if (!filteredIngredients) return;
    exportIngredientsToCSV(filteredIngredients);
  }, [filteredIngredients]);

  const handleCSVImport = useCallback(
    async (parsedIngredients: Partial<Ingredient>[]) => {
      const result = await importIngredientsFromCSV(parsedIngredients);
      if (result.success && result.data) {
        setIngredients(prev => [...prev, ...(result.data as Ingredient[])]);
        setShowCSVImport?.(false);
        setCsvData?.('');
        setParsedIngredients?.([]);
        return true;
      } else {
        setError('Failed to import ingredients');
        return false;
      }
    },
    [setIngredients, setError, setShowCSVImport, setCsvData, setParsedIngredients],
  );
  return { exportToCSV, handleCSVImport };
}
