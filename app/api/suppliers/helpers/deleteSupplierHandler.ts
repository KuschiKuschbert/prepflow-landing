import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { deleteSupplier } from '../helpers/deleteSupplier';
import { handleSupplierError } from './handleSupplierError';

export async function handleDeleteSupplier(
  request: NextRequest,
  supabase: SupabaseClient,
  userId: string,
) {
  try {
    if (!supabase) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        ApiErrorHandler.createError('Supplier ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    await deleteSupplier(id, userId, supabase);

    return NextResponse.json({
      success: true,
      message: 'Supplier deleted successfully',
    });
  } catch (err: unknown) {
    logger.error('[Suppliers API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/suppliers', method: 'DELETE' },
    });
    if (
      typeof err === 'object' &&
      err !== null &&
      'status' in err &&
      typeof (err as { status: number }).status === 'number'
    ) {
      return NextResponse.json(err, { status: (err as { status: number }).status });
    }
    return handleSupplierError(err, 'DELETE');
  }
}
