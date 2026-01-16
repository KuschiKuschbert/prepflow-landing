import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { applyQueenslandStandards } from './helpers/applyQueenslandStandards';
import { handleTemperatureEquipmentError } from './helpers/handleTemperatureEquipmentError';
import { handleCreateTemperatureEquipment } from './helpers/createTemperatureEquipmentHandler';
import { handleDeleteTemperatureEquipment } from './helpers/deleteTemperatureEquipmentHandler';

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
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
        code: (error as unknown).code,
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
    logger.error('[Temperature Equipment API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/temperature-equipment', method: 'GET' },
    });
    return handleTemperatureEquipmentError(err, 'GET');
  }
}

export async function POST(request: NextRequest) {
  return handleCreateTemperatureEquipment(request);
}

export async function DELETE(request: NextRequest) {
  return handleDeleteTemperatureEquipment(request);
}
