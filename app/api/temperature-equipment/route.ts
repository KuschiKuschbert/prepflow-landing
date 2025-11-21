import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { applyQueenslandStandards } from './helpers/applyQueenslandStandards';
import { detectTemperatureThresholds } from './helpers/detectTemperatureThresholds';
import { handleTemperatureEquipmentError } from './helpers/handleTemperatureEquipmentError';

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: 'Database connection not available' },
        { status: 500 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from('temperature_equipment')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      logger.error('[Temperature Equipment API] Database error fetching equipment:', {
        error: error.message,
        code: (error as any).code,
        context: {
          endpoint: '/api/temperature-equipment',
          operation: 'GET',
          table: 'temperature_equipment',
        },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    // Apply Queensland food safety standards automatically
    const queenslandCompliantData = applyQueenslandStandards(data || []);

    return NextResponse.json({ success: true, data: queenslandCompliantData });
  } catch (err) {
    return handleTemperatureEquipmentError(err, 'GET');
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

    // Automatically detect thresholds if not provided (only if explicitly null/undefined)
    let minTemp =
      body.min_temp_celsius !== undefined && body.min_temp_celsius !== null
        ? body.min_temp_celsius
        : null;
    let maxTemp =
      body.max_temp_celsius !== undefined && body.max_temp_celsius !== null
        ? body.max_temp_celsius
        : null;

    // Auto-detect if thresholds are null/undefined
    if (minTemp === null || maxTemp === null) {
      const detectedThresholds = detectTemperatureThresholds(body.name, body.equipment_type);
      if (minTemp === null) {
        minTemp = detectedThresholds.min_temp_celsius;
      }
      if (maxTemp === null) {
        maxTemp = detectedThresholds.max_temp_celsius;
      }
      logger.dev('[Temperature Equipment API] Auto-detected thresholds:', {
        name: body.name,
        equipment_type: body.equipment_type,
        detected: detectedThresholds,
        applied: { min_temp_celsius: minTemp, max_temp_celsius: maxTemp },
      });
    }

    const { data, error } = await supabaseAdmin
      .from('temperature_equipment')
      .insert([
        {
          name: body.name,
          equipment_type: body.equipment_type,
          location: body.location || null,
          min_temp_celsius: minTemp,
          max_temp_celsius: maxTemp,
          is_active: body.is_active !== false,
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
    if (err.status) {
      return NextResponse.json(err, { status: err.status });
    }
    return handleTemperatureEquipmentError(err, 'POST');
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        ApiErrorHandler.createError('Equipment ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const { error } = await supabaseAdmin.from('temperature_equipment').delete().eq('id', id);

    if (error) {
      logger.error('[Temperature Equipment API] Database error deleting equipment:', {
        error: error.message,
        code: (error as any).code,
        context: { endpoint: '/api/temperature-equipment', operation: 'DELETE', equipmentId: id },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return handleTemperatureEquipmentError(err, 'DELETE');
  }
}
