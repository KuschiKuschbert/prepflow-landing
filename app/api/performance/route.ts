import { ApiErrorHandler } from '@/lib/api-error-handler';
import { evaluateGate } from '@/lib/feature-gate';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { bulkImportSalesData } from './helpers/bulkImportSalesData';
import { handlePerformanceError } from './helpers/handlePerformanceError';
import { processPerformanceData } from './helpers/processPerformanceData';
import { fetchDishesForPerformance, getFilterMenuId } from './service';
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

    // Get date range and menu filter from query parameters
    const { searchParams } = new URL(request.url);
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    const menuIdParam = searchParams.get('menuId');
    const lockedMenuOnly = searchParams.get('lockedMenuOnly') === 'true';

    const targetMenuId = await getFilterMenuId(supabaseAdmin, menuIdParam, lockedMenuOnly);
    const dishes = await fetchDishesForPerformance(supabaseAdmin, targetMenuId);

    if (dishes.length === 0 && targetMenuId) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'No dishes found in the specified menu',
        metadata: {
          methodology: 'PrepFlow COGS Dynamic',
          filteredByMenu: targetMenuId,
        },
      });
    }

    // Process performance data
    const { performanceData, performanceHistory, metadata } = processPerformanceData(
      dishes || [],
      startDateParam,
      endDateParam,
    );

    // Fetch daily weather logs for correlation (non-blocking; empty if table missing or error)
    let weatherByDate: Record<
      string,
      {
        temp_celsius_max: number | null;
        temp_celsius_min: number | null;
        precipitation_mm: number;
        weather_status: string;
      }
    > = {};
    if (supabaseAdmin && (startDateParam || endDateParam)) {
      let weatherQuery = supabaseAdmin
        .from('daily_weather_logs')
        .select('log_date, temp_celsius_max, temp_celsius_min, precipitation_mm, weather_status');
      if (startDateParam) weatherQuery = weatherQuery.gte('log_date', startDateParam);
      if (endDateParam) weatherQuery = weatherQuery.lte('log_date', endDateParam);
      const { data: weatherLogs } = await weatherQuery;
      if (weatherLogs?.length) {
        weatherByDate = Object.fromEntries(
          weatherLogs.map(
            (w: {
              log_date: string;
              temp_celsius_max: number | null;
              temp_celsius_min: number | null;
              precipitation_mm: number;
              weather_status: string;
            }) => [
              w.log_date,
              {
                temp_celsius_max: w.temp_celsius_max,
                temp_celsius_min: w.temp_celsius_min,
                precipitation_mm: Number(w.precipitation_mm) || 0,
                weather_status: w.weather_status || 'Unknown',
              },
            ],
          ),
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: performanceData,
      performanceHistory,
      weatherByDate,
      message: 'Performance data retrieved successfully',
      metadata,
    });
  } catch (err) {
    logger.error('[Performance API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/performance', method: 'GET' },
    });
    return handlePerformanceError(err, 'GET');
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const body = await request.json();

    // Bulk import: { salesData: [{ dish_name, number_sold, popularity_percentage }, ...] }
    if (Array.isArray(body.salesData) && body.salesData.length > 0) {
      const records = body.salesData.map(
        (r: { dish_name?: string; number_sold?: number; popularity_percentage?: number }) => ({
          dish_name: String(r.dish_name ?? '').trim(),
          number_sold: Number(r.number_sold) || 0,
          popularity_percentage: Number(r.popularity_percentage) || 0,
        }),
      );
      const { imported, errors } = await bulkImportSalesData(records);
      return NextResponse.json({
        success: true,
        data: { imported, errors },
        message:
          errors.length > 0
            ? `Imported ${imported} records. ${errors.length} issue(s): ${errors.slice(0, 5).join('; ')}${errors.length > 5 ? '...' : ''}`
            : `Imported ${imported} sales records successfully`,
      });
    }

    // Single record: { dish_id, number_sold, popularity_percentage, date? }
    const { dish_id, number_sold, popularity_percentage, date } = body;

    if (!dish_id || number_sold == null || popularity_percentage == null) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'dish_id, number_sold, and popularity_percentage are required',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    const data = await upsertSalesData({
      dish_id,
      number_sold: Number(number_sold),
      popularity_percentage: Number(popularity_percentage),
      date,
    });

    return NextResponse.json({
      success: true,
      data,
      message: 'Sales data updated successfully',
    });
  } catch (err: unknown) {
    const e = err;
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          e.issues[0]?.message || 'Invalid request body',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }
    logger.error('[Performance API] Unexpected error:', {
      error: e instanceof Error ? e.message : String(e),
      context: { endpoint: '/api/performance', method: 'POST' },
    });

    // Check if it's an API error response-like object
    if (
      typeof e === 'object' &&
      e !== null &&
      'status' in e &&
      typeof (e as { status: number }).status === 'number'
    ) {
      return NextResponse.json(e, { status: (e as { status: number }).status });
    }
    return handlePerformanceError(e, 'POST');
  }
}
