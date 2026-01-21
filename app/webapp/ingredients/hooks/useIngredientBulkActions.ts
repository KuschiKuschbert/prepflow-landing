// PrepFlow - Ingredient Bulk Actions Hook
// Extracted from useIngredientActions.ts to meet file size limits

'use client';

import { logger } from '@/lib/logger';
import { supabase } from '@/lib/supabase';
import { useCallback } from 'react';

import { ExistingIngredient as Ingredient } from '../components/types';

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
      logger.error('[useIngredientBulkActions.ts] Error in catch block:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

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
