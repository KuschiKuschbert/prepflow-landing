import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

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
        code: (error as any).code,
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
  } catch (err: any) {
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

    const body = await request.json();
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
    } = body;

    // Validate required fields
    if (!equipment_name || !maintenance_date || !maintenance_type || !description) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Missing required fields: equipment_name, maintenance_date, maintenance_type, and description are required',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

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
        code: (error as any).code,
      });
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Failed to create equipment maintenance record',
          'DATABASE_ERROR',
          500,
        ),
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Equipment maintenance record created successfully',
      data,
    });
  } catch (err: any) {
    logger.error('[Equipment Maintenance API] Unexpected error:', err);
    return NextResponse.json(
      ApiErrorHandler.createError('Internal server error', 'INTERNAL_ERROR', 500),
      { status: 500 },
    );
  }
}

