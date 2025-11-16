import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  const type = searchParams.get('type');
  const location = searchParams.get('location');
  const equipmentId = searchParams.get('equipment_id');
  const limit = searchParams.get('limit');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = limit ? parseInt(limit, 10) : parseInt(searchParams.get('pageSize') || '20', 10);

  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: 'Database connection not available' },
        { status: 500 },
      );
    }

    // Build base query with filters
    let query = supabaseAdmin
      .from('temperature_logs')
      .select('*', { count: 'exact' })
      .order('log_date', { ascending: false })
      .order('log_time', { ascending: false });

    if (date) {
      query = query.eq('log_date', date);
    }

    if (type && type !== 'all') {
      query = query.eq('temperature_type', type);
    }

    if (location) {
      query = query.eq('location', location);
    }

    if (equipmentId) {
      query = query.eq('equipment_id', equipmentId);
    }

    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      logger.error('[Temperature Logs API] Database error fetching logs:', {
        error: error.message,
        code: (error as any).code,
        context: { endpoint: '/api/temperature-logs', operation: 'GET', table: 'temperature_logs' },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    const total = count || 0;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return NextResponse.json({
      success: true,
      data: {
        items: data || [],
        total,
        page,
        pageSize,
        totalPages,
      },
    });
  } catch (err) {
    logger.error('[Temperature Logs API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/temperature-logs', method: 'GET' },
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

    // Validate required fields - either equipment_id or temperature_type must be provided
    if (!body.temperature_celsius || (!body.equipment_id && !body.temperature_type)) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Missing required fields: temperature_celsius and (equipment_id or temperature_type)',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    // Validate temperature range (reasonable values)
    if (body.temperature_celsius < -50 || body.temperature_celsius > 200) {
      return NextResponse.json(
        ApiErrorHandler.createError('Temperature out of reasonable range', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    // If equipment_id is provided, fetch equipment details for temperature_type and location
    let temperatureType = body.temperature_type;
    let equipmentLocation = body.location;

    if (body.equipment_id) {
      const { data: equipment } = await supabaseAdmin
        .from('temperature_equipment')
        .select('equipment_type, location, name')
        .eq('id', body.equipment_id)
        .single();

      if (equipment) {
        temperatureType = temperatureType || equipment.equipment_type;
        equipmentLocation = equipmentLocation || equipment.location || equipment.name;
      }
    }

    const { data, error } = await supabaseAdmin
      .from('temperature_logs')
      .insert([
        {
          equipment_id: body.equipment_id || null,
          log_date: body.log_date || new Date().toISOString().split('T')[0],
          log_time: body.log_time || new Date().toTimeString().split(' ')[0],
          temperature_type: temperatureType,
          temperature_celsius: body.temperature_celsius,
          location: equipmentLocation || null,
          notes: body.notes || null,
          logged_by: body.logged_by || 'System',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      logger.error('[Temperature Logs API] Database error creating log:', {
        error: error.message,
        code: (error as any).code,
        context: {
          endpoint: '/api/temperature-logs',
          operation: 'POST',
          table: 'temperature_logs',
        },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    logger.error('[Temperature Logs API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/temperature-logs', method: 'POST' },
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
