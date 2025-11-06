'use client';

import { useCallback } from 'react';
import { COGSCalculation, Ingredient } from '../types';
import { useIngredientConversion } from './useIngredientConversion';

interface NewIngredient {
  ingredient_id?: string;
  quantity?: number;
  unit?: string;
}

interface UseIngredientAdditionProps {
  calculations: COGSCalculation[];
  ingredients: Ingredient[];
  selectedRecipe: string | null;
  addCalculation: (calc: COGSCalculation) => void;
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
  const handleAddIngredient = useCallback(
    async (newIngredient: NewIngredient, e?: React.FormEvent) => {
      if (e) e.preventDefault();
      if (!newIngredient.ingredient_id || !newIngredient.quantity) {
        setSaveError('Please select an ingredient and enter a quantity');
        return;
      }
      try {
        const existingIngredient = calculations.find(
          calc => calc.ingredientId === newIngredient.ingredient_id,
        );
        const selectedIngredientData = ingredients.find(
          ing => ing.id === newIngredient.ingredient_id,
        );
        if (!selectedIngredientData) {
          setSaveError('Ingredient not found');
          return;
        }
        if (existingIngredient) {
          const { convertedQuantity } = convertIngredientQuantity(
            newIngredient.quantity!,
            newIngredient.unit || 'kg',
            selectedIngredientData.unit || 'kg',
          );
          const currentCalc = calculations.find(
            calc => calc.ingredientId === newIngredient.ingredient_id,
          );
          if (currentCalc) {
            updateCalculation(
              newIngredient.ingredient_id!,
              currentCalc.quantity + convertedQuantity,
            );
          }
        } else {
          const { convertedQuantity, convertedUnit, conversionNote } = convertIngredientQuantity(
            newIngredient.quantity!,
            newIngredient.unit || 'kg',
            selectedIngredientData.unit || 'kg',
          );
          const baseCostPerUnit =
            selectedIngredientData.cost_per_unit_incl_trim ||
            selectedIngredientData.cost_per_unit ||
            0;
          const totalCost = convertedQuantity * baseCostPerUnit;
          const wastePercent = selectedIngredientData.trim_peel_waste_percentage || 0;
          const yieldPercent = selectedIngredientData.yield_percentage || 100;
          addCalculation({
            recipeId: selectedRecipe || 'temp',
            ingredientId: newIngredient.ingredient_id!,
            ingredientName: selectedIngredientData.ingredient_name + conversionNote,
            quantity: convertedQuantity,
            unit: convertedUnit,
            costPerUnit: baseCostPerUnit,
            totalCost,
            wasteAdjustedCost: totalCost * (1 + wastePercent / 100),
            yieldAdjustedCost: (totalCost * (1 + wastePercent / 100)) / (yieldPercent / 100),
            ingredient_id: newIngredient.ingredient_id!,
            ingredient_name: selectedIngredientData.ingredient_name + conversionNote,
            cost_per_unit: baseCostPerUnit,
            total_cost: totalCost,
          });
        }
        resetForm();
      } catch (err) {
        setSaveError('Failed to add ingredient');
      }
    },
    [
      calculations,
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
