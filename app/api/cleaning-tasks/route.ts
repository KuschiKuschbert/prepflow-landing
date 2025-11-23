import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { createCleaningTask } from './helpers/createCleaningTask';
import { deleteCleaningTask } from './helpers/deleteCleaningTask';
import { handleCleaningTaskError } from './helpers/handleCleaningTaskError';
import { updateCleaningTask } from './helpers/updateCleaningTask';

const CLEANING_TASKS_SELECT = `
  *,
  cleaning_areas (
    id,
    area_name,
    description,
    cleaning_frequency
  ),
  temperature_equipment:equipment_id (
    id,
    name,
    equipment_type,
    location
  ),
  kitchen_sections:section_id (
    id,
    section_name,
    description
  )
`;

/**
 * GET /api/cleaning-tasks
 * Get cleaning tasks with optional filters and date range
 *
 * @param {NextRequest} request - Request object
 * @param {string} [request.url.searchParams.start_date] - Start date for date range (ISO date string)
 * @param {string} [request.url.searchParams.end_date] - End date for date range (ISO date string)
 * @param {string} [request.url.searchParams.area_id] - Filter by area ID
 * @param {string} [request.url.searchParams.equipment_id] - Filter by equipment ID
 * @param {string} [request.url.searchParams.section_id] - Filter by section ID
 * @param {string} [request.url.searchParams.frequency_type] - Filter by frequency type
 * @param {string} [request.url.searchParams.status] - Filter by status (legacy)
 * @param {string} [request.url.searchParams.date] - Filter by assigned date (legacy)
 * @param {number} [request.url.searchParams.page] - Page number for pagination
 * @param {number} [request.url.searchParams.pageSize] - Page size for pagination
 * @returns {Promise<NextResponse>} List of cleaning tasks with completions for date range
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
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const areaId = searchParams.get('area_id');
    const equipmentId = searchParams.get('equipment_id');
    const sectionId = searchParams.get('section_id');
    const frequencyType = searchParams.get('frequency_type');
    const status = searchParams.get('status');
    const date = searchParams.get('date');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '100', 10);

    // Build query for tasks
    let query = supabaseAdmin.from('cleaning_tasks').select(CLEANING_TASKS_SELECT);

    // Apply filters
    if (areaId) query = query.eq('area_id', areaId);
    if (equipmentId) query = query.eq('equipment_id', equipmentId);
    if (sectionId) query = query.eq('section_id', sectionId);
    if (frequencyType) query = query.eq('frequency_type', frequencyType);
    if (status) query = query.eq('status', status);
    if (date) query = query.eq('assigned_date', date);

    // Order by task name
    query = query.order('task_name', { ascending: true });

    // If date range provided, don't paginate (we need all tasks for the range)
    if (startDate && endDate) {
      const { data: tasks, error: tasksError } = await query;

      if (tasksError) {
        const errorCode = (tasksError as any).code;

        if (errorCode === '42P01') {
          logger.dev('[Cleaning Tasks API] Table does not exist, returning empty array');
          return NextResponse.json({
            success: true,
            data: [],
            total: 0,
          });
        }

        logger.error('[Cleaning Tasks API] Database error fetching tasks:', {
          error: tasksError.message,
          code: errorCode,
          context: { endpoint: '/api/cleaning-tasks', operation: 'GET', table: 'cleaning_tasks' },
        });

        const apiError = ApiErrorHandler.fromSupabaseError(tasksError, 500);
        return NextResponse.json(apiError, { status: apiError.status || 500 });
      }

      // Fetch completions for date range
      const taskIds = (tasks || []).map((t: any) => t.id);
      let completionsQuery = supabaseAdmin
        .from('cleaning_task_completions')
        .select('*')
        .gte('completion_date', startDate)
        .lte('completion_date', endDate);

      if (taskIds.length > 0) {
        completionsQuery = completionsQuery.in('task_id', taskIds);
      }

      const { data: completions, error: completionsError } = await completionsQuery;

      if (completionsError && (completionsError as any).code !== '42P01') {
        logger.error('[Cleaning Tasks API] Database error fetching completions:', {
          error: completionsError.message,
          code: (completionsError as any).code,
        });
      }

      // Group completions by task_id
      const completionsByTask = new Map<string, any[]>();
      (completions || []).forEach((c: any) => {
        if (!completionsByTask.has(c.task_id)) {
          completionsByTask.set(c.task_id, []);
        }
        completionsByTask.get(c.task_id)!.push(c);
      });

      // Attach completions to tasks
      const tasksWithCompletions = (tasks || []).map((task: any) => ({
        ...task,
        completions: completionsByTask.get(task.id) || [],
      }));

      return NextResponse.json({
        success: true,
        data: tasksWithCompletions,
        total: tasksWithCompletions.length,
      });
    }

    // Legacy pagination support (when no date range)
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { count, error: countError } = await supabaseAdmin
      .from('cleaning_tasks')
      .select('*', { count: 'exact', head: true });

    if (countError && (countError as any).code !== '42P01') {
      logger.error('[Cleaning Tasks API] Database error fetching count:', {
        error: countError.message,
        code: (countError as any).code,
      });
    }

    query = query.range(from, to);
    const { data, error } = await query;

    if (error) {
      const errorCode = (error as any).code;

      if (errorCode === '42P01') {
        logger.dev('[Cleaning Tasks API] Table does not exist, returning empty array');
        return NextResponse.json({
          success: true,
          data: [],
          total: 0,
        });
      }

      logger.error('[Cleaning Tasks API] Database error fetching tasks:', {
        error: error.message,
        code: errorCode,
        context: { endpoint: '/api/cleaning-tasks', operation: 'GET', table: 'cleaning_tasks' },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      total: count || 0,
    });
  } catch (err: any) {
    if (err && typeof err === 'object' && 'status' in err) {
      return NextResponse.json(err, { status: err.status || 500 });
    }
    return handleCleaningTaskError(err, 'GET');
  }
}

/**
 * POST /api/cleaning-tasks
 * Create a new cleaning task
 *
 * @param {NextRequest} request - Request object
 * @param {Object} request.body - Request body
 * @param {string} request.body.task_name - Task name (required)
 * @param {string} request.body.frequency_type - Frequency type: daily, bi-daily, weekly, monthly, 3-monthly (required)
 * @param {string} [request.body.area_id] - Area ID (legacy, optional)
 * @param {string} [request.body.assigned_date] - Assigned date (legacy, optional for auto-repeating tasks)
 * @param {string} [request.body.equipment_id] - Equipment ID (optional)
 * @param {string} [request.body.section_id] - Section ID (optional)
 * @param {boolean} [request.body.is_standard_task] - Whether this is a standard task
 * @param {string} [request.body.standard_task_type] - Standard task type
 * @param {string} [request.body.description] - Task description
 * @param {string} [request.body.notes] - Task notes
 * @returns {Promise<NextResponse>} Created cleaning task
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      task_name,
      frequency_type,
      area_id,
      assigned_date,
      equipment_id,
      section_id,
      is_standard_task,
      standard_task_type,
      description,
      notes,
    } = body;

    // Area is always required
    if (!area_id) {
      return NextResponse.json(
        ApiErrorHandler.createError('area_id is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    // Task name and frequency type are required for new schema
    if (!task_name) {
      return NextResponse.json(
        ApiErrorHandler.createError('task_name is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    if (!frequency_type) {
      return NextResponse.json(
        ApiErrorHandler.createError('frequency_type is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const data = await createCleaningTask({
      task_name,
      frequency_type,
      area_id,
      assigned_date,
      equipment_id,
      section_id,
      is_standard_task: is_standard_task || false,
      standard_task_type,
      description,
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
    return NextResponse.json({ success: true, message: 'Cleaning task deleted successfully' });
  } catch (err: any) {
    if (err.status) return NextResponse.json(err, { status: err.status });
    return handleCleaningTaskError(err, 'DELETE');
  }
}
