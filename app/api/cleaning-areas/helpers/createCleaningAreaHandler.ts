import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { createCleaningArea } from '../helpers/createCleaningArea';
import { handleCleaningAreaError } from './handleCleaningAreaError';
import { createCleaningAreaSchema } from './schemas';

export async function handleCreateCleaningArea(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch (err) {
      logger.warn('[Cleaning Areas API] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const validationResult = createCleaningAreaSchema.safeParse(body);
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

    const { area_name, description, cleaning_frequency } = validationResult.data;

    const data = await createCleaningArea({
      area_name,
      description,
      cleaning_frequency,
    });

    return NextResponse.json({
      success: true,
      message: 'Cleaning area created successfully',
      data,
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
        context: { endpoint: '/api/cleaning-areas', method: 'POST' },
      });
      return NextResponse.json(err, { status: errorWithStatus.status });
    }
    return handleCleaningAreaError(err, 'POST');
  }
}
