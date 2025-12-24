import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { handleTemperatureEquipmentError } from './handleTemperatureEquipmentError';

export async function handleDeleteTemperatureEquipment(request: NextRequest) {
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
    logger.error('[Temperature Equipment API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/temperature-equipment', method: 'DELETE' },
    });
    return handleTemperatureEquipmentError(err, 'DELETE');
  }
}
