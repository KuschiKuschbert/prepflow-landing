'use client';

import { useOnIngredientAdded } from '@/lib/personality/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { addIngredient, rollbackIngredientAdd } from './useIngredientAdd/addIngredient';

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
  const onIngredientAdded = useOnIngredientAdded();

  const handleAddIngredient = useCallback(
    async (ingredientData: Partial<T>) => {
      const originalIngredients: T[] = [];
      try {
        const _result = await addIngredient({
          ingredientData,
          originalIngredients,
          setIngredients,
          setError,
          setShowAddForm,
          setWizardStep,
          setNewIngredient,
          DEFAULT_INGREDIENT: DEFAULT_INGREDIENT as unknown as Partial<T>,
        });
        onIngredientAdded();
        await queryClient.invalidateQueries({ queryKey: ['ingredients'] });
      } catch (error: unknown) {
        rollbackIngredientAdd(originalIngredients, setIngredients, setShowAddForm, error, setError);
        throw error;
      }
    },
    [
      setIngredients,
      setError,
      setShowAddForm,
      setWizardStep,
      setNewIngredient,
      queryClient,
      onIngredientAdded,
    ],
  );

  return { handleAddIngredient };
}
