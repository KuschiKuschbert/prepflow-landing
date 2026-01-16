import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { deleteSupplier } from '../helpers/deleteSupplier';
import { handleSupplierError } from './handleSupplierError';

export async function handleDeleteSupplier(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        ApiErrorHandler.createError('Supplier ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    await deleteSupplier(id);

    return NextResponse.json({
      success: true,
      message: 'Supplier deleted successfully',
    });
  } catch (err: unknown) {
    logger.error('[Suppliers API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/suppliers', method: 'DELETE' },
    });
    if (err.status) {
      return NextResponse.json(err, { status: err.status });
    }
    return handleSupplierError(err, 'DELETE');
  }
}
