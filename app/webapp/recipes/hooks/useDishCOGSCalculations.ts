import { useMemo } from 'react';
import { Dish, DishWithDetails, RecipeIngredientWithDetails } from '../types';
import { convertToCOGSCalculations } from './utils/recipeCalculationHelpers';
import { COGSCalculation } from '../../cogs/types';

export function useDishCOGSCalculations(
  dishDetails: DishWithDetails | null,
  recipeIngredientsMap: Record<string, RecipeIngredientWithDetails[]>,
  dish: Dish | null,
) {
  const calculations: COGSCalculation[] = useMemo(() => {
    if (!dishDetails) return [];

    const allCalculations: COGSCalculation[] = [];
    const recipes = dishDetails.recipes || [];

    for (const dishRecipe of recipes) {
      const recipeId = dishRecipe.recipe_id;
      const recipeQuantity =
        typeof dishRecipe.quantity === 'number'
          ? dishRecipe.quantity
          : parseFloat(String(dishRecipe.quantity)) || 1;
      const recipeIngredients = recipeIngredientsMap[recipeId] || [];
      const recipeCOGS = convertToCOGSCalculations(recipeIngredients, recipeId);

      recipeCOGS.forEach(calc => {
        const scaledCalc: COGSCalculation = {
          recipeId: recipeId,
          ingredientId: calc.ingredientId || calc.ingredient_id || '',
          ingredientName: calc.ingredientName || calc.ingredient_name || '',
          quantity: calc.quantity * recipeQuantity,
          unit: calc.unit,
          costPerUnit: calc.cost_per_unit || 0,
          totalCost: (calc.total_cost || 0) * recipeQuantity,
          wasteAdjustedCost: calc.yieldAdjustedCost * recipeQuantity,
          yieldAdjustedCost: calc.yieldAdjustedCost * recipeQuantity,
          id: calc.id,
          ingredient_id: calc.ingredient_id,
          ingredient_name: calc.ingredient_name,
          cost_per_unit: calc.cost_per_unit,
          total_cost: (calc.total_cost || 0) * recipeQuantity,
          supplier_name: calc.supplier_name,
          category: calc.category,
        };
        allCalculations.push(scaledCalc);
      });
    }

    const ingredients = dishDetails.ingredients || [];
    for (const dishIngredient of ingredients) {
      const ingredient = dishIngredient.ingredients;
      if (!ingredient) continue;

      const quantity =
        typeof dishIngredient.quantity === 'number'
          ? dishIngredient.quantity
          : parseFloat(String(dishIngredient.quantity)) || 0;
      const costPerUnit =
        (ingredient as any).cost_per_unit_incl_trim || ingredient.cost_per_unit || 0;
      const totalCost = quantity * costPerUnit;
      const wastePercent = (ingredient as any).trim_peel_waste_percentage || 0;
      const yieldPercent = (ingredient as any).yield_percentage || 100;

      let wasteAdjustedCost = totalCost;
      if (!(ingredient as any).cost_per_unit_incl_trim && wastePercent > 0) {
        wasteAdjustedCost = totalCost / (1 - wastePercent / 100);
      }

      const isConsumable = (ingredient as any).category === 'Consumables';

      // For consumables: simple calculation (no waste/yield)
      let wasteAdjustedCostFinal = wasteAdjustedCost;
      let yieldAdjustedCostFinal: number;
      if (isConsumable) {
        wasteAdjustedCostFinal = totalCost;
        yieldAdjustedCostFinal = totalCost;
      } else {
        yieldAdjustedCostFinal = wasteAdjustedCost / (yieldPercent / 100);
      }

      allCalculations.push({
        recipeId: dish?.id || '',
        ingredientId: ingredient.id,
        ingredientName: ingredient.ingredient_name || 'Unknown',
        quantity: quantity,
        unit: dishIngredient.unit || 'g',
        costPerUnit: costPerUnit,
        totalCost: totalCost,
        wasteAdjustedCost: wasteAdjustedCostFinal,
        yieldAdjustedCost: yieldAdjustedCostFinal,
        isConsumable: isConsumable,
        id: dishIngredient.id,
        ingredient_id: ingredient.id,
        ingredient_name: ingredient.ingredient_name || 'Unknown',
        cost_per_unit: costPerUnit,
        total_cost: totalCost,
        supplier_name: (ingredient as any).supplier_name,
        category: (ingredient as any).category,
      });
    }

    return allCalculations;
  }, [dishDetails, recipeIngredientsMap, dish?.id]);

  const totalCOGS = useMemo(
    () => calculations.reduce((sum, calc) => sum + calc.yieldAdjustedCost, 0),
    [calculations],
  );
  const costPerPortion = useMemo(() => totalCOGS, [totalCOGS]);

  return { calculations, totalCOGS, costPerPortion };
}
