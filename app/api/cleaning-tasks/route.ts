import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { handleCleaningTaskError } from './helpers/handleCleaningTaskError';
import { handleGetRequest } from './helpers/handleGetRequest';
import { createCleaningTaskSchema, updateCleaningTaskSchema } from './helpers/schemas';
import { handleDeleteCleaningTask } from './helpers/deleteCleaningTaskHandler';
import { handleCreateCleaningTask } from './helpers/createCleaningTaskHandler';
import { handleUpdateCleaningTask } from './helpers/updateCleaningTaskHandler';

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

    return handleGetRequest({
      startDate: searchParams.get('start_date'),
      endDate: searchParams.get('end_date'),
      areaId: searchParams.get('area_id'),
      equipmentId: searchParams.get('equipment_id'),
      sectionId: searchParams.get('section_id'),
      frequencyType: searchParams.get('frequency_type'),
      status: searchParams.get('status'),
      date: searchParams.get('date'),
      page: parseInt(searchParams.get('page') || '1', 10),
      pageSize: parseInt(searchParams.get('pageSize') || '100', 10),
    });
  } catch (err: any) {
    logger.error('[Cleaning Tasks API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/cleaning-tasks', method: 'GET' },
    });
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
  return handleCreateCleaningTask(request);
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
  return handleUpdateCleaningTask(request);
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
  return handleDeleteCleaningTask(request);
}
