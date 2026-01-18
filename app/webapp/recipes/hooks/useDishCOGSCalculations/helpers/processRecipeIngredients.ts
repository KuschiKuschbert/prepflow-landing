/**
 * Helper to process recipe ingredients for COGS calculations.
 */

import { COGSCalculation } from '@/app/webapp/cogs/types';
import { DishRecipe, RecipeIngredientWithDetails } from '@/app/webapp/recipes/types';
import { logger } from '@/lib/logger';
import { convertToCOGSCalculations } from '../../utils/recipeCalculationHelpers';

/**
 * Process recipe ingredients and scale by recipe yield and quantity.
 */
export function processRecipeIngredients(
  dishRecipe: DishRecipe,
  recipeIngredients: RecipeIngredientWithDetails[],
  _dishId: string,
): COGSCalculation[] {
  const recipeId = dishRecipe.recipe_id;
  const recipeQuantity =
    typeof dishRecipe.quantity === 'number'
      ? dishRecipe.quantity
      : parseFloat(String(dishRecipe.quantity)) || 1;
  const recipeYield = dishRecipe.recipes?.yield || 1;

  logger.dev('[useDishCOGSCalculations] Processing recipe', {
    recipeId,
    recipeQuantity,
    recipeYield,
    ingredientCount: recipeIngredients.length,
    ingredientNames: recipeIngredients.map(ri => ri.ingredients?.ingredient_name || 'Unknown'),
  });

  const recipeCOGS = convertToCOGSCalculations(recipeIngredients, recipeId);
  const scaledCalculations: COGSCalculation[] = [];

  recipeCOGS.forEach(calc => {
    // Divide by recipe yield to get per-serving, then multiply by recipeQuantity
    const perServingMultiplier = recipeQuantity / recipeYield;

    // Type assertion: convertToCOGSCalculations returns COGSCalculation with camelCase properties
    const calcTyped = calc as COGSCalculation;

    const scaledCalc: COGSCalculation = {
      recipeId: recipeId,
      ingredientId: calcTyped.ingredientId || calcTyped.ingredient_id || '',
      ingredientName: calcTyped.ingredientName || calcTyped.ingredient_name || '',
      quantity: calcTyped.quantity * perServingMultiplier,
      unit: calcTyped.unit,
      costPerUnit: calcTyped.costPerUnit * perServingMultiplier,
      totalCost: calcTyped.totalCost * perServingMultiplier,
      wasteAdjustedCost: calcTyped.wasteAdjustedCost * perServingMultiplier,
      yieldAdjustedCost: calcTyped.yieldAdjustedCost * perServingMultiplier,
      isConsumable: calcTyped.isConsumable ?? calcTyped.category === 'Consumables',
      id: calcTyped.id,
      ingredient_id: calcTyped.ingredient_id,
      ingredient_name: calcTyped.ingredient_name,
      cost_per_unit: calcTyped.cost_per_unit,
      total_cost: (calcTyped.total_cost || calcTyped.totalCost) * perServingMultiplier,
      supplier_name: calcTyped.supplier_name,
      category: calcTyped.category,
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

    scaledCalculations.push(scaledCalc);
  });

  return scaledCalculations;
}
