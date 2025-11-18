'use client';

import { normalizeIngredientData } from '@/lib/ingredients/normalizeIngredientDataMain';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { handleIngredientInsert } from './helpers/handleIngredientInsert';
import { handleIngredientInsertError, formatIngredientInsertError } from './helpers/errorHandling';
import { performOptimisticUpdate, replaceWithServerIngredient } from './helpers/optimisticUpdate';
import { formatIngredientErrorMessage } from './helpers/errorMessageFormatting';

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

        // Perform optimistic update
        const tempId = performOptimisticUpdate({
          normalized,
          originalIngredients,
          setIngredients,
          setShowAddForm,
          setWizardStep,
          setNewIngredient,
          DEFAULT_INGREDIENT: DEFAULT_INGREDIENT as unknown as Partial<T>,
        });

        // Insert ingredient (with API fallback)
        const { data, error } = await handleIngredientInsert(normalized, ingredientData);

        if (error) {
          handleIngredientInsertError(error, originalIngredients, setIngredients, setError, setShowAddForm);
          throw new Error(formatIngredientInsertError(error));
        }

        // Replace temp ingredient with real ingredient from server
        if (data) {
          replaceWithServerIngredient([], tempId, data as T, setIngredients);
        }

        await queryClient.invalidateQueries({ queryKey: ['ingredients'] });
      } catch (error: any) {
        // Revert optimistic update on error (if not already reverted)
        if (originalIngredients.length > 0) {
          setIngredients(originalIngredients);
        }
        // Reopen form on error
        if (setShowAddForm) setShowAddForm(true);
        setError(`Failed to add ingredient: ${formatIngredientErrorMessage(error)}`);
        throw error;
      }
    },
    [setIngredients, setError, setShowAddForm, setWizardStep, setNewIngredient, queryClient],
  );

  return { handleAddIngredient };
}
