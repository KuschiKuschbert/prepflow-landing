/**
 * Ingredients Catalog API
 *
 * Lightweight endpoint returning minimal ingredient fields for catalog lookups,
 * ingredient pickers, COGS calculations, and dish/recipe forms. Returns only
 * the fields needed for calculations and display — NOT the full ingredient object.
 *
 * At 3000 ingredients this returns ~150KB instead of ~3MB from /api/ingredients?pageSize=1000.
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { getAuthenticatedUser } from '@/lib/server/get-authenticated-user';
import { NextRequest, NextResponse } from 'next/server';

export interface IngredientCatalogItem {
  id: string;
  ingredient_name: string;
  unit: string | null;
  pack_cost: number | null;
  pack_size: number | null;
  standard_unit: string | null;
  cost_per_unit: number | null;
  category: string | null;
  supplier_id: string | null;
  wastage_percentage: number | null;
}

export async function GET(request: NextRequest) {
  try {
    const { userId, supabase } = await getAuthenticatedUser(request);

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const supplier = searchParams.get('supplier') || '';

    let query = supabase
      .from('ingredients')
      .select(
        'id, ingredient_name, unit, pack_cost, pack_size, standard_unit, cost_per_unit, category, supplier_id, wastage_percentage',
      )
      .eq('user_id', userId)
      .order('ingredient_name');

    if (search) {
      query = query.ilike('ingredient_name', `%${search}%`);
    }
    if (category) {
      query = query.eq('category', category);
    }
    if (supplier) {
      query = query.eq('supplier_id', supplier);
    }

    const { data, error } = await query;

    if (error) {
      logger.error('[Ingredients Catalog API] Database error:', {
        error: error.message,
        code: error.code,
      });
      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      ingredients: (data || []) as IngredientCatalogItem[],
      count: data?.length ?? 0,
    });
  } catch (err) {
    if (err instanceof NextResponse) return err;
    logger.error('[Ingredients Catalog API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      ApiErrorHandler.createError('Failed to fetch ingredient catalog', 'CATALOG_ERROR', 500),
      { status: 500 },
    );
  }
}
