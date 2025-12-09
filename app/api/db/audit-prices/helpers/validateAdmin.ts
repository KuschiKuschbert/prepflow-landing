import { ApiErrorHandler } from '@/lib/api-error-handler';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Validate admin key and environment
 */
export function validateAdmin(request: NextRequest): NextResponse | null {
  const adminKey = request.headers.get('X-Admin-Key');
  const expectedKey = process.env.SEED_ADMIN_KEY;

  if (!expectedKey || adminKey !== expectedKey) {
    return NextResponse.json(ApiErrorHandler.createError('Unauthorized', 'AUTH_ERROR', 401), {
      status: 401,
    });
  }

  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      ApiErrorHandler.createError('This endpoint is disabled in production', 'FORBIDDEN', 403),
      { status: 403 },
    );
  }

  return null;
}
