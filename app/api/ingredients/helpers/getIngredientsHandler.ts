import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { getAuthenticatedUser } from '@/lib/server/get-authenticated-user';
import { NextRequest, NextResponse } from 'next/server';
import { handleIngredientError } from './handleIngredientError';

export async function handleGetIngredients(request: NextRequest) {
  try {
    const { userId, supabase: supabaseAdmin } = await getAuthenticatedUser(request);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'name'; // name, price, category
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    const categoryFilter = searchParams.get('category') || '';
    const supplierFilter = searchParams.get('supplier') || '';
    const storageFilter = searchParams.get('storage') || '';

    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    let query = supabaseAdmin
      .from('ingredients')
      .select('*', { count: 'exact' })
      .eq('user_id', userId);

    // Apply filters
    if (search) {
      query = query.ilike('ingredient_name', `%${search}%`);
    }
    if (categoryFilter) {
      query = query.eq('category_id', categoryFilter);
    }
    if (supplierFilter) {
      query = query.eq('supplier_id', supplierFilter);
    }
    if (storageFilter) {
      query = query.eq('storage_area', storageFilter);
    }

    // Apply sorting
    const orderColumn =
      sortBy === 'price' ? 'cost_per_unit' : sortBy === 'category' ? 'category' : 'ingredient_name';

    query = query.order(orderColumn, { ascending: sortOrder === 'asc' });

    // Apply pagination
    const { data, error, count } = await query.range(start, end);

    if (error) {
      logger.error('[Ingredients API] Database error fetching ingredients:', {
        error: error.message,
        code: error.code,
        context: { endpoint: '/api/ingredients', operation: 'GET', table: 'ingredients' },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        items: data || [],
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize),
      },
    });
  } catch (err) {
    if (err instanceof NextResponse) return err;
    logger.error('[Ingredients API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/ingredients', method: 'GET' },
    });
    return handleIngredientError(err, 'GET');
  }
}
