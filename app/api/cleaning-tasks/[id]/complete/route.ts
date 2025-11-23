import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/cleaning-tasks/[id]/complete
 * Mark a cleaning task as complete for a specific date
 *
 * @param {NextRequest} request - Request object
 * @param {Object} context - Route context
 * @param {Promise<{id: string}>} context.params - Route parameters
 * @param {Object} request.body - Request body
 * @param {string} request.body.completion_date - Date task was completed (ISO date string, required)
 * @param {string} [request.body.notes] - Completion notes
 * @param {string} [request.body.photo_url] - Photo URL for verification
 * @returns {Promise<NextResponse>} Completion record
 */
export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const body = await request.json();
    const { completion_date, notes, photo_url } = body;

    if (!completion_date) {
      return NextResponse.json(
        ApiErrorHandler.createError('completion_date is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    // Verify task exists
    const { data: task, error: taskError } = await supabaseAdmin
      .from('cleaning_tasks')
      .select('id')
      .eq('id', id)
      .single();

    if (taskError || !task) {
      return NextResponse.json(
        ApiErrorHandler.createError('Cleaning task not found', 'NOT_FOUND', 404),
        { status: 404 },
      );
    }

    // Insert or update completion (upsert)
    const { data, error } = await supabaseAdmin
      .from('cleaning_task_completions')
      .upsert(
        {
          task_id: id,
          completion_date,
          notes: notes || null,
          photo_url: photo_url || null,
          completed_at: new Date().toISOString(),
        },
        {
          onConflict: 'task_id,completion_date',
        },
      )
      .select()
      .single();

    if (error) {
      logger.error('[Cleaning Tasks API] Database error creating completion:', {
        error: error.message,
        code: (error as any).code,
        context: {
          endpoint: '/api/cleaning-tasks/[id]/complete',
          operation: 'POST',
          table: 'cleaning_task_completions',
        },
      });

      // Handle missing table gracefully
      if ((error as any).code === '42P01') {
        return NextResponse.json(
          ApiErrorHandler.createError(
            'Completion table does not exist. Please run database migration.',
            'DATABASE_ERROR',
            500,
          ),
          { status: 500 },
        );
      }

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Task marked as complete',
      data,
    });
  } catch (err: any) {
    logger.error('[Cleaning Tasks API] Error in complete endpoint:', err);
    if (err && typeof err === 'object' && 'status' in err) {
      return NextResponse.json(err, { status: err.status || 500 });
    }
    return NextResponse.json(
      ApiErrorHandler.createError('Internal server error', 'INTERNAL_ERROR', 500),
      { status: 500 },
    );
  }
}
