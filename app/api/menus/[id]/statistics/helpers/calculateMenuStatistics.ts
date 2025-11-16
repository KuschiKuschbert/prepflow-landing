import { supabaseAdmin } from '@/lib/supabase';
import { calculateDishCost } from './calculateDishCost';
import { calculateRecipeCost } from './calculateRecipeCost';
import { calculateRecipeSellingPrice } from './calculateRecipeSellingPrice';

/**
 * Calculate menu statistics from menu items.
 *
 * @param {Array} menuItems - Menu items with dishes and recipes
 * @returns {Promise<Object>} Menu statistics
 */
export async function calculateMenuStatistics(menuItems: any[]) {
  let totalCOGS = 0;
  let totalRevenue = 0;
  const profitMargins: number[] = [];
  let dishCount = 0;
  let recipeCount = 0;

  for (const item of menuItems) {
    const dish = item.dishes as any;
    const recipe = item.recipes as any;

    // Handle dishes
    if (dish) {
      dishCount++;
      const sellingPrice = parseFloat(dish.selling_price) || 0;
      totalRevenue += sellingPrice;

      const dishCost = await calculateDishCost(dish.id);
      totalCOGS += dishCost;

      if (sellingPrice > 0) {
        const grossProfit = sellingPrice - dishCost;
        const margin = (grossProfit / sellingPrice) * 100;
        profitMargins.push(margin);
      }
    }

    // Handle recipes - treat them as dishes by calculating a selling price
    if (recipe) {
      recipeCount++;
      const recipeCost = await calculateRecipeCost(recipe.id, 1);
      totalCOGS += recipeCost;

      if (recipeCost > 0) {
        const finalPriceExclGST = await calculateRecipeSellingPrice(recipe.id);
        totalRevenue += finalPriceExclGST;

        // Calculate profit margin
        const grossProfit = finalPriceExclGST - recipeCost;
        const margin = finalPriceExclGST > 0 ? (grossProfit / finalPriceExclGST) * 100 : 0;
        profitMargins.push(margin);
      }
    }
  }

  const averageProfitMargin =
    profitMargins.length > 0
      ? profitMargins.reduce((sum, margin) => sum + margin, 0) / profitMargins.length
      : 0;
  const foodCostPercent = totalRevenue > 0 ? (totalCOGS / totalRevenue) * 100 : 0;
  const grossProfit = totalRevenue - totalCOGS;

  return {
    total_items: menuItems.length,
    total_dishes: dishCount,
    total_recipes: recipeCount,
    total_cogs: totalCOGS,
    total_revenue: totalRevenue,
    gross_profit: grossProfit,
    average_profit_margin: averageProfitMargin,
    food_cost_percent: foodCostPercent,
  };
}
