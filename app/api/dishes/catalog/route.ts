/**
 * Dishes Catalog API
 *
 * Lightweight endpoint returning minimal dish fields for catalog lookups,
 * menu builder add-item flows, and unified item lists. Returns only the
 * fields needed for display and linking — NOT the full dish object.
 *
 * At 1000 dishes this returns ~50KB instead of ~1MB from /api/dishes?pageSize=1000.
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { getAuthenticatedUser } from '@/lib/server/get-authenticated-user';
import { NextRequest, NextResponse } from 'next/server';

export interface DishCatalogItem {
  id: string;
  dish_name: string;
  category: string | null;
  selling_price: number | null;
  cost_price: number | null;
}

export async function GET(request: NextRequest) {
  try {
    const { userId, supabase } = await getAuthenticatedUser(request);

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search') || '';

    let query = supabase
      .from('dishes')
      .select('id, dish_name, category, selling_price, cost_price')
      .eq('user_id', userId)
      .order('dish_name');

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }
    if (search) {
      query = query.ilike('dish_name', `%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      logger.error('[Dishes Catalog API] Database error:', {
        error: error.message,
        code: error.code,
      });
      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      dishes: (data || []) as DishCatalogItem[],
      count: data?.length ?? 0,
    });
  } catch (err) {
    if (err instanceof NextResponse) return err;
    logger.error('[Dishes Catalog API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      ApiErrorHandler.createError('Failed to fetch dish catalog', 'CATALOG_ERROR', 500),
      { status: 500 },
    );
  }
}
