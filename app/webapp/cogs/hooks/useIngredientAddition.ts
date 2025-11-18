'use client';

import { useCallback, useRef, useEffect } from 'react';
import { Ingredient } from '../types';
import { useIngredientConversion } from './useIngredientConversion';
import { validateIngredientInput } from './helpers/ingredientValidation';
import { processIngredientAddition } from './helpers/ingredientProcessing';

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

      // Validate input
      if (!validateIngredientInput(newIngredient, setSaveError)) {
        return;
      }

      try {
        const currentCalculations = calculationsRef.current;
        const existingIngredient = currentCalculations.find(
          calc => calc.ingredientId === newIngredient.ingredient_id,
        );
        const selectedIngredientData = ingredients.find(
          ing => ing.id === newIngredient.ingredient_id,
        );
        if (!selectedIngredientData) {
          setSaveError('Ingredient not found');
          return;
        }

        processIngredientAddition({
          newIngredient: {
            ingredient_id: newIngredient.ingredient_id!,
            quantity: newIngredient.quantity!,
            unit: newIngredient.unit,
          },
          selectedIngredientData,
          selectedRecipe,
          convertIngredientQuantity,
          existingIngredient,
          currentCalculations,
          updateCalculation,
          addCalculation,
          resetForm,
        });
      } catch (err) {
        setSaveError('Failed to add ingredient');
      }
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
