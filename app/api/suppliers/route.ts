import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { createSupplier } from './helpers/createSupplier';
import { deleteSupplier } from './helpers/deleteSupplier';
import { handleSupplierError } from './helpers/handleSupplierError';
import { updateSupplier } from './helpers/updateSupplier';

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
    return handleSupplierError(err, 'GET');
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const body = await request.json();
    if (!body.supplier_name) {
      return NextResponse.json(
        ApiErrorHandler.createError('Supplier name is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const data = await createSupplier(body);

    return NextResponse.json({
      success: true,
      message: 'Supplier created successfully',
      data,
    });
  } catch (err: any) {
    if (err.status) {
      return NextResponse.json(err, { status: err.status });
    }
    return handleSupplierError(err, 'POST');
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json(
        ApiErrorHandler.createError('Supplier ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const data = await updateSupplier(id, updates);

    return NextResponse.json({
      success: true,
      message: 'Supplier updated successfully',
      data,
    });
  } catch (err: any) {
    if (err.status) {
      return NextResponse.json(err, { status: err.status });
    }
    return handleSupplierError(err, 'PUT');
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        ApiErrorHandler.createError('Supplier ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    await deleteSupplier(id);

    return NextResponse.json({
      success: true,
      message: 'Supplier deleted successfully',
    });
  } catch (err: any) {
    if (err.status) {
      return NextResponse.json(err, { status: err.status });
    }
    return handleSupplierError(err, 'DELETE');
  }
}
