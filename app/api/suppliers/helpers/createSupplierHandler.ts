import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { createSupplier } from '../helpers/createSupplier';
import { handleSupplierError } from './handleSupplierError';
import { createSupplierSchema } from './schemas';

export async function handleCreateSupplier(
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

    let body: unknown;
    try {
      body = await request.json();
    } catch (err) {
      logger.warn('[Suppliers API] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const validationResult = createSupplierSchema.safeParse(body);
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

    const data = await createSupplier(validationResult.data, userId, supabase);

    return NextResponse.json({
      success: true,
      message: 'Supplier created successfully',
      data,
    });
  } catch (err: unknown) {
    logger.error('[Suppliers API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/suppliers', method: 'POST' },
    });
    if (
      typeof err === 'object' &&
      err !== null &&
      'status' in err &&
      typeof (err as { status: number }).status === 'number'
    ) {
      return NextResponse.json(err, { status: (err as { status: number }).status });
    }
    return handleSupplierError(err, 'POST');
  }
}
