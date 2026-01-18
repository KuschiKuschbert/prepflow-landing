import { standardAdminChecks } from '@/lib/admin-auth';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const uncompleteTaskSchema = z.object({
  completion_date: z.string().min(1, 'completion_date is required'),
});

/**
 * POST /api/cleaning-tasks/[id]/uncomplete
 * Remove completion for a cleaning task on a specific date
 */
export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { supabase, error } = await standardAdminChecks(request);
    if (error) return error;
    if (!supabase) throw new Error('Unexpected database state');

    const { id } = await context.params;

    let body: unknown;
    try {
      body = await request.json();
    } catch (err) {
      logger.warn('[Cleaning Tasks API] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const validationResult = uncompleteTaskSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          validationResult.error.issues[0]?.message || 'Invalid request body',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    const { completion_date } = validationResult.data;

    // Delete completion
    const { error: deleteError } = await supabase
      .from('cleaning_task_completions')
      .delete()
      .eq('task_id', id)
      .eq('completion_date', completion_date);

    if (deleteError) {
      logger.error('[Cleaning Tasks API] Database error removing completion:', {
        error: deleteError.message,
        code: deleteError.code,
        context: {
          endpoint: '/api/cleaning-tasks/[id]/uncomplete',
          operation: 'POST',
          table: 'cleaning_task_completions',
        },
      });

      // Handle missing table gracefully
      if (deleteError.code === '42P01') {
        return NextResponse.json(
          ApiErrorHandler.createError(
            'Completion table does not exist. Please run database migration.',
            'DATABASE_ERROR',
            500,
          ),
          { status: 500 },
        );
      }

      const apiError = ApiErrorHandler.fromSupabaseError(deleteError, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Task completion removed',
    });
  } catch (err: unknown) {
    logger.error('[Cleaning Tasks API] Error in uncomplete endpoint:', err);
    if (
      err &&
      typeof err === 'object' &&
      'status' in err &&
      typeof (err as { status: unknown }).status === 'number'
    ) {
      return NextResponse.json(err, { status: (err as { status: number }).status || 500 });
    }
    return NextResponse.json(
      ApiErrorHandler.createError('Internal server error', 'INTERNAL_ERROR', 500),
      { status: 500 },
    );
  }
}
