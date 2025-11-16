import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';

function buildSupplierData(body: any) {
  return {
    supplier_name: body.supplier_name,
    contact_person: body.contact_person || null,
    email: body.email || null,
    phone: body.phone || null,
    address: body.address || null,
    website: body.website || null,
    payment_terms: body.payment_terms || null,
    delivery_schedule: body.delivery_schedule || null,
    minimum_order_amount: body.minimum_order_amount ? parseFloat(body.minimum_order_amount) : null,
    notes: body.notes || null,
    is_active: body.is_active !== undefined ? body.is_active : true,
  };
}

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
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/suppliers', method: 'GET' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? err instanceof Error
            ? err.message
            : 'Unknown error'
          : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
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

    const { data, error } = await supabaseAdmin
      .from('suppliers')
      .insert(buildSupplierData(body))
      .select()
      .single();

    if (error) {
      logger.error('[Suppliers API] Database error creating supplier:', {
        error: error.message,
        code: (error as any).code,
        context: { endpoint: '/api/suppliers', operation: 'POST', table: 'suppliers' },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Supplier created successfully',
      data,
    });
  } catch (err) {
    logger.error('[Suppliers API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/suppliers', method: 'POST' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? err instanceof Error
            ? err.message
            : 'Unknown error'
          : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
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

    const updateData = buildSupplierData({
      ...updates,
      supplier_name: updates.name || updates.supplier_name,
    });
    const { data, error } = await supabaseAdmin
      .from('suppliers')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      logger.error('[Suppliers API] Database error updating supplier:', {
        error: error.message,
        code: (error as any).code,
        context: { endpoint: '/api/suppliers', operation: 'PUT', supplierId: id },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Supplier updated successfully',
      data,
    });
  } catch (err) {
    logger.error('[Suppliers API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/suppliers', method: 'PUT' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? err instanceof Error
            ? err.message
            : 'Unknown error'
          : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        ApiErrorHandler.createError('Supplier ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const { error } = await supabaseAdmin.from('suppliers').delete().eq('id', id);

    if (error) {
      logger.error('[Suppliers API] Database error deleting supplier:', {
        error: error.message,
        code: (error as any).code,
        context: { endpoint: '/api/suppliers', operation: 'DELETE', supplierId: id },
      });

      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Supplier deleted successfully',
    });
  } catch (err) {
    logger.error('[Suppliers API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/suppliers', method: 'DELETE' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? err instanceof Error
            ? err.message
            : 'Unknown error'
          : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}
