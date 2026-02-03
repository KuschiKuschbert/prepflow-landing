import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { handleCreateSupplier } from './helpers/createSupplierHandler';
import { handleDeleteSupplier } from './helpers/deleteSupplierHandler';
import { handleSupplierError } from './helpers/handleSupplierError';
import { handleUpdateSupplier } from './helpers/updateSupplierHandler';

async function getAuthenticatedUser(request: NextRequest) {
  const supabaseAdmin = createSupabaseAdmin();

  // Authenticate user
  const {
    data: { user },
    error: authError,
  } = await supabaseAdmin.auth.getUser(
    request.headers.get('Authorization')?.replace('Bearer ', '') || '',
  );

  // Fallback to Auth0 helper if needed
  const { requireAuth } = await import('@/lib/auth0-api-helpers');
  const authUser = await requireAuth(request);

  // Get user_id from email (since authUser is from Auth0 and we need Supabase ID)
  const { data: userData, error: userError } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', authUser.email)
    .single();

  if (userError || !userData) {
    throw ApiErrorHandler.createError('User not found', 'NOT_FOUND', 404);
  }
  return { userId: userData.id, supabase: supabaseAdmin };
}

export async function GET(request: NextRequest) {
  try {
    const { userId, supabase } = await getAuthenticatedUser(request);

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
      .eq('user_id', userId)
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
  try {
    const { userId, supabase } = await getAuthenticatedUser(request);
    return handleCreateSupplier(request, supabase, userId);
  } catch (err) {
    if (err instanceof NextResponse) return err;
    // catch thrown ApiError from getAuthenticatedUser
    if (err instanceof Error && 'status' in err) {
      return NextResponse.json(err, { status: (err as any).status });
    }
    return handleSupplierError(err, 'POST');
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId, supabase } = await getAuthenticatedUser(request);
    return handleUpdateSupplier(request, supabase, userId);
  } catch (err) {
    if (err instanceof NextResponse) return err;
    if (err instanceof Error && 'status' in err) {
      return NextResponse.json(err, { status: (err as any).status });
    }
    return handleSupplierError(err, 'PUT');
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId, supabase } = await getAuthenticatedUser(request);
    return handleDeleteSupplier(request, supabase, userId);
  } catch (err) {
    if (err instanceof NextResponse) return err;
    if (err instanceof Error && 'status' in err) {
      return NextResponse.json(err, { status: (err as any).status });
    }
    return handleSupplierError(err, 'DELETE');
  }
}
