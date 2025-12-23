/**
 * Helper to calculate API total cost for a dish.
 * Uses the same logic as /api/dishes/[id]/cost endpoint.
 */

import { logger } from '@/lib/logger';
import { calculateRecipeCost } from '@/app/api/menus/[id]/statistics/helpers/calculateRecipeCost';
import type { AuditResult } from '../types';
import type { DishData } from './fetchDishData';

/**
 * Calculate API total cost for a dish.
 */
export async function calculateAPICost(dishData: DishData, result: AuditResult): Promise<number> {
  let apiTotalCost = 0;

  // Calculate cost from recipes
  const dishRecipes = dishData.dish_recipes || [];
  for (const dishRecipe of dishRecipes) {
    const recipeId = dishRecipe.recipe_id;
    const recipeQuantity = parseFloat(String(dishRecipe.quantity)) || 1;
    const recipe = dishRecipe.recipes as any;

    try {
      const recipeCost = await calculateRecipeCost(recipeId, recipeQuantity);
      apiTotalCost += recipeCost;

      result.recipeBreakdown.push({
        recipeId,
        recipeName: recipe?.recipe_name || 'Unknown',
        recipeQuantity,
        recipeCost,
      });
    } catch (err) {
      logger.error('[Audit Costs] Failed to calculate recipe cost:', {
        error: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
        recipeId,
      });
      result.issues.push(
        `Failed to calculate recipe cost for ${recipeId}: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  // Calculate cost from standalone ingredients
  const dishIngredients = dishData.dish_ingredients || [];
  for (const di of dishIngredients) {
    const ingredient = di.ingredients as any;
    if (!ingredient) continue;

    const costPerUnit = ingredient.cost_per_unit_incl_trim || ingredient.cost_per_unit || 0;
    const quantity = parseFloat(String(di.quantity)) || 0;
    const isConsumable = ingredient.category === 'Consumables';

    let ingredientCost = 0;
    if (isConsumable) {
      ingredientCost = quantity * costPerUnit;
    } else {
      const wastePercent = ingredient.trim_peel_waste_percentage || 0;
      const yieldPercent = ingredient.yield_percentage || 100;

      let adjustedCost = quantity * costPerUnit;
      if (!ingredient.cost_per_unit_incl_trim && wastePercent > 0) {
        adjustedCost = adjustedCost / (1 - wastePercent / 100);
      }
      adjustedCost = adjustedCost / (yieldPercent / 100);
      ingredientCost = adjustedCost;
    }

    apiTotalCost += ingredientCost;

    result.standaloneIngredients.push({
      ingredientName: ingredient.ingredient_name || 'Unknown',
      quantity,
      unit: di.unit || 'g',
      cost: ingredientCost,
    });
  }

  return apiTotalCost;
}
