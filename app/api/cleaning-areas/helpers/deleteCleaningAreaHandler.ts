import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
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
  } catch (err: any) {
    if (err.status) {
      logger.error('[Cleaning Areas API] Error with status:', {
        error: err instanceof Error ? err.message : String(err),
        status: err.status,
        context: { endpoint: '/api/cleaning-areas', method: 'DELETE' },
      });
      return NextResponse.json(err, { status: err.status });
    }
    return handleCleaningAreaError(err, 'DELETE');
  }
}

