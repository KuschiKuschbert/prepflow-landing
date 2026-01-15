import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { deleteCleaningArea } from './deleteCleaningArea';
import { handleCleaningAreaError } from './handleCleaningAreaError';

export async function handleDeleteCleaningArea(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        ApiErrorHandler.createError('Cleaning area ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    await deleteCleaningArea(id);

    return NextResponse.json({
      success: true,
      message: 'Cleaning area deleted successfully',
    });
  } catch (err: unknown) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'status' in err &&
      typeof (err as { status: unknown }).status === 'number'
    ) {
      const errorWithStatus = err as { status: number; message: string };
      logger.error('[Cleaning Areas API] Error with status:', {
        error: errorWithStatus.message || String(err),
        status: errorWithStatus.status,
        context: { endpoint: '/api/cleaning-areas', method: 'DELETE' },
      });
      return NextResponse.json(err, { status: errorWithStatus.status });
    }
    return handleCleaningAreaError(err, 'DELETE');
  }
}
