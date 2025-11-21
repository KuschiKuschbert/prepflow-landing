'use client';

import { useCallback, useRef, useEffect } from 'react';
import { Ingredient } from '../types';
import { useIngredientConversion } from './useIngredientConversion';
import { validateIngredientInput } from './helpers/ingredientValidation';
import { processIngredientAddition } from './helpers/ingredientProcessing';
import { logger } from '@/lib/logger';

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

      logger.dev('[useIngredientAddition] Attempting to add ingredient:', {
        ingredient_id: newIngredient.ingredient_id,
        quantity: newIngredient.quantity,
        unit: newIngredient.unit,
      });

      // Clear any previous errors
      setSaveError('');

      // Validate input
      if (!validateIngredientInput(newIngredient, setSaveError)) {
        logger.warn('[useIngredientAddition] Validation failed:', {
          ingredient_id: newIngredient.ingredient_id,
          quantity: newIngredient.quantity,
        });
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
          logger.error('[useIngredientAddition] Ingredient not found in list:', {
            ingredient_id: newIngredient.ingredient_id,
            availableIngredients: ingredients.length,
          });
          setSaveError('Ingredient not found. Please select an ingredient from the list.');
          return;
        }

        logger.dev('[useIngredientAddition] Processing ingredient addition:', {
          ingredient_name: selectedIngredientData.ingredient_name,
          quantity: newIngredient.quantity,
          unit: newIngredient.unit,
        });

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

        logger.dev('[useIngredientAddition] Ingredient added successfully');
      } catch (err) {
        logger.error('[useIngredientAddition] Error adding ingredient:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to add ingredient';
        setSaveError(`Failed to add ingredient: ${errorMessage}`);
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
