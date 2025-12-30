import { ApiErrorHandler } from '@/lib/api-error-handler';
import { hasCurbOSAccess } from '@/lib/curbos/tier-access';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/curbos/check-access
 * Check if user has CurbOS access (Business tier required, or admin via allowlist)
 * This endpoint accepts email as query parameter and does not require Auth0 authentication
 * (CurbOS uses Supabase authentication, separate from PrepFlow Auth0)
 *
 * @param {NextRequest} req - Request object
 * @returns {Promise<NextResponse>} JSON response with access status
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const userEmail = searchParams.get('email');

    if (!userEmail) {
      return NextResponse.json(
        ApiErrorHandler.createError('Email parameter is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    // Normalize email for comparison (lowercase, trimmed)
    const normalizedEmail = userEmail.toLowerCase().trim();

    // Check access using unified helper (Allowlist + Auth0 Admin + Tier)
    const hasAccess = await hasCurbOSAccess(normalizedEmail, req);

    if (hasAccess) {
      return NextResponse.json({
        allowed: true,
        reason: 'authorized',
      });
    }

    return NextResponse.json({
      allowed: false,
      reason: 'upgrade-required',
    });
  } catch (error) {
    logger.error('[API /curbos/check-access] Failed to check CurbOS access:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/curbos/check-access', method: 'GET' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? error instanceof Error
            ? error.message
            : 'Unknown error'
          : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}
