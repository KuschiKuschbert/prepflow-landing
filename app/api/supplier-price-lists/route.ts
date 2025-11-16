import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { buildPriceListQuery } from './helpers/buildPriceListQuery';
import { buildPriceListUpdateData } from './helpers/buildUpdateData';
import { createPriceList } from './helpers/createPriceList';
import { handlePriceListError } from './helpers/handlePriceListError';
import { setCurrentPriceList } from './helpers/setCurrentPriceList';
import { updatePriceList } from './helpers/updatePriceList';
import { validatePriceListCreate } from './helpers/validatePriceListCreate';

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const { searchParams } = new URL(request.url);
    const supplierId = searchParams.get('supplier_id');
    const current = searchParams.get('current');

    const query = buildPriceListQuery(supplierId, current);
    const { data, error } = await query;

    if (error) {
      logger.error('[Supplier Price Lists API] Database error:', {
        error: error.message,
        code: (error as any).code,
        context: { endpoint: '/api/supplier-price-lists', operation: 'GET' },
      });
      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    return handlePriceListError(error, 'GET');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { supplier_id, document_name, document_url, effective_date, expiry_date, notes } = body;

    // Validate request
    const validationError = validatePriceListCreate(body);
    if (validationError) return validationError;

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // If this is marked as current, set all other price lists for this supplier as not current
    if (body.is_current !== false) {
      await setCurrentPriceList(parseInt(supplier_id));
    }

    const data = await createPriceList({
      supplier_id: parseInt(supplier_id),
      document_name,
      document_url,
      effective_date: effective_date || null,
      expiry_date: expiry_date || null,
      is_current: body.is_current !== false,
      notes: notes || null,
    });

    return NextResponse.json({
      success: true,
      message: 'Supplier price list created successfully',
      data,
    });
  } catch (error: any) {
    if (error.message) {
      logger.error('[Supplier Price Lists API] Database error creating:', {
        error: error.message,
        code: error.code,
        context: { endpoint: '/api/supplier-price-lists', operation: 'POST' },
      });
      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }
    return handlePriceListError(error, 'POST');
  }
}

export async function PUT(request: NextRequest) {
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

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // If this is being set as current, set all other price lists for this supplier as not current
    if (is_current === true) {
      const { data: currentRecord } = await supabaseAdmin!
        .from('supplier_price_lists')
        .select('supplier_id')
        .eq('id', id)
        .single();
      if (currentRecord) await setCurrentPriceList(currentRecord.supplier_id, id);
    }

    // Build update data
    const updateData = buildPriceListUpdateData(body);

    const data = await updatePriceList(id, updateData);

    return NextResponse.json({
      success: true,
      message: 'Supplier price list updated successfully',
      data,
    });
  } catch (error: any) {
    if (error.message) {
      logger.error('[Supplier Price Lists API] Database error updating:', {
        error: error.message,
        code: error.code,
        context: { endpoint: '/api/supplier-price-lists', operation: 'PUT', id },
      });
      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }
    return handlePriceListError(error, 'PUT');
  }
}

export async function DELETE(request: NextRequest) {
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
        code: (error as any).code,
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
    return handlePriceListError(error, 'DELETE');
  }
}
