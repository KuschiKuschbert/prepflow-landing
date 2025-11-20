'use client';
import { useCallback } from 'react';
import { convertIngredientCost } from '@/lib/unit-conversion';
import { COGSCalculation, Ingredient, RecipeIngredient } from '../types';

interface UseCOGSCalculationLogicProps {
  ingredients: Ingredient[];
  setCalculations: React.Dispatch<React.SetStateAction<COGSCalculation[]>>;
}

export function useCOGSCalculationLogic({
  ingredients,
  setCalculations,
}: UseCOGSCalculationLogicProps) {
  const calculateCOGS = useCallback(
    (recipeIngredients: RecipeIngredient[]) => {
      const calculations: COGSCalculation[] = recipeIngredients
        .map(ri => {
          const ingredient = ingredients.find(i => i.id === ri.ingredient_id);
          if (!ingredient) return null;
          const isConsumable = ingredient.category === 'Consumables';
          const baseCostPerUnit =
            ingredient.cost_per_unit_incl_trim || ingredient.cost_per_unit || 0;
          const costPerUnit = convertIngredientCost(
            baseCostPerUnit,
            ingredient.unit || 'g',
            ri.unit || 'g',
            ri.quantity,
          );
          const totalCost = ri.quantity * costPerUnit;
          const baseCalc = {
            recipeId: ri.recipe_id || 'temp',
            ingredientId: ri.ingredient_id,
            ingredientName: ingredient.ingredient_name,
            quantity: ri.quantity,
            unit: ri.unit || ingredient.unit || 'kg',
            costPerUnit,
            totalCost,
          };
          if (isConsumable) {
            return {
              ...baseCalc,
              wasteAdjustedCost: totalCost,
              yieldAdjustedCost: totalCost,
              isConsumable: true,
            };
          }
          const wastePercent = ingredient.trim_peel_waste_percentage || 0;
          const yieldPercent = ingredient.yield_percentage || 100;
          const wasteAdjustedCost =
            !ingredient.cost_per_unit_incl_trim && wastePercent > 0
              ? totalCost / (1 - wastePercent / 100)
              : totalCost;
          const yieldAdjustedCost = wasteAdjustedCost * (yieldPercent / 100);
          return { ...baseCalc, wasteAdjustedCost, yieldAdjustedCost, isConsumable: false };
        })
        .filter(Boolean) as COGSCalculation[];
      setCalculations(calculations);
    },
    [ingredients, setCalculations],
  );
  const updateCalculation = useCallback(
    (
      ingredientId: string,
      newQuantity: number,
      ingredients: Ingredient[],
      setCalculations: React.Dispatch<React.SetStateAction<COGSCalculation[]>>,
    ) => {
      setCalculations(prev =>
        prev.map(calc => {
          if (calc.ingredientId !== ingredientId) return calc;
          const ingredient = ingredients.find(ing => ing.id === ingredientId);
          if (!ingredient) return calc;
          const isConsumable = ingredient.category === 'Consumables';
          const newTotalCost = newQuantity * calc.costPerUnit;
          if (isConsumable) {
            return {
              ...calc,
              quantity: newQuantity,
              totalCost: newTotalCost,
              wasteAdjustedCost: newTotalCost,
              yieldAdjustedCost: newTotalCost,
            };
          }
          const wastePercent = ingredient.trim_peel_waste_percentage || 0;
          const yieldPercent = ingredient.yield_percentage || 100;
          const wasteAdj = newTotalCost * (1 + wastePercent / 100);
          return {
            ...calc,
            quantity: newQuantity,
            totalCost: newTotalCost,
            wasteAdjustedCost: wasteAdj,
            yieldAdjustedCost: wasteAdj / (yieldPercent / 100),
          };
        }),
      );
    },
    [],
  );

  return { calculateCOGS, updateCalculation };
}
