'use client';

import { useCallback, useRef, useEffect } from 'react';
import { Ingredient } from '../types';
import { useIngredientConversion } from './useIngredientConversion';
import { executeIngredientAddition } from './useIngredientAddition/helpers/executeIngredientAddition';

interface NewIngredient {
  ingredient_id?: string;
  quantity?: number;
  unit?: string;
}

interface UseIngredientAdditionProps {
  calculations: import('../types').COGSCalculation[];
  ingredients: Ingredient[];
  selectedRecipe: string | null;
  addCalculation: (calc: import('../types').COGSCalculation) => void;
  updateCalculation: (ingredientId: string, quantity: number) => void;
  resetForm: () => void;
  setSaveError: (error: string) => void;
}

export function useIngredientAddition({
  calculations,
  ingredients,
  selectedRecipe,
  addCalculation,
  updateCalculation,
  resetForm,
  setSaveError,
}: UseIngredientAdditionProps) {
  const { convertIngredientQuantity } = useIngredientConversion();
  const calculationsRef = useRef(calculations);
  useEffect(() => {
    calculationsRef.current = calculations;
  }, [calculations]);

  const handleAddIngredient = useCallback(
    async (newIngredient: NewIngredient, e?: React.FormEvent) => {
      if (e) e.preventDefault();

      executeIngredientAddition({
        newIngredient,
        ingredients,
        selectedRecipe,
        currentCalculations: calculationsRef.current,
        convertIngredientQuantity,
        updateCalculation,
        addCalculation,
        resetForm,
        setSaveError,
      });
    },
    [
      ingredients,
      selectedRecipe,
      addCalculation,
      updateCalculation,
      resetForm,
      setSaveError,
      convertIngredientQuantity,
    ],
  );

  return { handleAddIngredient };
}
