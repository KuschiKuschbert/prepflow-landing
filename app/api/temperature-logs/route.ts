import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { buildTemperatureLogQuery } from './helpers/buildTemperatureLogQuery';
import { createTemperatureLog } from './helpers/createTemperatureLog';
import { handleTemperatureLogError } from './helpers/handleTemperatureLogError';
import { z } from 'zod';

const createTemperatureLogSchema = z
  .object({
    temperature_celsius: z.number(),
    equipment_id: z.string().optional(),
    temperature_type: z.string().optional(),
    location: z.string().optional(),
    notes: z.string().optional(),
    logged_at: z.string().optional(),
  })
  .refine(data => data.equipment_id || data.temperature_type, {
    message: 'Either equipment_id or temperature_type must be provided',
    path: ['equipment_id'],
  });

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
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
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
        code: (error as unknown).code,
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
  } catch (err: unknown) {
    logger.error('[Temperature Logs API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/temperature-logs', method: 'GET' },
    });
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

    let body: unknown;
    try {
      body = await request.json();
    } catch (err) {
      logger.warn('[Temperature Logs API] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const validationResult = createTemperatureLogSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          validationResult.error.issues[0]?.message || 'Invalid request body',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    const validatedBody = validationResult.data;

    // Validate temperature range (reasonable values)
    if (validatedBody.temperature_celsius < -50 || validatedBody.temperature_celsius > 200) {
      return NextResponse.json(
        ApiErrorHandler.createError('Temperature out of reasonable range', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const data = await createTemperatureLog(validatedBody);

    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    logger.error('[Temperature Logs API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/temperature-logs', method: 'POST' },
    });
    if (err.status) {
      return NextResponse.json(err, { status: err.status });
    }
    return handleTemperatureLogError(err, 'POST');
  }
}
