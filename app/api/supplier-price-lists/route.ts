import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { buildPriceListQuery } from './helpers/buildPriceListQuery';
import { handlePriceListError } from './helpers/handlePriceListError';
import { handleCreatePriceList } from './helpers/createPriceListHandler';
import { handleUpdatePriceList } from './helpers/updatePriceListHandler';
import { handleDeletePriceList } from './helpers/deletePriceListHandler';
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
        code: (error as unknown).code,
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
    logger.error('[route.ts] Error in catch block:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return handlePriceListError(error, 'GET');
  }
}
export async function POST(request: NextRequest) {
  return handleCreatePriceList(request);
}

export async function PUT(request: NextRequest) {
  return handleUpdatePriceList(request);
}

export async function DELETE(request: NextRequest) {
  return handleDeletePriceList(request);
}
