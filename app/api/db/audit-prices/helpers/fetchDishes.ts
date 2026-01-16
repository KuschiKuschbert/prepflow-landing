import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import type { DishRecord } from '../types';



/**
 * Fetch all dishes
 */
export async function fetchDishes(): Promise<{ dishes: DishRecord[] } | NextResponse> {

  if (!supabaseAdmin) {
    return NextResponse.json(
      ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
      { status: 500 },
    );
  }

  const { data: dishes, error: dishesError } = await supabaseAdmin
    .from('dishes')
    .select('id, dish_name');

  if (dishesError) {
    logger.error('[Audit Prices] Error fetching dishes:', {
      error: dishesError,
    });
    return NextResponse.json(
      ApiErrorHandler.createError('Failed to fetch dishes', 'DATABASE_ERROR', 500),
      { status: 500 },
    );
  }

  return { dishes: dishes || [] };
}
