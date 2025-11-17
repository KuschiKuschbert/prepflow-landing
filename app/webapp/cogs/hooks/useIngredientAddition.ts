'use client';

import { useCallback, useRef, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { Ingredient } from '../types';
import { useIngredientConversion } from './useIngredientConversion';
import { createCalculation } from './utils/createCalculation';

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
      if (!newIngredient.ingredient_id) {
        setSaveError('Please select an ingredient');
        return;
      }
      if (!newIngredient.quantity || newIngredient.quantity <= 0) {
        setSaveError('Please enter a quantity greater than 0');
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
        const { convertedQuantity, convertedUnit, conversionNote } = convertIngredientQuantity(
          newIngredient.quantity!,
          newIngredient.unit || 'kg',
          selectedIngredientData.unit || 'kg',
        );
        if (existingIngredient) {
          const currentCalc = currentCalculations.find(
            calc => calc.ingredientId === newIngredient.ingredient_id,
          );
          if (currentCalc) {
            flushSync(() =>
              updateCalculation(
                newIngredient.ingredient_id!,
                currentCalc.quantity + convertedQuantity,
              ),
            );
            resetForm();
          }
          return;
        }
        const newCalc = createCalculation(
          newIngredient.ingredient_id!,
          selectedIngredientData,
          convertedQuantity,
          convertedUnit,
          conversionNote,
          selectedRecipe,
        );
        flushSync(() => {
          addCalculation(newCalc);
        });
        resetForm();
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
