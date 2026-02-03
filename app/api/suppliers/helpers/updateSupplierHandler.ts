import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { updateSupplier } from '../helpers/updateSupplier';
import { handleSupplierError } from './handleSupplierError';
import { updateSupplierSchema } from './schemas';

export async function handleUpdateSupplier(
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

    const validationResult = updateSupplierSchema.safeParse(body);
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

    const { id, ...updates } = validationResult.data;
    const data = await updateSupplier(id, updates, userId, supabase);

    return NextResponse.json({
      success: true,
      message: 'Supplier updated successfully',
      data,
    });
  } catch (err: unknown) {
    logger.error('[Suppliers API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/suppliers', method: 'PUT' },
    });
    if (err && typeof err === 'object' && 'status' in err) {
      return NextResponse.json(err, { status: (err as { status: number }).status });
    }
    return handleSupplierError(err, 'PUT');
  }
}
