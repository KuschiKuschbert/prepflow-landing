import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { getAppError } from '@/lib/utils/error';
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
    const appError = getAppError(err);
    if (appError.status && appError.status !== 500) {
      logger.error('[Cleaning Areas API] Error with status:', {
        error: appError.message,
        status: appError.status,
        context: { endpoint: '/api/cleaning-areas', method: 'DELETE' },
      });
      return NextResponse.json(
        { error: appError.message, code: appError.code },
        { status: appError.status },
      );
    }
    return handleCleaningAreaError(err, 'DELETE');
  }
}
