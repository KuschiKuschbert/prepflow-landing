/**
 * Force Re-aggregate All Allergens API Endpoint
 * POST /api/allergens/re-aggregate-all
 * Forces re-aggregation of allergens for all recipes and dishes
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger, type ErrorContext } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import {
  batchAggregateRecipeAllergens,
  aggregateDishAllergens,
} from '@/lib/allergens/allergen-aggregation';

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

    // Fetch all recipe IDs
    const { data: recipes, error: recipesError } = await supabaseAdmin.from('recipes').select('id');

    if (recipesError) {
      logger.error('[Re-aggregate All Allergens API] Error fetching recipes:', {
        error: recipesError.message,
        code: (recipesError as any).code,
        context: { endpoint: '/api/allergens/re-aggregate-all', operation: 'POST' },
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to fetch recipes', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Fetch all dish IDs
    const { data: dishes, error: dishesError } = await supabaseAdmin.from('dishes').select('id');

    if (dishesError && (dishesError as any).code !== '42P01') {
      // Ignore table doesn't exist error
      logger.warn(
        '[Re-aggregate All Allergens API] Error fetching dishes:',
        dishesError as unknown as ErrorContext,
      );
    }

    const recipeIds = (recipes || []).map(r => r.id);
    const dishIds = (dishes || []).map(d => d.id);

    logger.dev(
      `[Re-aggregate All Allergens API] Re-aggregating allergens for ${recipeIds.length} recipes and ${dishIds.length} dishes`,
    );

    // Batch aggregate recipes
    let recipeResults: Record<string, string[]> = {};
    if (recipeIds.length > 0) {
      try {
        recipeResults = await batchAggregateRecipeAllergens(recipeIds);
        logger.dev(
          `[Re-aggregate All Allergens API] Successfully re-aggregated allergens for ${Object.keys(recipeResults).length} recipes`,
        );
      } catch (err) {
        logger.error('[Re-aggregate All Allergens API] Error batch aggregating recipe allergens:', {
          error: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : undefined,
          context: {
            endpoint: '/api/allergens/re-aggregate-all',
            operation: 'batchAggregateRecipeAllergens',
            recipeCount: recipeIds.length,
          },
        });
      }
    }

    // Aggregate dishes in parallel
    const dishResults: Record<string, string[]> = {};
    if (dishIds.length > 0) {
      try {
        const dishAllergens = await Promise.all(
          dishIds.map(async dishId => {
            try {
              const allergens = await aggregateDishAllergens(dishId, true);
              return { dishId, allergens };
            } catch (err) {
              logger.error('[Re-aggregate All Allergens API] Error aggregating dish allergens:', {
                error: err instanceof Error ? err.message : String(err),
                stack: err instanceof Error ? err.stack : undefined,
                context: { dishId, operation: 'aggregateDishAllergens' },
              });
              return { dishId, allergens: [] };
            }
          }),
        );

        dishAllergens.forEach(({ dishId, allergens }) => {
          dishResults[dishId] = allergens;
        });

        logger.dev(
          `[Re-aggregate All Allergens API] Successfully re-aggregated allergens for ${Object.keys(dishResults).length} dishes`,
        );
      } catch (err) {
        logger.error('[Re-aggregate All Allergens API] Error aggregating dish allergens:', err);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        recipes: {
          total: recipeIds.length,
          aggregated: Object.keys(recipeResults).length,
          results: recipeResults,
        },
        dishes: {
          total: dishIds.length,
          aggregated: Object.keys(dishResults).length,
          results: dishResults,
        },
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
