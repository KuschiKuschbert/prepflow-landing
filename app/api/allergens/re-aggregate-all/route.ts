/**
 * Force Re-aggregate All Allergens API Endpoint
 * POST /api/allergens/re-aggregate-all
 * Forces re-aggregation of allergens for all recipes and dishes
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { reAggregateDishes } from './helpers/reAggregateDishes';
import { reAggregateRecipes } from './helpers/reAggregateRecipes';

/**
 * Forces re-aggregation of allergens for all recipes and dishes.
 *
 * @param {NextRequest} request - Next.js request object
 * @returns {Promise<NextResponse>} Re-aggregation results
 */
export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Run aggregations
    // We run them sequentially to avoid overwhelming the database
    const recipeResults = await reAggregateRecipes();
    const dishResults = await reAggregateDishes();

    logger.dev(
      `[Re-aggregate All Allergens API] Re-aggregated allergens for ${recipeResults.total} recipes and ${dishResults.total} dishes`,
    );

    return NextResponse.json({
      success: true,
      data: {
        recipes: recipeResults,
        dishes: dishResults,
      },
    });
  } catch (err) {
    logger.error('[Re-aggregate All Allergens API] Unexpected error:', err);
    return NextResponse.json(
      ApiErrorHandler.createError(
        'Failed to re-aggregate allergens',
        'SERVER_ERROR',
        500,
        err instanceof Error ? err.message : String(err),
      ),
      { status: 500 },
    );
  }
}
