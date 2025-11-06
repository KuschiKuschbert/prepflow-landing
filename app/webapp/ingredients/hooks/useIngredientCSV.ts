'use client';

import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import {
  formatIngredientName,
  formatBrandName,
  formatSupplierName,
  formatStorageLocation,
  formatTextInput,
} from '@/lib/text-utils';

interface Ingredient {
  id: string;
  ingredient_name: string;
  brand?: string;
  pack_size?: string;
  pack_size_unit?: string;
  pack_price?: number;
  unit?: string;
  cost_per_unit: number;
  supplier?: string;
  product_code?: string;
  storage_location?: string;
  min_stock_level?: number;
  current_stock?: number;
}

interface UseIngredientCSVProps {
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
  setError: (error: string) => void;
  setShowCSVImport?: (show: boolean) => void;
  setCsvData?: (data: string) => void;
  setParsedIngredients?: (ingredients: Partial<Ingredient>[]) => void;
  filteredIngredients?: Ingredient[];
}

const CSV_HEADERS = [
  'Ingredient Name',
  'Brand',
  'Pack Size',
  'Pack Size Unit',
  'Pack Price',
  'Unit',
  'Cost Per Unit',
  'Supplier',
  'Product Code',
  'Storage Location',
  'Min Stock Level',
  'Current Stock',
];

function formatIngredientForCSV(ingredient: Ingredient): string {
  return [
    ingredient.ingredient_name,
    ingredient.brand || '',
    ingredient.pack_size || '',
    ingredient.pack_size_unit || '',
    ingredient.pack_price || 0,
    ingredient.unit || '',
    ingredient.cost_per_unit || 0,
    ingredient.supplier || '',
    ingredient.product_code || '',
    ingredient.storage_location || '',
    ingredient.min_stock_level || 0,
    ingredient.current_stock || 0,
  ].join(',');
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
    const csvContent = [
      CSV_HEADERS.join(','),
      ...filteredIngredients.map(formatIngredientForCSV),
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ingredients.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }, [filteredIngredients]);

  const handleCSVImport = useCallback(
    async (parsedIngredients: Partial<Ingredient>[]) => {
      try {
        const { data, error } = await supabase
          .from('ingredients')
          .insert(
            parsedIngredients.map(ingredient => ({
              ...ingredient,
              ingredient_name: formatIngredientName(ingredient.ingredient_name || ''),
              brand: ingredient.brand ? formatBrandName(ingredient.brand) : null,
              supplier: ingredient.supplier ? formatSupplierName(ingredient.supplier) : null,
              storage_location: ingredient.storage_location
                ? formatStorageLocation(ingredient.storage_location)
                : null,
              product_code: ingredient.product_code
                ? formatTextInput(ingredient.product_code)
                : null,
            })),
          )
          .select();
        if (error) throw error;
        setIngredients(prev => [...prev, ...(data || [])]);
        if (setShowCSVImport) setShowCSVImport(false);
        if (setCsvData) setCsvData('');
        if (setParsedIngredients) setParsedIngredients([]);
        return true;
      } catch (error) {
        setError('Failed to import ingredients');
        return false;
      }
    },
    [setIngredients, setError, setShowCSVImport, setCsvData, setParsedIngredients],
  );

  return { exportToCSV, handleCSVImport };
}
