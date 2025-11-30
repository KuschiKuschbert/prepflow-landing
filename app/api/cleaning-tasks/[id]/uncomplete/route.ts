import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/cleaning-tasks/[id]/uncomplete
 * Remove completion for a cleaning task on a specific date
 *
 * @param {NextRequest} request - Request object
 * @param {Object} context - Route context
 * @param {Promise<{id: string}>} context.params - Route parameters
 * @param {Object} request.body - Request body
 * @param {string} request.body.completion_date - Date to remove completion for (ISO date string, required)
 * @returns {Promise<NextResponse>} Success response
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
    const { completion_date } = body;

    if (!completion_date) {
      return NextResponse.json(
        ApiErrorHandler.createError('completion_date is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    // Delete completion
    const { error } = await supabaseAdmin
      .from('cleaning_task_completions')
      .delete()
      .eq('task_id', id)
      .eq('completion_date', completion_date);

    if (error) {
      logger.error('[Cleaning Tasks API] Database error removing completion:', {
        error: error.message,
        code: (error as any).code,
        context: {
          endpoint: '/api/cleaning-tasks/[id]/uncomplete',
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
      message: 'Task completion removed',
    });
  } catch (err: any) {
    logger.error('[Cleaning Tasks API] Error in uncomplete endpoint:', err);
    if (err && typeof err === 'object' && 'status' in err) {
      return NextResponse.json(err, { status: err.status || 500 });
    }
    return NextResponse.json(
      ApiErrorHandler.createError('Internal server error', 'INTERNAL_ERROR', 500),
      { status: 500 },
    );
  }
}


