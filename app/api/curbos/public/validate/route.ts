import { validatePublicToken } from '@/lib/curbos/public-token';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/curbos/public/validate
 * Validate public token (no authentication required)
 * Used by public display page to verify token
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        ApiErrorHandler.createError('Token parameter is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    // Validate token
    const userEmail = await validatePublicToken(token);

    if (!userEmail) {
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid or inactive token', 'INVALID_TOKEN', 403),
        { status: 403 },
      );
    }

    // Return success (don't expose user email for security)
    return NextResponse.json({
      valid: true,
      message: 'Token is valid',
    });
  } catch (error) {
    logger.error('[API /curbos/public/validate] Error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/curbos/public/validate', method: 'GET' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError('Internal server error', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}
