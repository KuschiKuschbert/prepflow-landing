'use client';

import { normalizeIngredientData } from '@/lib/ingredients/normalizeIngredientDataMain';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { logger } from '@/lib/logger';
interface UseIngredientAddProps<
  T extends { id: string; ingredient_name: string; cost_per_unit: number },
> {
  setIngredients: React.Dispatch<React.SetStateAction<T[]>>;
  setError: (error: string) => void;
  setShowAddForm?: (show: boolean) => void;
  setWizardStep?: (step: number) => void;
  setNewIngredient?: (ingredient: Partial<T>) => void;
}

const DEFAULT_INGREDIENT = {
  ingredient_name: '',
  brand: '',
  pack_size: '',
  pack_size_unit: 'g',
  pack_price: 0,
  unit: 'g',
  cost_per_unit: 0,
  supplier: '',
  product_code: '',
  storage_location: '',
  min_stock_level: 0,
  current_stock: 0,
};

export function useIngredientAdd<
  T extends { id: string; ingredient_name: string; cost_per_unit: number },
>({
  setIngredients,
  setError,
  setShowAddForm,
  setWizardStep,
  setNewIngredient,
}: UseIngredientAddProps<T>) {
  const queryClient = useQueryClient();

  const handleAddIngredient = useCallback(
    async (ingredientData: Partial<T>) => {
      // Store original state for rollback
      let originalIngredients: T[] = [];

      try {
        const { normalized, error: normalizeError } = normalizeIngredientData(ingredientData);
        if (normalizeError) {
          setError(normalizeError);
          throw new Error(normalizeError);
        }

        // Create temporary ingredient for optimistic update
        const tempId = `temp-${Date.now()}`;
        const tempIngredient = { ...normalized, id: tempId } as T;

        // Optimistically add to UI immediately
        setIngredients(prev => {
          originalIngredients = [...prev];
          return [...prev, tempIngredient];
        });

        // Close form optimistically
        if (setShowAddForm) setShowAddForm(false);
        if (setWizardStep) setWizardStep(1);
        if (setNewIngredient) setNewIngredient(DEFAULT_INGREDIENT as unknown as Partial<T>);

        const { data, error } = await supabase.from('ingredients').insert([normalized]).select();

        if (error) {
          if (error.code === '42501' || error.message?.includes('row-level security')) {
            logger.warn('RLS policy blocked direct insert, falling back to API route');
            const response = await fetch('/api/ingredients', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(ingredientData),
            });

            const result = await response.json();
            if (!response.ok || !result.success) {
              // Revert optimistic update on error
              setIngredients(originalIngredients);
              // Reopen form on error
              if (setShowAddForm) setShowAddForm(true);
              const errorMsg = result.details || result.error || 'Failed to add ingredient';
              setError(`Failed to add ingredient: ${errorMsg}`);
              throw new Error(errorMsg);
            }

            // Replace temp ingredient with real ingredient from server
            if (result.data) {
              setIngredients(prev => prev.map(ing => (ing.id === tempId ? result.data : ing)));
            }
          } else {
            // Revert optimistic update on error
            setIngredients(originalIngredients);
            // Reopen form on error
            if (setShowAddForm) setShowAddForm(true);
            logger.error('Supabase error inserting ingredient:', error);
            throw error;
          }
        } else {
          // Replace temp ingredient with real ingredient from server
          if (data && data.length > 0) {
            setIngredients(prev => prev.map(ing => (ing.id === tempId ? data[0] : ing)));
          }
        }

        await queryClient.invalidateQueries({ queryKey: ['ingredients'] });
      } catch (error: any) {
        // Revert optimistic update on error (if not already reverted)
        if (originalIngredients.length > 0) {
          setIngredients(originalIngredients);
        }
        // Reopen form on error
        if (setShowAddForm) setShowAddForm(true);
        const msg =
          error?.message ||
          (error?.code
            ? `Database error (${error.code})${error?.details ? `: ${error.details}` : ''}${error?.hint ? ` Hint: ${error.hint}` : ''}`
            : error?.details || 'Failed to add ingredient');
        setError(`Failed to add ingredient: ${msg}`);
        throw error;
      }
    },
    [setIngredients, setError, setShowAddForm, setWizardStep, setNewIngredient, queryClient],
  );

  return { handleAddIngredient };
}
