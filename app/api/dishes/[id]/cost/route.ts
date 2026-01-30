import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { calculateDishCost } from './service';

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id: dishId } = await context.params;

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

    const costData = await calculateDishCost(dishId);

    return NextResponse.json({
      success: true,
      cost: costData,
    });
  } catch (err) {
    // Handle error returned from service, which might already be clean (e.g. 404)
    if (err instanceof NextResponse) {
      return err;
    }

    // Check if error has status (ApiError)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((err as any).status && (err as any).body) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return NextResponse.json(err, { status: (err as any).status });
    }

    logger.error('[Dishes API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/dishes/[id]/cost', method: 'GET' },
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
