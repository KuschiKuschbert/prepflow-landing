'use client';

import { useCallback } from 'react';
import { convertUnit } from '@/lib/unit-conversion';
import { Ingredient, COGSCalculation } from '../types';

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
  const volumeUnits = [
    'tsp',
    'teaspoon',
    'tbsp',
    'tablespoon',
    'cup',
    'cups',
    'ml',
    'milliliter',
    'l',
    'liter',
    'litre',
    'fl oz',
    'fluid ounce',
  ];

  const weightUnits = [
    'g',
    'gm',
    'gram',
    'grams',
    'kg',
    'kilogram',
    'oz',
    'ounce',
    'lb',
    'pound',
    'mg',
    'milligram',
  ];

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

        if (existingIngredient) {
          const selectedIngredientData = ingredients.find(
            ing => ing.id === newIngredient.ingredient_id,
          );
          if (selectedIngredientData) {
            let convertedQuantity = newIngredient.quantity!;
            const userUnit = (newIngredient.unit || 'kg').toLowerCase().trim();
            const ingredientUnit = (selectedIngredientData.unit || 'kg').toLowerCase().trim();

            const isUserVolume = volumeUnits.includes(userUnit);
            const isUserWeight = weightUnits.includes(userUnit);
            const isIngredientVolume = volumeUnits.includes(ingredientUnit);
            const isIngredientWeight = weightUnits.includes(ingredientUnit);

            if ((isUserVolume && isIngredientWeight) || (isUserWeight && isIngredientVolume)) {
              const conversionResult = convertUnit(
                newIngredient.quantity!,
                newIngredient.unit || 'kg',
                selectedIngredientData.unit || 'kg',
              );
              convertedQuantity = newIngredient.quantity! * conversionResult.value;
            }

            const currentCalc = calculations.find(
              calc => calc.ingredientId === newIngredient.ingredient_id,
            );
            if (currentCalc) {
              const newQuantity = currentCalc.quantity + convertedQuantity;
              updateCalculation(newIngredient.ingredient_id!, newQuantity);
            }
          }
        } else {
          const selectedIngredientData = ingredients.find(
            ing => ing.id === newIngredient.ingredient_id,
          );
          if (selectedIngredientData) {
            let convertedQuantity = newIngredient.quantity!;
            let convertedUnit = newIngredient.unit || 'kg';
            let conversionNote = '';

            const userUnit = (newIngredient.unit || 'kg').toLowerCase().trim();
            const ingredientUnit = (selectedIngredientData.unit || 'kg').toLowerCase().trim();

            const isUserVolume = volumeUnits.includes(userUnit);
            const isUserWeight = weightUnits.includes(userUnit);
            const isIngredientVolume = volumeUnits.includes(ingredientUnit);
            const isIngredientWeight = weightUnits.includes(ingredientUnit);

            if ((isUserVolume && isIngredientWeight) || (isUserWeight && isIngredientVolume)) {
              const conversionResult = convertUnit(
                newIngredient.quantity!,
                newIngredient.unit || 'kg',
                selectedIngredientData.unit || 'kg',
              );
              convertedQuantity = newIngredient.quantity! * conversionResult.value;
              convertedUnit = selectedIngredientData.unit || 'kg';
              conversionNote = ` (converted from ${newIngredient.quantity} ${newIngredient.unit || 'kg'})`;
            }

            const baseCostPerUnit =
              selectedIngredientData.cost_per_unit_incl_trim ||
              selectedIngredientData.cost_per_unit ||
              0;
            const costPerUnit = baseCostPerUnit;
            const totalCost = convertedQuantity * costPerUnit;

            const wastePercent = selectedIngredientData.trim_peel_waste_percentage || 0;
            const yieldPercent = selectedIngredientData.yield_percentage || 100;
            const wasteAdjustedCost = totalCost * (1 + wastePercent / 100);
            const yieldAdjustedCost = wasteAdjustedCost / (yieldPercent / 100);

            const newCalculation: COGSCalculation = {
              recipeId: selectedRecipe || 'temp',
              ingredientId: newIngredient.ingredient_id!,
              ingredientName: selectedIngredientData.ingredient_name + conversionNote,
              quantity: convertedQuantity,
              unit: convertedUnit,
              costPerUnit: costPerUnit,
              totalCost: totalCost,
              wasteAdjustedCost: wasteAdjustedCost,
              yieldAdjustedCost: yieldAdjustedCost,
              // Legacy compatibility
              ingredient_id: newIngredient.ingredient_id!,
              ingredient_name: selectedIngredientData.ingredient_name + conversionNote,
              cost_per_unit: costPerUnit,
              total_cost: totalCost,
            };

            addCalculation(newCalculation);
          }
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
    ],
  );

  return { handleAddIngredient };
}
