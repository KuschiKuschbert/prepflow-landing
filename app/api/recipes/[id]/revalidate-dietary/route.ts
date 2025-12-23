/**
 * Revalidate Dietary Status for Recipe
 * Forces recalculation of dietary status, bypassing cache
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { aggregateRecipeDietaryStatus } from '@/lib/dietary/dietary-aggregation';

export async function POST(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const recipeId = id;

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Check if recipe exists
    const { data: recipe, error: fetchError } = await supabaseAdmin
      .from('recipes')
      .select('id, recipe_name')
      .eq('id', recipeId)
      .single();

    if (fetchError || !recipe) {
      return NextResponse.json(ApiErrorHandler.createError('Recipe not found', 'NOT_FOUND', 404), {
        status: 404,
      });
    }

    // Force recalculation (bypasses cache)
    const dietaryStatus = await aggregateRecipeDietaryStatus(recipeId, undefined, true);

    if (!dietaryStatus) {
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to calculate dietary status', 'CALCULATION_ERROR', 500),
        { status: 500 },
      );
    }

    logger.dev('[Revalidate Dietary] Successfully revalidated recipe dietary status:', {
      recipeId,
      recipeName: recipe.recipe_name,
      dietaryStatus,
    });

    return NextResponse.json({
      success: true,
      message: 'Dietary status revalidated successfully',
      recipe: {
        id: recipeId,
        recipe_name: recipe.recipe_name,
        is_vegetarian: dietaryStatus.isVegetarian,
        is_vegan: dietaryStatus.isVegan,
        dietary_confidence: dietaryStatus.confidence,
        dietary_method: dietaryStatus.method,
        reason: dietaryStatus.reason,
      },
    });
  } catch (err) {
    logger.error('[Revalidate Dietary] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/recipes/[id]/revalidate-dietary', method: 'POST' },
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



