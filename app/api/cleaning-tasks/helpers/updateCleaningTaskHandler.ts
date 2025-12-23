import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { updateCleaningTask } from '../helpers/updateCleaningTask';
import { handleCleaningTaskError } from './handleCleaningTaskError';
import { buildUpdateData } from './buildUpdateData';
import { updateCleaningTaskSchema } from './schemas';

export async function handleUpdateCleaningTask(request: NextRequest) {
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

    const validationResult = updateCleaningTaskSchema.safeParse(body);
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

    const { id } = validationResult.data;

    const updateData = buildUpdateData(body);
    const data = await updateCleaningTask(id, updateData);

    return NextResponse.json({
      success: true,
      message: 'Cleaning task updated successfully',
      data,
    });
  } catch (err: any) {
    if (err.status) {
      logger.error('[Cleaning Tasks API] Error with status:', {
        error: err instanceof Error ? err.message : String(err),
        status: err.status,
        context: { endpoint: '/api/cleaning-tasks', method: 'PUT' },
      });
      return NextResponse.json(err, { status: err.status });
    }
    return handleCleaningTaskError(err, 'PUT');
  }
}
