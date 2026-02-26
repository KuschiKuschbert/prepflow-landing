import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { buildPriceListUpdateData } from './buildUpdateData';
import { handlePriceListError } from './handlePriceListError';
import { setCurrentPriceList } from './setCurrentPriceList';
import { updatePriceList } from './updatePriceList';

export async function handleUpdatePriceList(request: NextRequest, supabase: SupabaseClient) {
  const body = await request.json();
  const { id, is_current } = body;
  try {
    if (!id) {
      return NextResponse.json(
        ApiErrorHandler.createError('ID is required', 'VALIDATION_ERROR', 400, {
          message: 'Please provide an ID for the supplier price list to update',
        }),
        { status: 400 },
      );
    }

    if (!supabase) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // If this is being set as current, set all other price lists for this supplier as not current
    if (is_current === true) {
      const { data: currentRecord, error: fetchError } = await supabase
        .from('supplier_price_lists')
        .select('supplier_id')
        .eq('id', id)
        .single();
      if (fetchError) {
        logger.error('[Supplier Price Lists] Failed to fetch current record for set-current', {
          error: fetchError,
          id,
        });
        return NextResponse.json(
          ApiErrorHandler.createError('Failed to fetch price list', 'DATABASE_ERROR', 500),
          { status: 500 },
        );
      }
      if (currentRecord) await setCurrentPriceList(currentRecord.supplier_id, id, supabase);
    }

    // Build update data
    const updateData = buildPriceListUpdateData(body);

    const data = await updatePriceList(id, updateData, supabase);

    return NextResponse.json({
      success: true,
      message: 'Supplier price list updated successfully',
      data,
    });
  } catch (error: unknown) {
    const err = error as { message?: string; code?: string };
    if (err.message) {
      logger.error('[Supplier Price Lists API] Database error updating:', {
        error: err.message,
        code: err.code,
        context: { endpoint: '/api/supplier-price-lists', operation: 'PUT', id },
      });
      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }
    return handlePriceListError(error, 'PUT');
  }
}
