import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { deleteCleaningTask } from './deleteCleaningTask';
import { handleCleaningTaskError } from './handleCleaningTaskError';

export async function handleDeleteCleaningTask(
  supabase: SupabaseClient,
  request: NextRequest,
  userId: string,
) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        ApiErrorHandler.createError('Cleaning task ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    await deleteCleaningTask(supabase, id, userId);
    return NextResponse.json({ success: true, message: 'Cleaning task deleted successfully' });
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'status' in err) {
      const status = (err as { status: unknown }).status;
      if (typeof status === 'number') {
        logger.error('[Cleaning Tasks API] Error with status:', {
          error: err instanceof Error ? err.message : String(err),
          status: status,
          context: { endpoint: '/api/cleaning-tasks', method: 'DELETE' },
        });
        return NextResponse.json(err, { status });
      }
    }
    return handleCleaningTaskError(err, 'DELETE');
  }
}
