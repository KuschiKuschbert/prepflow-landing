/**
 * Revalidate Dietary Status for Dish
 * Forces recalculation of dietary status, bypassing cache
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { aggregateDishDietaryStatus } from '@/lib/dietary/dietary-aggregation';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id: dishId } = await context.params;

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Check if dish exists
    const { data: dish, error: fetchError } = await supabaseAdmin
      .from('dishes')
      .select('id, dish_name')
      .eq('id', dishId)
      .single();

    if (fetchError || !dish) {
      return NextResponse.json(ApiErrorHandler.createError('Dish not found', 'NOT_FOUND', 404), {
        status: 404,
      });
    }

    // Force recalculation (bypasses cache)
    const dietaryStatus = await aggregateDishDietaryStatus(dishId, undefined, true);

    if (!dietaryStatus) {
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to calculate dietary status', 'CALCULATION_ERROR', 500),
        { status: 500 },
      );
    }

    logger.dev('[Revalidate Dietary] Successfully revalidated dish dietary status:', {
      dishId,
      dishName: dish.dish_name,
      dietaryStatus,
    });

    return NextResponse.json({
      success: true,
      message: 'Dietary status revalidated successfully',
      dish: {
        id: dishId,
        dish_name: dish.dish_name,
        is_vegetarian: dietaryStatus.isVegetarian,
        is_vegan: dietaryStatus.isVegan,
        dietary_confidence: dietaryStatus.confidence,
        dietary_method: dietaryStatus.method,
        reason: dietaryStatus.reason,
      },
    });
  } catch (err: unknown) {
    logger.error('[Revalidate Dietary] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/dishes/[id]/revalidate-dietary', method: 'POST' },
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
