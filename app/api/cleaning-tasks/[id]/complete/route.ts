import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const completeTaskSchema = z.object({
  completion_date: z.string().min(1, 'completion_date is required'),
  notes: z.string().optional(),
  photo_url: z.string().url().optional().or(z.literal('')),
});

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

    const validationResult = completeTaskSchema.safeParse(body);
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

    const { completion_date, notes, photo_url } = validationResult.data;

    // Verify task exists
    const { data: task, error: taskError } = await supabaseAdmin
      .from('cleaning_tasks')
      .select('id')
      .eq('id', id)
      .single();

    if (taskError || !task) {
      if (taskError && taskError.code !== 'PGRST116') {
        logger.warn('[Cleaning Tasks API] Error checking if task exists:', {
          error: taskError.message,
          code: taskError.code,
          taskId: id,
        });
      }
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
        code: error.code,
        taskId: id,
        context: {
          endpoint: '/api/cleaning-tasks/[id]/complete',
          operation: 'POST',
          table: 'cleaning_task_completions',
        },
      });

      // Handle missing table gracefully
      if (error.code === '42P01') {
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
  } catch (err: unknown) {
    logger.error('[Cleaning Tasks API] Error in complete endpoint:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/cleaning-tasks/[id]/complete', method: 'POST' },
    });
    if (err && typeof err === 'object' && 'status' in err && typeof (err as { status: unknown }).status === 'number') {
      return NextResponse.json(err, { status: (err as { status: number }).status || 500 });
    }
    return NextResponse.json(
      ApiErrorHandler.createError(
        'Internal server error',
        'SERVER_ERROR',
        500,
        err instanceof Error ? err.message : String(err),
      ),
      { status: 500 },
    );
  }
}
