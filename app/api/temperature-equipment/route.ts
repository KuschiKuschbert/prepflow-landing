import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';

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
    const queenslandCompliantData = data?.map(equipment => {
      const name = equipment.name.toLowerCase();

      // Apply Queensland thresholds based on equipment type
      if (name.includes('freezer') || name.includes('frozen')) {
        return {
          ...equipment,
          min_temp_celsius: -24, // Optimal minimum freezer temperature
          max_temp_celsius: -18, // Queensland freezer standard - must be at or below -18°C
        };
      } else if (name.includes('hot') || name.includes('warming') || name.includes('steam')) {
        return {
          ...equipment,
          min_temp_celsius: 60, // Queensland hot holding standard
          max_temp_celsius: null, // No upper limit for hot holding
        };
      } else {
        // Default to cold storage (fridges, walk-ins, etc.)
        // Set 0°C to 5°C range for optimal food safety
        return {
          ...equipment,
          min_temp_celsius: 0, // Minimum temperature for cold storage
          max_temp_celsius: 5, // Queensland cold storage standard - must be at or below 5°C
        };
      }
    });

    return NextResponse.json({ success: true, data: queenslandCompliantData || [] });
  } catch (err) {
    logger.error('[Temperature Equipment API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/temperature-equipment', method: 'GET' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? err instanceof Error
            ? err.message
            : 'Unknown error'
          : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
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

    const { data, error } = await supabaseAdmin
      .from('temperature_equipment')
      .insert([
        {
          name: body.name,
          equipment_type: body.equipment_type,
          location: body.location || null,
          min_temp_celsius: body.min_temp_celsius || null,
          max_temp_celsius: body.max_temp_celsius || null,
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
  } catch (err) {
    logger.error('[Temperature Equipment API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/temperature-equipment', method: 'POST' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? err instanceof Error
            ? err.message
            : 'Unknown error'
          : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
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
    logger.error('[Temperature Equipment API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/temperature-equipment', method: 'DELETE' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? err instanceof Error
            ? err.message
            : 'Unknown error'
          : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}
