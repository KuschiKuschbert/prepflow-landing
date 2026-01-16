import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { handlePriceListError } from './handlePriceListError';

export async function handleDeletePriceList(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        ApiErrorHandler.createError('ID is required', 'VALIDATION_ERROR', 400, {
          message: 'Please provide an ID for the supplier price list to delete',
        }),
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const { error } = await supabaseAdmin.from('supplier_price_lists').delete().eq('id', id);

    if (error) {
      logger.error('[Supplier Price Lists API] Database error deleting:', {
        error: error.message,
        code: (error as unknown).code,
        context: { endpoint: '/api/supplier-price-lists', operation: 'DELETE', id },
      });
      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Supplier price list deleted successfully',
    });
  } catch (error) {
    logger.error('[route.ts] Error in catch block:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return handlePriceListError(error, 'DELETE');
  }
}
