import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { createComplianceRecord } from './createComplianceRecord';
import { handleComplianceError } from './handleComplianceError';
import { createComplianceRecordSchema } from './schemas';

export async function handleCreateComplianceRecord(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch (err) {
      logger.warn('[Compliance Records API] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const validationResult = createComplianceRecordSchema.safeParse(body);
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

    const data = await createComplianceRecord(validationResult.data);

    return NextResponse.json({
      success: true,
      message: 'Compliance record created successfully',
      data,
    });
  } catch (err: unknown) {

    return handleComplianceError(err, 'POST');
  }
}
