import { standardAdminChecks } from '@/lib/admin-auth';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { applyQueenslandStandards } from './helpers/applyQueenslandStandards';
import { handleCreateTemperatureEquipment } from './helpers/createTemperatureEquipmentHandler';
import { handleDeleteTemperatureEquipment } from './helpers/deleteTemperatureEquipmentHandler';
import { handleTemperatureEquipmentError } from './helpers/handleTemperatureEquipmentError';

export async function GET(request: NextRequest) {
  try {
    const { supabase, error } = await standardAdminChecks(request);
    if (error) return error;
    if (!supabase) throw new Error('Unexpected database state');

    const { data, error: dbError } = await supabase
      .from('temperature_equipment')
      .select('*')
      .order('name', { ascending: true });

    if (dbError) {
      logger.error('[Temperature Equipment API] Database error fetching equipment:', {
        error: dbError.message,
        code: dbError.code,
        context: {
          endpoint: '/api/temperature-equipment',
          operation: 'GET',
          table: 'temperature_equipment',
        },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(dbError, 500);
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
  const { supabase, error } = await standardAdminChecks(request);
  if (error) return error;
  if (!supabase) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
  return handleCreateTemperatureEquipment(supabase, request);
}

export async function DELETE(request: NextRequest) {
  const { supabase, error } = await standardAdminChecks(request);
  if (error) return error;
  if (!supabase) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
  return handleDeleteTemperatureEquipment(supabase, request);
}
