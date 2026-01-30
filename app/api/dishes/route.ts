import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { triggerDishSync } from '@/lib/square/sync/hooks';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { createDishWithRelations } from './helpers/createDishWithRelations';
import { handleDishListError } from './helpers/handleDishListError';
import { parseAndValidateDishRequest } from './helpers/requestHelpers';
import { createDishSchema, DishResponse } from './helpers/schemas';

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') || '50'), 100);
    const category = searchParams.get('category');
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    let query = supabaseAdmin.from('dishes').select('*', { count: 'exact' });

    // Filter by category if provided
    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    const { data: dishes, error, count } = await query.order('dish_name').range(start, end);

    if (error) {
      logger.error('[Dishes API] Database error fetching dishes:', {
        error: error.message,
        code: error.code,
        context: { endpoint: '/api/dishes', operation: 'GET', table: 'dishes' },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      dishes: dishes || [],
      count: count || 0,
      page,
      pageSize,
    } satisfies DishResponse);
  } catch (err) {
    logger.error('[Dishes API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/dishes', method: 'GET' },
    });
    return handleDishListError(err, 'GET');
  }
}

export async function POST(request: NextRequest) {
  try {
    const dataOrResponse = await parseAndValidateDishRequest(
      request,
      createDishSchema,
      'Dishes API',
    );
    if (dataOrResponse instanceof NextResponse) {
      return dataOrResponse;
    }

    const { dish_name, description, selling_price, recipes, ingredients, category } =
      dataOrResponse;

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const newDish = await createDishWithRelations(
      {
        dish_name,
        description,
        selling_price,
        category,
      },
      recipes,
      ingredients,
    );

    // Trigger Square sync hook (non-blocking)
    (async () => {
      try {
        await triggerDishSync(request, newDish.id, 'create');
      } catch (err) {
        logger.error('[Dishes API] Error triggering Square sync:', {
          error: err instanceof Error ? err.message : String(err),
          dishId: newDish.id,
        });
      }
    })();

    return NextResponse.json({
      success: true,
      dish: newDish,
    } satisfies DishResponse);
  } catch (err) {
    logger.error('[Dishes API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/dishes', method: 'POST' },
    });
    if (err instanceof Error && 'status' in err) {
      const statusError = err as { status: number; message: string };
      return NextResponse.json(err, { status: statusError.status });
    }
    return handleDishListError(err, 'POST');
  }
}
