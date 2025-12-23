import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';

export async function handleDeleteTemperatureEquipment(id: string) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

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
        context: {
          endpoint: `/api/temperature-equipment/${id}`,
          operation: 'DELETE',
          equipmentId: id,
        },
      });
      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Server error:', error);
    return NextResponse.json(
      ApiErrorHandler.createError('Internal server error', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}

