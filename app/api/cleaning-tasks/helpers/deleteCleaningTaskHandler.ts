import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { deleteCleaningTask } from './deleteCleaningTask';
import { handleCleaningTaskError } from './handleCleaningTaskError';

export async function handleDeleteCleaningTask(request: NextRequest) {
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
    if (err.status) {
      logger.error('[Cleaning Tasks API] Error with status:', {
        error: err instanceof Error ? err.message : String(err),
        status: err.status,
        context: { endpoint: '/api/cleaning-tasks', method: 'DELETE' },
      });
      return NextResponse.json(err, { status: err.status });
    }
    return handleCleaningTaskError(err, 'DELETE');
  }
}
