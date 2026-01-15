import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { deleteComplianceRecord } from './deleteComplianceRecord';
import { handleComplianceError } from './handleComplianceError';

export async function handleDeleteComplianceRecord(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        ApiErrorHandler.createError('Compliance record ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    await deleteComplianceRecord(id);
    return NextResponse.json({ success: true, message: 'Compliance record deleted successfully' });
  } catch (err: unknown) {
    logger.error('[Compliance Records API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/compliance-records', method: 'DELETE' },
    });
    return handleComplianceError(err, 'DELETE');
  }
}
