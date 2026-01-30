/**
 * Calculate food cost for a dish.
 */
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import type { CostData } from '../../costs';
import { calculateFinancialMetrics } from './calculateFinancialMetrics';
import { fetchDishData, fetchDishIngredients, fetchDishRecipes } from './calculation/dish-data';
import { calculateIngredientsCost } from './calculation/ingredient-cost';
import { calculateRecipesCost } from './calculation/recipe-cost';

/**
 * Calculate food cost for a dish
 * Uses the same logic as the dish cost API endpoint
 */
export async function calculateDishFoodCost(dishId: string): Promise<CostData | null> {
  try {
    if (!supabaseAdmin) {
      logger.error('[Square Cost Sync] Database connection not available');
      return null;
    }

    // 1. Fetch Dish Data
    const dish = await fetchDishData(dishId);
    if (!dish) return null;

    // 2. Fetch Components
    const [dishRecipes, dishIngredients] = await Promise.all([
      fetchDishRecipes(dishId),
      fetchDishIngredients(dishId),
    ]);

    // 3. Calculate Costs
    let totalCost = 0;
    totalCost += calculateRecipesCost(dishRecipes);
    totalCost += calculateIngredientsCost(dishIngredients);

    // 4. Calculate Financial Metrics
    const sellingPrice = Number(dish.selling_price) || 0;
    const metrics = calculateFinancialMetrics(totalCost, sellingPrice);

    return {
      ...metrics,
      last_updated: new Date().toISOString(),
    };
  } catch (error: unknown) {
    logger.error('[Square Cost Sync] Error calculating dish cost:', {
      error: error instanceof Error ? error.message : String(error),
      dishId,
      stack: error instanceof Error ? error.stack : undefined,
    });
    return null;
  }
}
