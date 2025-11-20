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

/**
 * GET /api/cleaning-tasks
 * Get cleaning tasks with optional filters
 *
 * @param {NextRequest} request - Request object
 * @param {string} [request.url.searchParams.area_id] - Filter by area ID
 * @param {string} [request.url.searchParams.status] - Filter by status
 * @param {string} [request.url.searchParams.date] - Filter by assigned date
 * @returns {Promise<NextResponse>} List of cleaning tasks with area details
 */
export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500), { status: 500 });
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

/**
 * POST /api/cleaning-tasks
 * Create a new cleaning task
 *
 * @param {NextRequest} request - Request object
 * @param {Object} request.body - Request body
 * @param {string} request.body.area_id - Area ID (required)
 * @param {string} request.body.assigned_date - Assigned date (required)
 * @param {string} [request.body.notes] - Task notes
 * @returns {Promise<NextResponse>} Created cleaning task
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { area_id, assigned_date, notes } = body;

    if (!area_id || !assigned_date) {
      return NextResponse.json(ApiErrorHandler.createError('area_id and assigned_date are required', 'VALIDATION_ERROR', 400), { status: 400 });
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

/**
 * PUT /api/cleaning-tasks
 * Update an existing cleaning task
 *
 * @param {NextRequest} request - Request object
 * @param {Object} request.body - Request body
 * @param {string} request.body.id - Cleaning task ID (required)
 * @param {string} [request.body.status] - Task status
 * @param {string} [request.body.completed_date] - Completion date
 * @param {string} [request.body.notes] - Task notes
 * @param {string} [request.body.photo_url] - Photo URL
 * @returns {Promise<NextResponse>} Updated cleaning task
 */
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

/**
 * DELETE /api/cleaning-tasks
 * Delete a cleaning task
 *
 * @param {NextRequest} request - Request object
 * @param {string} request.url.searchParams.id - Cleaning task ID (required)
 * @returns {Promise<NextResponse>} Deletion response
 */
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
