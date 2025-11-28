import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { calculateDishCost } from './helpers/calculateDishCost';
import { fetchDishes } from './helpers/fetchDishes';
import { fetchDishIngredients } from './helpers/fetchDishIngredients';
import { fetchDishRecipes } from './helpers/fetchDishRecipes';
import { validateRequest } from './helpers/validateRequest';

/**
 * Calculate cost and recommended price for multiple dishes in batch.
 * Accepts array of dish IDs and returns costs with recommended prices.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validateRequest(body);
    if ('error' in validation) {
      return validation.error;
    }
    const { dishIds } = validation;

    // Fetch all data in parallel
    const [dishesResult, dishRecipesMap, dishIngredientsMap] = await Promise.all([
      fetchDishes(dishIds),
      fetchDishRecipes(dishIds),
      fetchDishIngredients(dishIds),
    ]);

    if ('error' in dishesResult) {
      return dishesResult.error;
    }
    const { dishesMap } = dishesResult;

    // Calculate costs for all dishes in parallel
    const costPromises = dishIds.map(async (dishId: string) => {
      const dish = dishesMap.get(dishId);
      const dishRecipes = dishRecipesMap.get(dishId) || [];
      const dishIngredients = dishIngredientsMap.get(dishId) || [];

      return calculateDishCost(dishId, dish, dishRecipes, dishIngredients);
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
