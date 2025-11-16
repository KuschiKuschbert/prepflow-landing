import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { createDishWithRelations } from './helpers/createDishWithRelations';
import { handleDishListError } from './helpers/handleDishListError';

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
        code: (error as any).code,
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
    });
  } catch (err) {
    return handleDishListError(err, 'GET');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { dish_name, description, selling_price, recipes, ingredients, category } = body;

    if (!dish_name || !selling_price) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Dish name and selling price are required',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Validate that at least one recipe or ingredient is provided
    if ((!recipes || recipes.length === 0) && (!ingredients || ingredients.length === 0)) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Dish must contain at least one recipe or ingredient',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    const newDish = await createDishWithRelations(
      {
        dish_name,
        description,
        selling_price: parseFloat(selling_price),
        category,
      },
      recipes,
      ingredients,
    );

    return NextResponse.json({
      success: true,
      dish: newDish,
    });
  } catch (err: any) {
    if (err.status) {
      return NextResponse.json(err, { status: err.status });
    }
    return handleDishListError(err, 'POST');
  }
}
