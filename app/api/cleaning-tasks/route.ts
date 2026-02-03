import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { handleCreateCleaningTask } from './helpers/createCleaningTaskHandler';
import { handleDeleteCleaningTask } from './helpers/deleteCleaningTaskHandler';
import { handleCleaningTaskError } from './helpers/handleCleaningTaskError';
import { handleGetRequest } from './helpers/handleGetRequest';
import { handleUpdateCleaningTask } from './helpers/updateCleaningTaskHandler';

async function getAuthenticatedUser(request: NextRequest) {
  const supabaseAdmin = createSupabaseAdmin();

  // Authenticate user
  const {
    data: { user },
    error: authError,
  } = await supabaseAdmin.auth.getUser(
    request.headers.get('Authorization')?.replace('Bearer ', '') || '',
  );

  // Fallback/Use Auth0 helper
  const { requireAuth } = await import('@/lib/auth0-api-helpers');
  const authUser = await requireAuth(request);

  // Get user_id from email
  const { data: userData, error: userError } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', authUser.email)
    .single();

  if (userError || !userData) {
    throw ApiErrorHandler.createError('User not found', 'NOT_FOUND', 404);
  }
  return { userId: userData.id, supabase: supabaseAdmin };
}

/**
 * GET /api/cleaning-tasks
 * Get cleaning tasks with optional filters and date range
 */
export async function GET(request: NextRequest) {
  try {
    const { userId, supabase } = await getAuthenticatedUser(request);

    const { searchParams } = new URL(request.url);

    return handleGetRequest(supabase, {
      userId,
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
  try {
    const { userId, supabase } = await getAuthenticatedUser(request);
    return handleCreateCleaningTask(supabase, request, userId);
  } catch (err) {
    if (err instanceof NextResponse) return err;
    if (err && typeof err === 'object' && 'status' in err) {
      return NextResponse.json(err, { status: (err as { status: number }).status || 500 });
    }
    return handleCleaningTaskError(err, 'POST');
  }
}

/**
 * PUT /api/cleaning-tasks
 * Update an existing cleaning task
 */
export async function PUT(request: NextRequest) {
  try {
    const { userId, supabase } = await getAuthenticatedUser(request);
    return handleUpdateCleaningTask(supabase, request, userId);
  } catch (err) {
    if (err instanceof NextResponse) return err;
    if (err && typeof err === 'object' && 'status' in err) {
      return NextResponse.json(err, { status: (err as { status: number }).status || 500 });
    }
    return handleCleaningTaskError(err, 'PUT');
  }
}

/**
 * DELETE /api/cleaning-tasks
 * Delete a cleaning task
 */
export async function DELETE(request: NextRequest) {
  try {
    const { userId, supabase } = await getAuthenticatedUser(request);
    return handleDeleteCleaningTask(supabase, request, userId);
  } catch (err) {
    if (err instanceof NextResponse) return err;
    if (err && typeof err === 'object' && 'status' in err) {
      return NextResponse.json(err, { status: (err as { status: number }).status || 500 });
    }
    return handleCleaningTaskError(err, 'DELETE');
  }
}
