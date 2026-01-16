import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const createEquipmentMaintenanceSchema = z.object({
  equipment_name: z.string().min(1, 'equipment_name is required'),
  maintenance_date: z.string().min(1, 'maintenance_date is required'),
  maintenance_type: z.string().min(1, 'maintenance_type is required'),
  description: z.string().min(1, 'description is required'),
  equipment_type: z.string().optional(),
  service_provider: z.string().optional(),
  cost: z.number().optional(),
  next_maintenance_date: z.string().optional(),
  is_critical: z.boolean().optional(),
  performed_by: z.string().optional(),
  notes: z.string().optional(),
  photo_url: z.string().url().optional().or(z.literal('')),
});

/**
 * GET /api/equipment-maintenance
 * List equipment maintenance records
 */
export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const { searchParams } = new URL(request.url);
    const equipmentType = searchParams.get('equipment_type');
    const maintenanceType = searchParams.get('maintenance_type');
    const isCritical = searchParams.get('is_critical');

    let query = supabaseAdmin
      .from('equipment_maintenance')
      .select('*')
      .order('maintenance_date', { ascending: false });

    if (equipmentType) {
      query = query.eq('equipment_type', equipmentType);
    }
    if (maintenanceType) {
      query = query.eq('maintenance_type', maintenanceType);
    }
    if (isCritical !== null) {
      query = query.eq('is_critical', isCritical === 'true');
    }

    const { data, error } = await query;

    if (error) {
      logger.error('[Equipment Maintenance API] Database error:', {
        error: error.message,
        code: (error as unknown).code,
      });
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Failed to fetch equipment maintenance records',
          'DATABASE_ERROR',
          500,
        ),
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (err: unknown) {
    logger.error('[Equipment Maintenance API] Unexpected error:', err);
    return NextResponse.json(
      ApiErrorHandler.createError('Internal server error', 'INTERNAL_ERROR', 500),
      { status: 500 },
    );
  }
}

/**
 * POST /api/equipment-maintenance
 * Create equipment maintenance record
 */
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
      logger.warn('[Equipment Maintenance API] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const validationResult = createEquipmentMaintenanceSchema.safeParse(body);
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

    const {
      equipment_name,
      equipment_type,
      maintenance_date,
      maintenance_type,
      service_provider,
      description,
      cost,
      next_maintenance_date,
      is_critical,
      performed_by,
      notes,
      photo_url,
    } = validationResult.data;

    const { data, error } = await supabaseAdmin
      .from('equipment_maintenance')
      .insert({
        equipment_name,
        equipment_type: equipment_type || null,
        maintenance_date,
        maintenance_type,
        service_provider: service_provider || null,
        description,
        cost: cost ? parseFloat(cost.toString()) : null,
        next_maintenance_date: next_maintenance_date || null,
        is_critical: is_critical || false,
        performed_by: performed_by || null,
        notes: notes || null,
        photo_url: photo_url || null,
      })
      .select()
      .single();

    if (error) {
      logger.error('[Equipment Maintenance API] Database error creating record:', {
        error: error.message,
        code: (error as unknown).code,
      });
      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Equipment maintenance record created successfully',
      data,
    });
  } catch (err: unknown) {
    logger.error('[Equipment Maintenance API] Unexpected error:', err);
    return NextResponse.json(
      ApiErrorHandler.createError('Internal server error', 'INTERNAL_ERROR', 500),
      { status: 500 },
    );
  }
}
