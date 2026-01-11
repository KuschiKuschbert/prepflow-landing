/**
 * Authentication helpers for populate-empty-dishes endpoint
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Check if request is authorized (admin key required)
 */
export function checkAuth(request: NextRequest): NextResponse | null {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      ApiErrorHandler.createError('Not available in production', 'FORBIDDEN', 403),
      { status: 403 },
    );
  }

  const adminKey = request.headers.get('x-admin-key');
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
