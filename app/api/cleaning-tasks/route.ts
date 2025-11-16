import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { createCleaningTask } from './helpers/createCleaningTask';
import { deleteCleaningTask } from './helpers/deleteCleaningTask';
import { handleCleaningTaskError } from './helpers/handleCleaningTaskError';
import { updateCleaningTask } from './helpers/updateCleaningTask';

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
    return handleCleaningTaskError(err, 'GET');
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

    const data = await createCleaningTask({
      area_id,
      assigned_date,
      notes,
    });

    return NextResponse.json({
      success: true,
      message: 'Cleaning task created successfully',
      data,
    });
  } catch (err: any) {
    if (err.status) {
      return NextResponse.json(err, { status: err.status });
    }
    return handleCleaningTaskError(err, 'POST');
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

    const data = await updateCleaningTask(id, updateData);

    return NextResponse.json({
      success: true,
      message: 'Cleaning task updated successfully',
      data,
    });
  } catch (err: any) {
    if (err.status) {
      return NextResponse.json(err, { status: err.status });
    }
    return handleCleaningTaskError(err, 'PUT');
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

    await deleteCleaningTask(id);

    return NextResponse.json({
      success: true,
      message: 'Cleaning task deleted successfully',
    });
  } catch (err: any) {
    if (err.status) {
      return NextResponse.json(err, { status: err.status });
    }
    return handleCleaningTaskError(err, 'DELETE');
  }
}
