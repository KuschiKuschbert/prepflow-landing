import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { createPriceList } from './createPriceList';
import { handlePriceListError } from './handlePriceListError';
import { createPriceListSchema } from './schemas';
import { setCurrentPriceList } from './setCurrentPriceList';
import { validatePriceListCreate } from './validatePriceListCreate';

export async function handleCreatePriceList(request: NextRequest, supabase: SupabaseClient) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch (err) {
      logger.warn('[Supplier Price Lists API] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const zodValidation = createPriceListSchema.safeParse(body);
    if (!zodValidation.success) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          zodValidation.error.issues[0]?.message || 'Invalid request data',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    const validatedBody = zodValidation.data;
    const { supplier_id, document_name, document_url, effective_date, expiry_date, notes } =
      validatedBody;

    // Validate request (keep helper validation for additional checks)
    const validationError = validatePriceListCreate(validatedBody);
    if (validationError) return validationError;

    if (!supabase) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // If this is marked as current, set all other price lists for this supplier as not current
    if (validatedBody.is_current !== false) {
      await setCurrentPriceList(supplier_id, null, supabase);
    }

    // document_url is required, so ensure it's not null/undefined
    if (!document_url) {
      return NextResponse.json(
        ApiErrorHandler.createError('Document URL is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const data = await createPriceList(
      {
        supplier_id,
        document_name,
        document_url,
        effective_date: effective_date || null,
        expiry_date: expiry_date || null,
        is_current: validatedBody.is_current !== false,
        notes: notes || null,
      },
      supabase,
    );

    return NextResponse.json({
      success: true,
      message: 'Supplier price list created successfully',
      data,
    });
  } catch (error: unknown) {
    const err = error as { message?: string; code?: string };
    if (err.message) {
      logger.error('[Supplier Price Lists API] Database error creating:', {
        error: err.message,
        code: err.code,
        context: { endpoint: '/api/supplier-price-lists', operation: 'POST' },
      });
      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }
    return handlePriceListError(error, 'POST');
  }
}
