import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { detectTemperatureThresholds } from './detectTemperatureThresholds';
import { handleTemperatureEquipmentError } from './handleTemperatureEquipmentError';
import { createTemperatureEquipmentSchema } from './schemas';

export async function handleCreateTemperatureEquipment(request: NextRequest) {
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
      logger.warn('[Temperature Equipment API] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const validationResult = createTemperatureEquipmentSchema.safeParse(body);
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

    // Automatically detect thresholds if not provided (only if explicitly null/undefined)
    let minTemp =
      validatedBody.min_temp_celsius !== undefined && validatedBody.min_temp_celsius !== null
        ? validatedBody.min_temp_celsius
        : null;
    let maxTemp =
      validatedBody.max_temp_celsius !== undefined && validatedBody.max_temp_celsius !== null
        ? validatedBody.max_temp_celsius
        : null;

    // Auto-detect if thresholds are null/undefined
    if (minTemp === null || maxTemp === null) {
      const detectedThresholds = detectTemperatureThresholds(
        validatedBody.name,
        validatedBody.equipment_type || '',
      );
      if (minTemp === null) {
        minTemp = detectedThresholds.min_temp_celsius;
      }
      if (maxTemp === null) {
        maxTemp = detectedThresholds.max_temp_celsius;
      }
      logger.dev('[Temperature Equipment API] Auto-detected thresholds:', {
        name: validatedBody.name,
        equipment_type: validatedBody.equipment_type,
        detected: detectedThresholds,
        applied: { min_temp_celsius: minTemp, max_temp_celsius: maxTemp },
      });
    }

    const { data, error } = await supabaseAdmin
      .from('temperature_equipment')
      .insert([
        {
          name: validatedBody.name,
          equipment_type: validatedBody.equipment_type,
          location: validatedBody.location || null,
          min_temp_celsius: minTemp,
          max_temp_celsius: maxTemp,
          is_active: validatedBody.is_active !== false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      logger.error('[Temperature Equipment API] Database error creating equipment:', {
        error: error.message,
        code: (error as any).code,
        context: {
          endpoint: '/api/temperature-equipment',
          operation: 'POST',
          table: 'temperature_equipment',
        },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    logger.error('[Temperature Equipment API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/temperature-equipment', method: 'POST' },
    });
    if (err.status) {
      return NextResponse.json(err, { status: err.status });
    }
    return handleTemperatureEquipmentError(err, 'POST');
  }
}
