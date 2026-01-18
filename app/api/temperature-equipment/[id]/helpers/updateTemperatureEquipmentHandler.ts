import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { detectTemperatureThresholds } from '../../helpers/detectTemperatureThresholds';
import { handleTemperatureEquipmentError } from '../../helpers/handleTemperatureEquipmentError';
import { updateTemperatureEquipmentSchema } from '../../helpers/schemas';

export async function handleUpdateTemperatureEquipment(
  supabase: SupabaseClient,
  request: NextRequest,
  id: string,
) {
  try {
    if (!id) {
      return NextResponse.json(
        ApiErrorHandler.createError('Equipment ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
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

    const validationResult = updateTemperatureEquipmentSchema.safeParse(body);
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

    // Get current equipment to use name/type for threshold detection if needed
    const { data: currentEquipment, error: fetchError } = await supabase
      .from('temperature_equipment')
      .select('name, equipment_type')
      .eq('id', id)
      .single();

    if (fetchError) {
      logger.error('[Temperature Equipment API] Error fetching equipment for update:', {
        error: fetchError.message,
        equipmentId: id,
      });
      const apiError = ApiErrorHandler.fromSupabaseError(fetchError, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    // Automatically detect thresholds if not provided and name/type changed
    let minTemp = validatedBody.min_temp_celsius ?? null;
    let maxTemp = validatedBody.max_temp_celsius ?? null;

    const name = validatedBody.name || currentEquipment?.name || '';
    const equipmentType = validatedBody.equipment_type || currentEquipment?.equipment_type || '';

    // Auto-detect if thresholds are null and we have name/type
    if ((minTemp === null || maxTemp === null) && (name || equipmentType)) {
      const detectedThresholds = detectTemperatureThresholds(name, equipmentType);
      if (minTemp === null) {
        minTemp = detectedThresholds.min_temp_celsius;
      }
      if (maxTemp === null) {
        maxTemp = detectedThresholds.max_temp_celsius;
      }
      logger.dev('[Temperature Equipment API] Auto-detected thresholds on update:', {
        id,
        name,
        equipment_type: equipmentType,
        detected: detectedThresholds,
        applied: { min_temp_celsius: minTemp, max_temp_celsius: maxTemp },
      });
    }

    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (validatedBody.name !== undefined) updateData.name = validatedBody.name;
    if (validatedBody.equipment_type !== undefined)
      updateData.equipment_type = validatedBody.equipment_type;
    if (validatedBody.location !== undefined) updateData.location = validatedBody.location;
    if (minTemp !== undefined) updateData.min_temp_celsius = minTemp;
    if (maxTemp !== undefined) updateData.max_temp_celsius = maxTemp;
    if (validatedBody.is_active !== undefined) updateData.is_active = validatedBody.is_active;

    const { data, error } = await supabase
      .from('temperature_equipment')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      logger.error('[Temperature Equipment API] Database error updating equipment:', {
        error: error.message,
        code: error.code,
        context: {
          endpoint: `/api/temperature-equipment/${id}`,
          operation: 'PUT',
          equipmentId: id,
        },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    logger.error('[Temperature Equipment API] Unexpected error updating equipment:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });

    return handleTemperatureEquipmentError(err, 'PUT');
  }
}
