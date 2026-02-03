import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { createCleaningTask } from '../helpers/createCleaningTask';
import { handleCleaningTaskError } from './handleCleaningTaskError';
import { createCleaningTaskSchema } from './schemas';

export async function handleCreateCleaningTask(
  supabase: SupabaseClient,
  request: NextRequest,
  userId: string,
) {
  try {
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

    const validationResult = createCleaningTaskSchema.safeParse(body);
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

    const taskData = validationResult.data;

    const data = await createCleaningTask(
      supabase,
      {
        ...taskData,
        is_standard_task: taskData.is_standard_task || false,
      },
      userId,
    );

    return NextResponse.json({
      success: true,
      message: 'Cleaning task created successfully',
      data,
    });
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'status' in err) {
      const status = (err as { status: unknown }).status;
      if (typeof status === 'number') {
        logger.error('[Cleaning Tasks API] Error with status:', {
          error: err instanceof Error ? err.message : String(err),
          status: status,
          context: { endpoint: '/api/cleaning-tasks', method: 'POST' },
        });
        return NextResponse.json(err, { status });
      }
    }
    return handleCleaningTaskError(err, 'POST');
  }
}
