import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { buildTemperatureLogQuery } from './helpers/buildTemperatureLogQuery';
import { createTemperatureLog } from './helpers/createTemperatureLog';
import { handleTemperatureLogError } from './helpers/handleTemperatureLogError';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  const type = searchParams.get('type');
  const location = searchParams.get('location');
  const equipmentId = searchParams.get('equipment_id');
  const limit = searchParams.get('limit');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = limit ? parseInt(limit, 10) : parseInt(searchParams.get('pageSize') || '20', 10);

  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: 'Database connection not available' },
        { status: 500 },
      );
    }

    const { data, error, count } = await buildTemperatureLogQuery(
      { date, type, location, equipmentId },
      page,
      pageSize,
    );

    if (error) {
      logger.error('[Temperature Logs API] Database error fetching logs:', {
        error: error.message,
        code: (error as any).code,
        context: { endpoint: '/api/temperature-logs', operation: 'GET', table: 'temperature_logs' },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    const total = count || 0;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return NextResponse.json({
      success: true,
      data: {
        items: data || [],
        total,
        page,
        pageSize,
        totalPages,
      },
    });
  } catch (err: any) {
    if (err.status) {
      return NextResponse.json(err, { status: err.status });
    }
    return handleTemperatureLogError(err, 'GET');
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

    // Validate required fields - either equipment_id or temperature_type must be provided
    if (!body.temperature_celsius || (!body.equipment_id && !body.temperature_type)) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Missing required fields: temperature_celsius and (equipment_id or temperature_type)',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    // Validate temperature range (reasonable values)
    if (body.temperature_celsius < -50 || body.temperature_celsius > 200) {
      return NextResponse.json(
        ApiErrorHandler.createError('Temperature out of reasonable range', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const data = await createTemperatureLog(body);

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    if (err.status) {
      return NextResponse.json(err, { status: err.status });
    }
    return handleTemperatureLogError(err, 'POST');
  }
}
