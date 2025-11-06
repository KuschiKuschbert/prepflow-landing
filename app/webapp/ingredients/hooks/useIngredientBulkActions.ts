// PrepFlow - Ingredient Bulk Actions Hook
// Extracted from useIngredientActions.ts to meet file size limits

'use client';

import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface Ingredient {
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

interface UseIngredientBulkActionsProps {
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
  setError: (error: string) => void;
  setSelectedIngredients?: React.Dispatch<React.SetStateAction<Set<string>>>;
  selectedIngredients?: Set<string>;
  filteredIngredients?: Ingredient[];
}

export function useIngredientBulkActions({
  setIngredients,
  setError,
  setSelectedIngredients,
  selectedIngredients,
  filteredIngredients,
}: UseIngredientBulkActionsProps) {
  const handleBulkDelete = useCallback(async () => {
    if (!selectedIngredients || selectedIngredients.size === 0) return;
    try {
      const { error } = await supabase
        .from('ingredients')
        .delete()
        .in('id', Array.from(selectedIngredients));

      if (error) throw error;
      setIngredients(prev => prev.filter(ing => !selectedIngredients.has(ing.id)));
      if (setSelectedIngredients) setSelectedIngredients(new Set());
    } catch (error) {
      setError('Failed to delete selected ingredients');
    }
  }, [selectedIngredients, setIngredients, setError, setSelectedIngredients]);

  const handleSelectIngredient = useCallback(
    (id: string, selected: boolean) => {
      if (!setSelectedIngredients) return;
      const newSelected = new Set<string>(selectedIngredients || new Set<string>());
      if (selected) {
        newSelected.add(id);
      } else {
        newSelected.delete(id);
      }
      setSelectedIngredients(newSelected);
    },
    [selectedIngredients, setSelectedIngredients],
  );

  const handleSelectAll = useCallback(
    (selected: boolean) => {
      if (!setSelectedIngredients || !filteredIngredients) return;
      if (selected) {
        setSelectedIngredients(new Set(filteredIngredients.map(ing => ing.id)));
      } else {
        setSelectedIngredients(new Set());
      }
    },
    [filteredIngredients, setSelectedIngredients],
  );

  return {
    handleBulkDelete,
    handleSelectIngredient,
    handleSelectAll,
  };
}
