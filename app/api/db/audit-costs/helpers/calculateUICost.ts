/**
 * Helper to calculate UI total cost for a dish.
 * Simulates useDishCOGSCalculations logic.
 */

import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import type { DishData } from './fetchDishData';

/**
 * Calculate UI total cost for a dish.
 * Matches the logic used in useDishCOGSCalculations hook.
 */
export async function calculateUICost(dishData: DishData): Promise<number> {
  if (!supabaseAdmin) {
    logger.error('[Audit Costs] Supabase admin client not available');
    return 0;
  }

  let uiTotalCost = 0;
  const dishRecipes = dishData.dish_recipes || [];

  // Calculate recipe costs for UI
  for (const dishRecipe of dishRecipes) {
    const recipeId = dishRecipe.recipe_id;
    const recipeQuantity = parseFloat(String(dishRecipe.quantity)) || 1;

    // Fetch recipe ingredients
    const { data: recipeIngredients, error: riError } = await supabaseAdmin
      .from('recipe_ingredients')
      .select(
        `
        quantity,
        unit,
        ingredients (
          id,
          ingredient_name,
          cost_per_unit,
          cost_per_unit_incl_trim,
          trim_peel_waste_percentage,
          yield_percentage,
          category
        )
      `,
      )
      .eq('recipe_id', recipeId);

    if (riError || !recipeIngredients) {
      logger.warn('[Audit Costs] Failed to fetch recipe ingredients:', {
        recipeId,
        error: riError?.message,
      });
      continue;
    }

    // Calculate UI cost for recipe ingredients (matching convertToCOGSCalculations logic)
    for (const ri of recipeIngredients) {
      const ingredient = ri.ingredients as any;
      if (!ingredient) continue;

      const baseCostPerUnit = ingredient.cost_per_unit_incl_trim || ingredient.cost_per_unit || 0;
      const ingredientQuantity = parseFloat(String(ri.quantity)) || 0;
      const isConsumable = ingredient.category === 'Consumables';
      const totalCost = ingredientQuantity * baseCostPerUnit;

      let yieldAdjustedCost = 0;
      if (isConsumable) {
        yieldAdjustedCost = totalCost;
      } else {
        const wastePercent = ingredient.trim_peel_waste_percentage || 0;
        const yieldPercent = ingredient.yield_percentage || 100;

        let wasteAdjustedCost = totalCost;
        if (!ingredient.cost_per_unit_incl_trim && wastePercent > 0) {
          wasteAdjustedCost = totalCost / (1 - wastePercent / 100);
        }
        yieldAdjustedCost = wasteAdjustedCost / (yieldPercent / 100);
      }

      // Scale by recipe quantity
      uiTotalCost += yieldAdjustedCost * recipeQuantity;
    }
  }

  // Calculate standalone ingredient costs for UI (same as API)
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

    uiTotalCost += ingredientCost;
  }

  return uiTotalCost;
}
