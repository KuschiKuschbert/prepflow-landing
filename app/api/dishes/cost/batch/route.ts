import { calculateRecipeCost } from '@/app/api/menus/[id]/statistics/helpers/calculateRecipeCost';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { calculateRecommendedPrice } from '../../helpers/calculateRecommendedPrice';

/**
 * Calculate cost and recommended price for multiple dishes in batch.
 * Accepts array of dish IDs and returns costs with recommended prices.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { dishIds } = body;

    if (!Array.isArray(dishIds) || dishIds.length === 0) {
      return NextResponse.json(
        ApiErrorHandler.createError('dishIds array is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Fetch all dishes in one query
    const { data: dishes, error: dishesError } = await supabaseAdmin
      .from('dishes')
      .select('id, dish_name, selling_price')
      .in('id', dishIds);

    if (dishesError) {
      logger.error('[Dishes API] Database error fetching dishes for batch cost calculation:', {
        error: dishesError.message,
        code: (dishesError as any).code,
        context: { endpoint: '/api/dishes/cost/batch', operation: 'POST' },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(dishesError, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    // Create a map of dish ID to dish data for quick lookup
    const dishesMap = new Map(dishes?.map(d => [d.id, d]) || []);

    // Fetch all dish_recipes in one query
    const { data: allDishRecipes, error: dishRecipesError } = await supabaseAdmin
      .from('dish_recipes')
      .select(
        `
        dish_id,
        recipe_id,
        quantity,
        recipes (
          id,
          name
        )
      `,
      )
      .in('dish_id', dishIds);

    if (dishRecipesError) {
      logger.error('[Dishes API] Error fetching dish recipes for batch:', {
        error: dishRecipesError,
      });
      // Continue with calculation, just log the error
    }

    // Group dish_recipes by dish_id
    const dishRecipesMap = new Map<string, typeof allDishRecipes>();
    (allDishRecipes || []).forEach(dr => {
      if (!dishRecipesMap.has(dr.dish_id)) {
        dishRecipesMap.set(dr.dish_id, []);
      }
      dishRecipesMap.get(dr.dish_id)!.push(dr);
    });

    // Fetch all dish_ingredients in one query
    const { data: allDishIngredients, error: dishIngredientsError } = await supabaseAdmin
      .from('dish_ingredients')
      .select(
        `
        dish_id,
        quantity,
        unit,
        ingredients (
          cost_per_unit,
          cost_per_unit_incl_trim,
          trim_peel_waste_percentage,
          yield_percentage,
          category
        )
      `,
      )
      .in('dish_id', dishIds);

    if (dishIngredientsError) {
      logger.error('[Dishes API] Error fetching dish ingredients for batch:', {
        error: dishIngredientsError,
      });
      // Continue with calculation, just log the error
    }

    // Group dish_ingredients by dish_id
    const dishIngredientsMap = new Map<string, typeof allDishIngredients>();
    (allDishIngredients || []).forEach(di => {
      if (!dishIngredientsMap.has(di.dish_id)) {
        dishIngredientsMap.set(di.dish_id, []);
      }
      dishIngredientsMap.get(di.dish_id)!.push(di);
    });

    // Calculate costs for all dishes in parallel
    const costPromises = dishIds.map(async (dishId: string) => {
      const dish = dishesMap.get(dishId);
      if (!dish) {
        logger.warn(`[Dishes API] Dish ${dishId} not found in batch`);
        return { dishId, cost: null };
      }

      let totalCost = 0;

      // Calculate cost from recipes
      const dishRecipes = dishRecipesMap.get(dishId) || [];
      for (const dishRecipe of dishRecipes) {
        try {
          const recipeQuantity = parseFloat(dishRecipe.quantity) || 1;
          const recipeCost = await calculateRecipeCost(dishRecipe.recipe_id, recipeQuantity);
          totalCost += recipeCost;
        } catch (err) {
          logger.error('[Dishes API] Error calculating recipe cost in batch:', {
            dishId,
            recipeId: dishRecipe.recipe_id,
            error: err,
          });
          // Continue with other recipes instead of failing completely
        }
      }

      // Calculate cost from standalone ingredients
      const dishIngredients = dishIngredientsMap.get(dishId) || [];
      for (const di of dishIngredients) {
        const ingredient = di.ingredients as any;
        if (ingredient) {
          const costPerUnit = ingredient.cost_per_unit_incl_trim || ingredient.cost_per_unit || 0;
          const quantity = parseFloat(di.quantity) || 0;
          const isConsumable = ingredient.category === 'Consumables';

          // For consumables: simple calculation (no waste/yield)
          if (isConsumable) {
            totalCost += quantity * costPerUnit;
            continue;
          }

          // For regular ingredients: apply waste/yield adjustments
          const wastePercent = ingredient.trim_peel_waste_percentage || 0;
          const yieldPercent = ingredient.yield_percentage || 100;

          let adjustedCost = quantity * costPerUnit;
          if (!ingredient.cost_per_unit_incl_trim && wastePercent > 0) {
            adjustedCost = adjustedCost / (1 - wastePercent / 100);
          }
          adjustedCost = adjustedCost / (yieldPercent / 100);

          totalCost += adjustedCost;
        }
      }

      const sellingPrice = parseFloat(dish.selling_price) || 0;
      const grossProfit = sellingPrice - totalCost;
      const grossProfitMargin = sellingPrice > 0 ? (grossProfit / sellingPrice) * 100 : 0;
      const foodCostPercent = sellingPrice > 0 ? (totalCost / sellingPrice) * 100 : 0;

      // Calculate contributing margin (Revenue excl GST - Food Cost)
      const gstRate = 0.1; // 10% GST for Australia
      const sellingPriceExclGST = sellingPrice / (1 + gstRate);
      const contributingMargin = sellingPriceExclGST - totalCost;
      const contributingMarginPercent =
        sellingPriceExclGST > 0 ? (contributingMargin / sellingPriceExclGST) * 100 : 0;

      // Calculate recommended price using same formula as recipes
      const recommendedPrice = calculateRecommendedPrice(totalCost);

      return {
        dishId,
        cost: {
          total_cost: totalCost,
          selling_price: sellingPrice,
          gross_profit: grossProfit,
          gross_profit_margin: grossProfitMargin,
          food_cost_percent: foodCostPercent,
          contributingMargin: contributingMargin,
          contributingMarginPercent: contributingMarginPercent,
          recommendedPrice: recommendedPrice,
        },
      };
    });

    const results = await Promise.all(costPromises);

    // Build response object with dish IDs as keys
    const costs: Record<string, any> = {};
    results.forEach(({ dishId, cost }) => {
      if (cost) {
        costs[dishId] = cost;
      }
    });

    return NextResponse.json({
      success: true,
      costs,
    });
  } catch (err) {
    logger.error('[Dishes API] Unexpected error in batch cost calculation:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/dishes/cost/batch', method: 'POST' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? err instanceof Error
            ? err.message
            : 'Unknown error'
          : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}
