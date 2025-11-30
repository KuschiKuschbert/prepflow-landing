'use client';
import { convertIngredientCost } from '@/lib/unit-conversion';
import { useCallback } from 'react';
import { COGSCalculation, Ingredient, RecipeIngredient } from '../types';
import { updateCalculation as updateCalculationUtil } from './utils/updateCalculation';
import { useOnCOGSCalculated } from '@/lib/personality/hooks';

interface UseCOGSCalculationLogicProps {
  ingredients: Ingredient[];
  setCalculations: React.Dispatch<React.SetStateAction<COGSCalculation[]>>;
}

export function useCOGSCalculationLogic({
  ingredients,
  setCalculations,
}: UseCOGSCalculationLogicProps) {
  const onCOGSCalculated = useOnCOGSCalculated();

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
          // Yield adjustment: divide by yield percentage (if 50% yield, need 2x raw ingredient)
          const yieldAdjustedCost = wasteAdjustedCost / (yieldPercent / 100);
          return { ...baseCalc, wasteAdjustedCost, yieldAdjustedCost, isConsumable: false };
        })
        .filter(Boolean) as COGSCalculation[];
      setCalculations(calculations);

      // Trigger personality hook when COGS is calculated
      if (calculations.length > 0) {
        onCOGSCalculated();
      }
    },
    [ingredients, setCalculations, onCOGSCalculated],
  );
  const updateCalculation = useCallback(
    (
      ingredientId: string,
      newQuantity: number,
      ingredients: Ingredient[],
      setCalculations: React.Dispatch<React.SetStateAction<COGSCalculation[]>>,
    ) => {
      updateCalculationUtil({ ingredientId, newQuantity, ingredients, setCalculations });
    },
    [],
  );
  return { calculateCOGS, updateCalculation };
}
