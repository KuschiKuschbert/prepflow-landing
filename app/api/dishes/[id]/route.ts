import { ApiErrorHandler } from '@/lib/api-error-handler';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { fetchDishWithRelations } from './helpers/fetchDishWithRelations';
import { handleDishError } from './helpers/handleDishError';
import { enrichDishWithAllergens } from './helpers/enrichDishWithAllergens';
import { handlePutRequest } from './helpers/handlePutRequest';

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const dishId = id;

    if (!dishId) {
      return NextResponse.json({ error: 'Missing dish id' }, { status: 400 });
    }

    const dish = await fetchDishWithRelations(dishId);
    const enrichedDish = await enrichDishWithAllergens(dish, dishId);

    return NextResponse.json({
      success: true,
      dish: enrichedDish,
    });
  } catch (err: any) {
    return handleDishError(err, 'GET');
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const dishId = id;
  try {
    if (!dishId) {
      return NextResponse.json(
        ApiErrorHandler.createError('Dish ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    return handlePutRequest(request, dishId);
  } catch (err) {
    return handleDishError(err, 'PUT', dishId);
  }
}

export async function DELETE(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const dishId = id;

    if (!dishId) {
      return NextResponse.json(
        ApiErrorHandler.createError('Dish ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Delete dish (cascade will handle related records)
    const { error } = await supabaseAdmin.from('dishes').delete().eq('id', dishId);

    if (error) {
      logger.error('[Dishes API] Database error deleting dish:', {
        error: error.message,
        code: (error as any).code,
        context: { endpoint: '/api/dishes/[id]', operation: 'DELETE', dishId },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Dish deleted successfully',
    });
  } catch (err) {
    return handleDishError(err, 'DELETE');
  }
}
