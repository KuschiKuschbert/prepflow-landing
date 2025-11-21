import { logger } from '@/lib/logger';
import { calculateDishCost } from './calculateDishCost';
import { calculateDishSellingPrice } from './calculateDishSellingPrice';
import { calculateRecipeCost } from './calculateRecipeCost';
import { calculateRecipeSellingPrice } from './calculateRecipeSellingPrice';

/**
 * Calculate menu statistics from menu items.
 *
 * @param {Array} menuItems - Menu items with dishes and recipes
 * @returns {Promise<Object>} Menu statistics
 */
export async function calculateMenuStatistics(menuItems: any[]) {
  logger.dev('[calculateMenuStatistics] Starting calculation', { itemCount: menuItems.length });
  let totalCOGS = 0;
  let totalRevenue = 0;
  const profitMargins: number[] = [];
  let dishCount = 0;
  let recipeCount = 0;

  for (const item of menuItems) {
    // Supabase may return dishes/recipes as arrays or single objects
    const dish = Array.isArray(item.dishes) ? item.dishes[0] : (item.dishes as any);
    const recipe = Array.isArray(item.recipes) ? item.recipes[0] : (item.recipes as any);

    logger.dev('[calculateMenuStatistics] Processing item:', {
      dish_id: item.dish_id,
      recipe_id: item.recipe_id,
      has_dish: !!dish,
      has_recipe: !!recipe,
      dish_data: dish
        ? { id: dish.id, name: dish.dish_name, selling_price: dish.selling_price }
        : null,
      recipe_data: recipe
        ? {
            id: recipe.id,
            name: recipe.name,
            yield: recipe.yield,
            selling_price: recipe.selling_price,
          }
        : null,
      actual_selling_price: item.actual_selling_price,
    });

    // Handle dishes
    if (dish) {
      dishCount++;
      try {
        // Price priority: menu_items.actual_selling_price > dish.selling_price > calculated recommended
        let sellingPrice =
          item.actual_selling_price ?? (dish.selling_price ? parseFloat(dish.selling_price) : null);

        // Calculate recommended price if needed (with error handling)
        if (sellingPrice == null) {
          try {
            sellingPrice = await calculateDishSellingPrice(dish.id);
          } catch (err) {
            logger.error('[calculateMenuStatistics] Error calculating dish selling price:', {
              dish_id: dish.id,
              error: err,
            });
            // Continue without selling price - will skip revenue calculation
          }
        }

        // Calculate COGS (with error handling)
        let dishCost = 0;
        try {
          dishCost = await calculateDishCost(dish.id);
        } catch (err) {
          logger.error('[calculateMenuStatistics] Error calculating dish cost:', {
            dish_id: dish.id,
            error: err,
          });
          // Continue with 0 COGS - will still calculate other statistics
        }

        totalCOGS += dishCost || 0;

        // Only add to revenue and calculate margin if we have a valid selling price
        if (sellingPrice != null && sellingPrice > 0 && !isNaN(sellingPrice)) {
          totalRevenue += sellingPrice;
          const grossProfit = sellingPrice - dishCost;
          const margin = (grossProfit / sellingPrice) * 100;
          profitMargins.push(margin);
          logger.dev('[calculateMenuStatistics] Dish processed:', {
            dish_id: dish.id,
            sellingPrice,
            dishCost,
            grossProfit,
            margin,
          });
        } else {
          logger.warn('[calculateMenuStatistics] Dish skipped - invalid selling price:', {
            dish_id: dish.id,
            sellingPrice,
            dishCost,
          });
        }
      } catch (err) {
        logger.error('[calculateMenuStatistics] Unexpected error processing dish:', {
          dish_id: dish.id,
          error: err,
        });
        // Continue processing other items instead of failing completely
      }
    }

    // Handle recipes - use per-serving price
    if (recipe) {
      recipeCount++;
      try {
        // Calculate COGS (with error handling)
        let fullRecipeCost = 0;
        try {
          fullRecipeCost = await calculateRecipeCost(recipe.id, 1);
        } catch (err) {
          logger.error('[calculateMenuStatistics] Error calculating recipe cost:', {
            recipe_id: recipe.id,
            error: err,
          });
          // Continue with 0 COGS - will still calculate other statistics
        }

        const recipeYield = recipe.yield || 1;
        const recipeCostPerServing =
          recipeYield > 0 ? fullRecipeCost / recipeYield : fullRecipeCost;
        totalCOGS += recipeCostPerServing || 0;

        // Price priority: menu_items.actual_selling_price > recipe.selling_price (per serving) > calculated recommended (per serving)
        let sellingPrice =
          item.actual_selling_price ??
          (recipe.selling_price ? parseFloat(recipe.selling_price) : null);

        // Calculate recommended price if needed (with error handling)
        if (sellingPrice == null) {
          try {
            const fullRecipeRecommendedPrice = await calculateRecipeSellingPrice(recipe.id);
            const recipeRecommendedPricePerServing =
              recipeYield > 0
                ? fullRecipeRecommendedPrice / recipeYield
                : fullRecipeRecommendedPrice;
            sellingPrice = recipeRecommendedPricePerServing;
          } catch (err) {
            logger.error('[calculateMenuStatistics] Error calculating recipe selling price:', {
              recipe_id: recipe.id,
              error: err,
            });
            // Continue without selling price - will skip revenue calculation
          }
        }

        // Only add to revenue and calculate margin if we have a valid selling price
        if (sellingPrice != null && sellingPrice > 0 && !isNaN(sellingPrice)) {
          totalRevenue += sellingPrice;
          const grossProfit = sellingPrice - recipeCostPerServing;
          const margin = (grossProfit / sellingPrice) * 100;
          profitMargins.push(margin);
          logger.dev('[calculateMenuStatistics] Recipe processed:', {
            recipe_id: recipe.id,
            sellingPrice,
            recipeCostPerServing,
            grossProfit,
            margin,
          });
        } else {
          logger.warn('[calculateMenuStatistics] Recipe skipped - invalid selling price:', {
            recipe_id: recipe.id,
            sellingPrice,
            recipeCostPerServing,
          });
        }
      } catch (err) {
        logger.error('[calculateMenuStatistics] Unexpected error processing recipe:', {
          recipe_id: recipe.id,
          error: err,
        });
        // Continue processing other items instead of failing completely
      }
    }
  }

  logger.dev('[calculateMenuStatistics] Calculation complete:', {
    totalCOGS,
    totalRevenue,
    profitMarginsCount: profitMargins.length,
    dishCount,
    recipeCount,
  });

  // Calculate statistics with safety checks to prevent NaN/Infinity
  const averageProfitMargin =
    profitMargins.length > 0
      ? profitMargins.reduce(
          (sum, margin) => sum + (isNaN(margin) || !isFinite(margin) ? 0 : margin),
          0,
        ) / profitMargins.length
      : 0;

  const foodCostPercent =
    totalRevenue > 0 && isFinite(totalRevenue) && isFinite(totalCOGS)
      ? (totalCOGS / totalRevenue) * 100
      : 0;

  const grossProfit = isFinite(totalRevenue) && isFinite(totalCOGS) ? totalRevenue - totalCOGS : 0;

  // Ensure all values are finite numbers
  const safeAverageProfitMargin =
    isNaN(averageProfitMargin) || !isFinite(averageProfitMargin) ? 0 : averageProfitMargin;
  const safeFoodCostPercent =
    isNaN(foodCostPercent) || !isFinite(foodCostPercent) ? 0 : foodCostPercent;
  const safeGrossProfit = isNaN(grossProfit) || !isFinite(grossProfit) ? 0 : grossProfit;
  const safeTotalCOGS = isNaN(totalCOGS) || !isFinite(totalCOGS) ? 0 : totalCOGS;
  const safeTotalRevenue = isNaN(totalRevenue) || !isFinite(totalRevenue) ? 0 : totalRevenue;

  return {
    total_items: menuItems.length,
    total_dishes: dishCount,
    total_recipes: recipeCount,
    total_cogs: safeTotalCOGS,
    total_revenue: safeTotalRevenue,
    gross_profit: safeGrossProfit,
    average_profit_margin: safeAverageProfitMargin,
    food_cost_percent: safeFoodCostPercent,
  };
}
