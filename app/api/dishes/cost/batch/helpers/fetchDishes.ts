/**
 * Helper to fetch dishes for batch cost calculation.
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

/**
 * Fetch dishes by IDs and create a map for quick lookup.
 */
export async function fetchDishes(
  dishIds: string[],
): Promise<{ dishesMap: Map<string, any> } | { error: NextResponse }> {
  if (!supabaseAdmin) {
    return {
      error: NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      ),
    };
  }

  const { data: dishes, error: dishesError } = await supabaseAdmin
    .from('dishes')
    .select('id, dish_name, selling_price')
    .in('id', dishIds);

  if (dishesError) {
    logger.error('[Dishes API] Database error fetching dishes for batch cost calculation:', {
      error: dishesError.message,
      code: dishesError.code,
      context: { endpoint: '/api/dishes/cost/batch', operation: 'POST' },
    });

    const apiError = ApiErrorHandler.fromSupabaseError(dishesError, 500);
    return {
      error: NextResponse.json(apiError, { status: apiError.status || 500 }),
    };
  }

  const dishesMap = new Map(dishes?.map(d => [d.id, d]) || []);

  return { dishesMap };
}
