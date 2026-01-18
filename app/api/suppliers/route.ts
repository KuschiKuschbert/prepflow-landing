import { standardAdminChecks } from '@/lib/admin-auth';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { handleCreateSupplier } from './helpers/createSupplierHandler';
import { handleDeleteSupplier } from './helpers/deleteSupplierHandler';
import { handleSupplierError } from './helpers/handleSupplierError';
import { handleUpdateSupplier } from './helpers/updateSupplierHandler';

export async function GET(request: NextRequest) {
  try {
    const { supabase, error } = await standardAdminChecks(request);
    if (error) return error;
    if (!supabase) throw new Error('Unexpected database state');

    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') || '50'), 100);
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    // Build query with count option at the initial select to satisfy types
    let query = supabase
      .from('suppliers')
      .select('*', { count: 'exact' })
      .order('supplier_name');

    if (active !== null) {
      query = query.eq('is_active', active === 'true');
    }

    const { data, error: dbError, count } = await query.range(start, end);

    if (dbError) {
      logger.error('[Suppliers API] Database error fetching suppliers:', {
        error: dbError.message,
        code: dbError.code,
        context: { endpoint: '/api/suppliers', operation: 'GET', table: 'suppliers' },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(dbError, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      page,
      pageSize,
      total: count || 0,
    });
  } catch (err) {
    if (err instanceof NextResponse) return err;

    logger.error('[Suppliers API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/suppliers', method: 'GET' },
    });
    return handleSupplierError(err, 'GET');
  }
}

export async function POST(request: NextRequest) {
  const { supabase, error } = await standardAdminChecks(request);
  if (error) return error;
  if (!supabase) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
  return handleCreateSupplier(request, supabase);
}

export async function PUT(request: NextRequest) {
  const { supabase, error } = await standardAdminChecks(request);
  if (error) return error;
  if (!supabase) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
  return handleUpdateSupplier(request, supabase);
}

export async function DELETE(request: NextRequest) {
  const { supabase, error } = await standardAdminChecks(request);
  if (error) return error;
  if (!supabase) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
  return handleDeleteSupplier(request, supabase);
}
