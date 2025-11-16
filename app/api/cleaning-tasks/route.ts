import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';

const CLEANING_AREAS_SELECT = `
  *,
  cleaning_areas (
    id,
    name,
    description,
    frequency_days
  )
`;

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const { searchParams } = new URL(request.url);
    const areaId = searchParams.get('area_id');
    const status = searchParams.get('status');
    const date = searchParams.get('date');

    let query = supabaseAdmin
      .from('cleaning_tasks')
      .select(CLEANING_AREAS_SELECT)
      .order('assigned_date', { ascending: false });

    if (areaId) {
      query = query.eq('area_id', areaId);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (date) {
      query = query.eq('assigned_date', date);
    }

    const { data, error } = await query;

    if (error) {
      logger.error('[Cleaning Tasks API] Database error fetching tasks:', {
        error: error.message,
        code: (error as any).code,
        context: { endpoint: '/api/cleaning-tasks', operation: 'GET', table: 'cleaning_tasks' },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (err) {
    logger.error('[Cleaning Tasks API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/cleaning-tasks', method: 'GET' },
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
    const body = await request.json();
    const { area_id, assigned_date, notes } = body;

    if (!area_id || !assigned_date) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'area_id and assigned_date are required',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from('cleaning_tasks')
      .insert({
        area_id,
        assigned_date,
        notes: notes || null,
        status: 'pending',
      })
      .select(CLEANING_AREAS_SELECT)
      .single();

    if (error) {
      logger.error('[Cleaning Tasks API] Database error creating task:', {
        error: error.message,
        code: (error as any).code,
        context: { endpoint: '/api/cleaning-tasks', operation: 'POST', table: 'cleaning_tasks' },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Cleaning task created successfully',
      data,
    });
  } catch (err) {
    logger.error('[Cleaning Tasks API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/cleaning-tasks', method: 'POST' },
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

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, completed_date, notes, photo_url } = body;

    if (!id) {
      return NextResponse.json(
        ApiErrorHandler.createError('Cleaning task ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (completed_date !== undefined) updateData.completed_date = completed_date;
    if (notes !== undefined) updateData.notes = notes;
    if (photo_url !== undefined) updateData.photo_url = photo_url;
    if (status === 'completed' && !completed_date)
      updateData.completed_date = new Date().toISOString();

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from('cleaning_tasks')
      .update(updateData)
      .eq('id', id)
      .select(CLEANING_AREAS_SELECT)
      .single();

    if (error) {
      logger.error('[Cleaning Tasks API] Database error updating task:', {
        error: error.message,
        code: (error as any).code,
        context: { endpoint: '/api/cleaning-tasks', operation: 'PUT', taskId: id },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Cleaning task updated successfully',
      data,
    });
  } catch (err) {
    logger.error('[Cleaning Tasks API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/cleaning-tasks', method: 'PUT' },
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        ApiErrorHandler.createError('Cleaning task ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const { error } = await supabaseAdmin.from('cleaning_tasks').delete().eq('id', id);

    if (error) {
      logger.error('[Cleaning Tasks API] Database error deleting task:', {
        error: error.message,
        code: (error as any).code,
        context: { endpoint: '/api/cleaning-tasks', operation: 'DELETE', taskId: id },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Cleaning task deleted successfully',
    });
  } catch (err) {
    logger.error('[Cleaning Tasks API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/cleaning-tasks', method: 'DELETE' },
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
