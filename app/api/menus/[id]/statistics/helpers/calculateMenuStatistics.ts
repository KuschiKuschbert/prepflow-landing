import { supabaseAdmin } from '@/lib/supabase';
import { calculateDishCost } from './calculateDishCost';
import { calculateRecipeCost } from './calculateRecipeCost';
import { calculateRecipeSellingPrice } from './calculateRecipeSellingPrice';
import { calculateDishSellingPrice } from './calculateDishSellingPrice';

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
      // Price priority: menu_items.actual_selling_price > dish.selling_price > calculated recommended
      const sellingPrice =
        item.actual_selling_price ??
        (dish.selling_price ? parseFloat(dish.selling_price) : null) ??
        (await calculateDishSellingPrice(dish.id));

      totalRevenue += sellingPrice;

      const dishCost = await calculateDishCost(dish.id);
      totalCOGS += dishCost;

      if (sellingPrice > 0) {
        const grossProfit = sellingPrice - dishCost;
        const margin = (grossProfit / sellingPrice) * 100;
        profitMargins.push(margin);
      }
    }

    // Handle recipes - use per-serving price
    if (recipe) {
      recipeCount++;
      const fullRecipeCost = await calculateRecipeCost(recipe.id, 1);
      const recipeYield = recipe.yield || 1;
      const recipeCostPerServing = recipeYield > 0 ? fullRecipeCost / recipeYield : fullRecipeCost;
      totalCOGS += recipeCostPerServing;

      // Price priority: menu_items.actual_selling_price > recipe.selling_price (per serving) > calculated recommended (per serving)
      const fullRecipeRecommendedPrice = await calculateRecipeSellingPrice(recipe.id);
      const recipeRecommendedPricePerServing =
        recipeYield > 0 ? fullRecipeRecommendedPrice / recipeYield : fullRecipeRecommendedPrice;

      const sellingPrice =
        item.actual_selling_price ??
        (recipe.selling_price ? parseFloat(recipe.selling_price) : null) ??
        recipeRecommendedPricePerServing;

      totalRevenue += sellingPrice;

      if (sellingPrice > 0) {
        const grossProfit = sellingPrice - recipeCostPerServing;
        const margin = (grossProfit / sellingPrice) * 100;
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
