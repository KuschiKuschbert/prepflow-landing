import { standardAdminChecks } from '@/lib/admin-auth';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { buildPriceListQuery } from './helpers/buildPriceListQuery';
import { handleCreatePriceList } from './helpers/createPriceListHandler';
import { handleDeletePriceList } from './helpers/deletePriceListHandler';
import { handlePriceListError } from './helpers/handlePriceListError';
import { handleUpdatePriceList } from './helpers/updatePriceListHandler';

export async function GET(request: NextRequest) {
  try {
    const { supabase, error } = await standardAdminChecks(request);
    if (error) return error;
    if (!supabase) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });

    const { searchParams } = new URL(request.url);
    const supplierId = searchParams.get('supplier_id');
    const current = searchParams.get('current');

    const query = buildPriceListQuery(supabase, supplierId, current);
    const { data, error: dbError } = await query;

    if (dbError) {
      logger.error('[Supplier Price Lists API] Database error:', {
        error: dbError.message,
        code: dbError.code,
        context: { endpoint: '/api/supplier-price-lists', operation: 'GET' },
      });
      const apiError = ApiErrorHandler.fromSupabaseError(dbError, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    });
  } catch (err) {
    if (err instanceof NextResponse) return err;

    logger.error('[route.ts] Error in catch block:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });

    return handlePriceListError(err, 'GET');
  }
}
export async function POST(request: NextRequest) {
  const { supabase, error } = await standardAdminChecks(request);
  if (error) return error;
  if (!supabase) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
  return handleCreatePriceList(request, supabase);
}

export async function PUT(request: NextRequest) {
  const { supabase, error } = await standardAdminChecks(request);
  if (error) return error;
  if (!supabase) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
  return handleUpdatePriceList(request, supabase);
}

export async function DELETE(request: NextRequest) {
  const { supabase, error } = await standardAdminChecks(request);
  if (error) return error;
  if (!supabase) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
  return handleDeletePriceList(request, supabase);
}
