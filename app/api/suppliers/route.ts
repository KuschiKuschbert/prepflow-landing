import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { handleSupplierError } from './helpers/handleSupplierError';
import { handleCreateSupplier } from './helpers/createSupplierHandler';
import { handleUpdateSupplier } from './helpers/updateSupplierHandler';
import { handleDeleteSupplier } from './helpers/deleteSupplierHandler';

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') || '50'), 100);
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    // Build query with count option at the initial select to satisfy types
    let query = supabaseAdmin
      .from('suppliers')
      .select('*', { count: 'exact' })
      .order('supplier_name');

    if (active !== null) {
      query = query.eq('is_active', active === 'true');
    }

    const { data, error, count } = await query.range(start, end);

    if (error) {
      logger.error('[Suppliers API] Database error fetching suppliers:', {
        error: error.message,
        code: (error as any).code,
        context: { endpoint: '/api/suppliers', operation: 'GET', table: 'suppliers' },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
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
    logger.error('[Suppliers API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/suppliers', method: 'GET' },
    });
    return handleSupplierError(err, 'GET');
  }
}

export async function POST(request: NextRequest) {
  return handleCreateSupplier(request);
}

export async function PUT(request: NextRequest) {
  return handleUpdateSupplier(request);
}

export async function DELETE(request: NextRequest) {
  return handleDeleteSupplier(request);
}
