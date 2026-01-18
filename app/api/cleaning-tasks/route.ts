import { standardAdminChecks } from '@/lib/admin-auth';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { handleCreateCleaningTask } from './helpers/createCleaningTaskHandler';
import { handleDeleteCleaningTask } from './helpers/deleteCleaningTaskHandler';
import { handleCleaningTaskError } from './helpers/handleCleaningTaskError';
import { handleGetRequest } from './helpers/handleGetRequest';
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
    const { supabase, error } = await standardAdminChecks(request);
    if (error) return error;
    if (!supabase) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });

    const { searchParams } = new URL(request.url);

    return handleGetRequest(supabase, {
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
  } catch (err: unknown) {
    if (err instanceof NextResponse) return err;

    logger.error('[Cleaning Tasks API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/cleaning-tasks', method: 'GET' },
    });
    if (err && typeof err === 'object' && 'status' in err) {
      return NextResponse.json(err, { status: (err as { status: number }).status || 500 });
    }
    return handleCleaningTaskError(err, 'GET');
  }
}

/**
 * POST /api/cleaning-tasks
 * Create a new cleaning task
 */
export async function POST(request: NextRequest) {
  const { supabase, error } = await standardAdminChecks(request);
  if (error) return error;
  if (!supabase) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
  return handleCreateCleaningTask(supabase, request);
}

/**
 * PUT /api/cleaning-tasks
 * Update an existing cleaning task
 */
export async function PUT(request: NextRequest) {
  const { supabase, error } = await standardAdminChecks(request);
  if (error) return error;
  if (!supabase) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
  return handleUpdateCleaningTask(supabase, request);
}

/**
 * DELETE /api/cleaning-tasks
 * Delete a cleaning task
 */
export async function DELETE(request: NextRequest) {
  const { supabase, error } = await standardAdminChecks(request);
  if (error) return error;
  if (!supabase) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
  return handleDeleteCleaningTask(supabase, request);
}
