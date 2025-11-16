import { ApiErrorHandler } from '@/lib/api-error-handler';
import { evaluateGate } from '@/lib/feature-gate';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { handlePerformanceError } from './helpers/handlePerformanceError';
import { processPerformanceData } from './helpers/processPerformanceData';
import { upsertSalesData } from './helpers/upsertSalesData';

export async function GET(request: NextRequest) {
  try {
    const gate = evaluateGate('analytics', request);
    if (!gate.allowed) {
      return NextResponse.json(ApiErrorHandler.createError('Access denied', 'FORBIDDEN', 403), {
        status: 403,
      });
    }
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Get date range from query parameters
    const { searchParams } = new URL(request.url);
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    // Build sales_data query
    const { data: dishes, error: dishesError } = await supabaseAdmin
      .from('menu_dishes')
      .select(
        `
        *,
        sales_data (
          id,
          number_sold,
          popularity_percentage,
          date
        )
      `,
      )
      .order('created_at', { ascending: false });

    if (dishesError) {
      logger.error('[Performance API] Database error fetching dishes:', {
        error: dishesError.message,
        code: (dishesError as any).code,
        context: { endpoint: '/api/performance', operation: 'GET', table: 'menu_dishes' },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(dishesError, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    // Process performance data
    const { performanceData, metadata } = processPerformanceData(
      dishes || [],
      startDateParam,
      endDateParam,
    );

    return NextResponse.json({
      success: true,
      data: performanceData,
      message: 'Performance data retrieved successfully',
      metadata,
    });
  } catch (err) {
    return handlePerformanceError(err, 'GET');
  }
}

export async function POST(request: NextRequest) {
  try {
    const { dish_id, number_sold, popularity_percentage, date } = await request.json();

    if (!dish_id || !number_sold || !popularity_percentage) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'dish_id, number_sold, and popularity_percentage are required',
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

    const data = await upsertSalesData({
      dish_id,
      number_sold,
      popularity_percentage,
      date,
    });

    return NextResponse.json({
      success: true,
      data,
      message: 'Sales data updated successfully',
    });
  } catch (err: any) {
    if (err.status) {
      return NextResponse.json(err, { status: err.status });
    }
    return handlePerformanceError(err, 'POST');
  }
}
