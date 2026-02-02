/**
 * Helper to process standalone ingredients for COGS calculations.
 */

import { COGSCalculation } from '@/lib/types/cogs';
import { DishWithDetails } from '@/lib/types/recipes';
import { logger } from '@/lib/logger';

/**
 * Process standalone ingredients (not from recipes).
 */
export function processStandaloneIngredients(
  dishDetails: DishWithDetails,
  dishId: string,
): COGSCalculation[] {
  const ingredients = dishDetails.ingredients || [];
  logger.dev('[useDishCOGSCalculations] Processing standalone ingredients', {
    dishId,
    standaloneIngredientCount: ingredients.length,
  });

  const calculations: COGSCalculation[] = [];

  for (const dishIngredient of ingredients) {
    const ingredient = dishIngredient.ingredients;
    if (!ingredient) continue;

    const quantity =
      typeof dishIngredient.quantity === 'number'
        ? dishIngredient.quantity
        : parseFloat(String(dishIngredient.quantity)) || 0;
    const costPerUnit = ingredient.cost_per_unit_incl_trim || ingredient.cost_per_unit || 0;
    const totalCost = quantity * costPerUnit;
    const wastePercent = ingredient.trim_peel_waste_percentage || 0;
    const yieldPercent = ingredient.yield_percentage || 100;

    let wasteAdjustedCost = totalCost;
    if (!ingredient.cost_per_unit_incl_trim && wastePercent > 0) {
      wasteAdjustedCost = totalCost / (1 - wastePercent / 100);
    }

    const isConsumable = ingredient.category === 'Consumables';
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

    calculations.push({
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
      supplier_name: ingredient.supplier_name,
      category: ingredient.category,
    });
  }

  return calculations;
}
