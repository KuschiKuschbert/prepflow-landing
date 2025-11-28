import { logger } from '@/lib/logger';
import { useMemo } from 'react';
import { COGSCalculation } from '../../cogs/types';
import { Dish, DishWithDetails, RecipeIngredientWithDetails } from '../types';
import { convertToCOGSCalculations } from './utils/recipeCalculationHelpers';

export function useDishCOGSCalculations(
  dishDetails: DishWithDetails | null,
  recipeIngredientsMap: Record<string, RecipeIngredientWithDetails[]>,
  dish: Dish | null,
) {
  // Use dishDetails.id as fallback if dish is null
  const dishId = dish?.id || dishDetails?.id || '';

  const calculations: COGSCalculation[] = useMemo(() => {
    if (!dishDetails) return [];

    const allCalculations: COGSCalculation[] = [];
    const recipes = dishDetails.recipes || [];

    logger.dev('[useDishCOGSCalculations] Starting calculation', {
      dishId,
      dishName: dish?.dish_name || dishDetails?.dish_name,
      recipeCount: recipes.length,
      recipeIds: recipes.map(r => r.recipe_id),
      recipeIngredientsMapKeys: Object.keys(recipeIngredientsMap),
    });

    for (const dishRecipe of recipes) {
      const recipeId = dishRecipe.recipe_id;
      const recipeQuantity =
        typeof dishRecipe.quantity === 'number'
          ? dishRecipe.quantity
          : parseFloat(String(dishRecipe.quantity)) || 1;
      const recipeIngredients = recipeIngredientsMap[recipeId] || [];

      // Get recipe yield (default to 1 if not available)
      const recipeYield = (dishRecipe.recipes as any)?.yield || 1;

      logger.dev('[useDishCOGSCalculations] Processing recipe', {
        recipeId,
        recipeQuantity,
        recipeYield,
        ingredientCount: recipeIngredients.length,
        ingredientNames: recipeIngredients.map(ri => ri.ingredients?.ingredient_name || 'Unknown'),
      });

      const recipeCOGS = convertToCOGSCalculations(recipeIngredients, recipeId);

      recipeCOGS.forEach(calc => {
        // Divide by recipe yield to get per-serving, then multiply by recipeQuantity
        const perServingMultiplier = recipeQuantity / recipeYield;

        const scaledCalc: COGSCalculation = {
          recipeId: recipeId,
          ingredientId: calc.ingredientId || calc.ingredient_id || '',
          ingredientName: calc.ingredientName || calc.ingredient_name || '',
          quantity: calc.quantity * perServingMultiplier,
          unit: calc.unit,
          costPerUnit: calc.cost_per_unit || 0,
          totalCost: (calc.total_cost || 0) * perServingMultiplier,
          wasteAdjustedCost: calc.wasteAdjustedCost * perServingMultiplier,
          yieldAdjustedCost: calc.yieldAdjustedCost * perServingMultiplier,
          id: calc.id,
          ingredient_id: calc.ingredient_id,
          ingredient_name: calc.ingredient_name,
          cost_per_unit: calc.cost_per_unit,
          total_cost: (calc.total_cost || 0) * perServingMultiplier,
          supplier_name: calc.supplier_name,
          category: calc.category,
          isConsumable: calc.isConsumable,
        };

        logger.dev('[useDishCOGSCalculations] Recipe ingredient calculation', {
          recipeId,
          ingredientName: scaledCalc.ingredientName,
          baseQuantity: calc.quantity,
          recipeYield,
          recipeQuantity,
          perServingMultiplier,
          scaledQuantity: scaledCalc.quantity,
          baseYieldAdjustedCost: calc.yieldAdjustedCost,
          scaledYieldAdjustedCost: scaledCalc.yieldAdjustedCost,
        });

        allCalculations.push(scaledCalc);
      });
    }

    logger.dev('[useDishCOGSCalculations] Recipe ingredients processed', {
      dishId: dish?.id,
      recipeCalculationsCount: allCalculations.length,
    });
    const ingredients = dishDetails.ingredients || [];
    logger.dev('[useDishCOGSCalculations] Processing standalone ingredients', {
      dishId,
      standaloneIngredientCount: ingredients.length,
    });

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
      const wasteAdjustedCostFinal = isConsumable ? totalCost : wasteAdjustedCost;
      const yieldAdjustedCostFinal = isConsumable
        ? totalCost
        : wasteAdjustedCost / (yieldPercent / 100);

      logger.dev('[useDishCOGSCalculations] Standalone ingredient calculation', {
        dishId,
        ingredientName: ingredient.ingredient_name || 'Unknown',
        quantity,
        costPerUnit,
        totalCost,
        wastePercent,
        yieldPercent,
        wasteAdjustedCost: wasteAdjustedCostFinal,
        yieldAdjustedCost: yieldAdjustedCostFinal,
        isConsumable,
      });

      allCalculations.push({
        recipeId: dishId,
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

    const totalCOGS = allCalculations.reduce((sum, calc) => sum + calc.yieldAdjustedCost, 0);
    logger.dev('[useDishCOGSCalculations] Calculation complete', {
      dishId,
      dishName: dish?.dish_name || dishDetails?.dish_name,
      totalCalculations: allCalculations.length,
      recipeCalculations: allCalculations.filter(c => c.recipeId !== dishId && c.recipeId !== '')
        .length,
      standaloneCalculations: allCalculations.filter(
        c => c.recipeId === dishId || c.recipeId === '',
      ).length,
      totalCOGS,
      breakdown: allCalculations.map(c => ({
        name: c.ingredientName,
        yieldAdjustedCost: c.yieldAdjustedCost,
        recipeId: c.recipeId,
      })),
    });

    return allCalculations;
  }, [dishDetails, recipeIngredientsMap, dishId]);
  const totalCOGS = useMemo(
    () => calculations.reduce((sum, calc) => sum + calc.yieldAdjustedCost, 0),
    [calculations],
  );
  return { calculations, totalCOGS, costPerPortion: totalCOGS };
}
