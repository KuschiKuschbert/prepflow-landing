/**
 * Recipes Catalog API
 *
 * Lightweight endpoint returning minimal recipe fields for catalog lookups,
 * ingredient pickers, COGS calculations, and menu builder. Returns only the
 * fields needed for display and linking — NOT the full recipe object.
 *
 * At 2000 recipes this returns ~100KB instead of ~2MB from /api/recipes?pageSize=1000.
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { getAuthenticatedUser } from '@/lib/server/get-authenticated-user';
import { NextRequest, NextResponse } from 'next/server';

export interface RecipeCatalogItem {
  id: string;
  recipe_name: string;
  category: string | null;
  selling_price: number | null;
  yield: number | null;
  yield_unit: string | null;
}

export async function GET(request: NextRequest) {
  try {
    const { userId, supabase } = await getAuthenticatedUser(request);

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search') || '';

    let query = supabase
      .from('recipes')
      .select('id, recipe_name, category, selling_price, yield, yield_unit')
      .eq('user_id', userId)
      .order('recipe_name');

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }
    if (search) {
      query = query.ilike('recipe_name', `%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      logger.error('[Recipes Catalog API] Database error:', {
        error: error.message,
        code: error.code,
      });
      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      recipes: (data || []) as RecipeCatalogItem[],
      count: data?.length ?? 0,
    });
  } catch (err) {
    if (err instanceof NextResponse) return err;
    logger.error('[Recipes Catalog API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      ApiErrorHandler.createError('Failed to fetch recipe catalog', 'CATALOG_ERROR', 500),
      { status: 500 },
    );
  }
}
