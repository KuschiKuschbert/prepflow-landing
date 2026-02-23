/**
 * Authentication helpers for populate-empty-dishes endpoint
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Check if request is authorized (admin key required).
 * In production, requires ALLOW_POPULATE_IN_PRODUCTION=true to bypass block.
 */
export function checkAuth(request: NextRequest): NextResponse | null {
  const adminKey = request.headers.get('x-admin-key');
  const allowProduction =
    process.env.ALLOW_POPULATE_IN_PRODUCTION === 'true' ||
    request.nextUrl.searchParams.get('allowProduction') === '1';

  if (process.env.NODE_ENV === 'production' && !allowProduction) {
    return NextResponse.json(
      ApiErrorHandler.createError('Not available in production', 'FORBIDDEN', 403),
      { status: 403 },
    );
  }

  if (!adminKey || adminKey !== process.env.SEED_ADMIN_KEY) {
    return NextResponse.json(ApiErrorHandler.createError('Unauthorized', 'UNAUTHORIZED', 401), {
      status: 401,
    });
  }

  if (!supabaseAdmin) {
    return NextResponse.json(
      ApiErrorHandler.createError('Database connection not available', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }

  return null;
}
