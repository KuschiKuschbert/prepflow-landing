import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { calculateRecipeCost } from '@/app/api/menus/[id]/statistics/helpers/calculateRecipeCost';

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const dishId = id;

    if (!dishId) {
      return NextResponse.json(
        ApiErrorHandler.createError('Dish ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Fetch dish
    const { data: dish, error: dishError } = await supabaseAdmin
      .from('dishes')
      .select('id, dish_name, selling_price')
      .eq('id', dishId)
      .single();

    if (dishError) {
      logger.error('[Dishes API] Database error fetching dish for cost calculation:', {
        error: dishError.message,
        code: (dishError as any).code,
        context: { endpoint: '/api/dishes/[id]/cost', operation: 'GET', dishId },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(dishError, 404);
      return NextResponse.json(apiError, { status: apiError.status || 404 });
    }

    if (!dish) {
      return NextResponse.json(
        ApiErrorHandler.createError('Dish not found', 'NOT_FOUND', 404, { dishId }),
        { status: 404 },
      );
    }

    let totalCost = 0;

    // Calculate cost from recipes (using helper function that applies waste/yield)
    const { data: dishRecipes, error: dishRecipesError } = await supabaseAdmin
      .from('dish_recipes')
      .select(
        `
        recipe_id,
        quantity,
        recipes (
          id,
          name
        )
      `,
      )
      .eq('dish_id', dishId);

    if (dishRecipesError) {
      logger.error('[Dishes API] Error fetching dish recipes:', {
        dishId,
        error: dishRecipesError,
      });
      // Continue with calculation, just log the error
    }

    if (dishRecipes && dishRecipes.length > 0) {
      for (const dishRecipe of dishRecipes) {
        try {
          // Use calculateRecipeCost helper which applies waste/yield adjustments
          const recipeQuantity = parseFloat(dishRecipe.quantity) || 1;
          const recipeCost = await calculateRecipeCost(dishRecipe.recipe_id, recipeQuantity);
          totalCost += recipeCost;
        } catch (err) {
          logger.error('[Dishes API] Error calculating recipe cost:', {
            dishId,
            recipeId: dishRecipe.recipe_id,
            error: err,
          });
          // Continue with other recipes instead of failing completely
        }
      }
    }

    // Calculate cost from standalone ingredients (apply waste/yield adjustments)
    const { data: dishIngredients, error: dishIngredientsError } = await supabaseAdmin
      .from('dish_ingredients')
      .select(
        `
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
      .eq('dish_id', dishId);

    if (dishIngredientsError) {
      logger.error('[Dishes API] Error fetching dish ingredients:', {
        dishId,
        error: dishIngredientsError,
      });
      // Continue with calculation, just log the error
    }

    if (dishIngredients) {
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
    }

    const sellingPrice = parseFloat(dish.selling_price) || 0;
    const grossProfit = sellingPrice - totalCost;
    const grossProfitMargin = sellingPrice > 0 ? (grossProfit / sellingPrice) * 100 : 0;
    const foodCostPercent = sellingPrice > 0 ? (totalCost / sellingPrice) * 100 : 0;

    return NextResponse.json({
      success: true,
      cost: {
        total_cost: totalCost,
        selling_price: sellingPrice,
        gross_profit: grossProfit,
        gross_profit_margin: grossProfitMargin,
        food_cost_percent: foodCostPercent,
      },
    });
  } catch (err) {
    logger.error('[Dishes API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/dishes/[id]/cost', method: 'GET' },
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
