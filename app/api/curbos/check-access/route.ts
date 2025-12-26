import { evaluateTierGate } from '@/lib/feature-gate/helpers/evaluateTierGate';
import { isEmailAllowed, getAllowedEmails } from '@/lib/allowlist';
import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';
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

    // Admin access (allowlist) - automatic access regardless of tier
    if (isEmailAllowed(normalizedEmail)) {
      logger.dev('[CurbOS API] Admin access granted via allowlist:', {
        userEmail: normalizedEmail,
        originalEmail: userEmail,
      });
      return NextResponse.json({
        allowed: true,
        reason: 'admin-access',
      });
    }

    // Log for debugging if admin check fails (only in development)
    if (process.env.NODE_ENV === 'development') {
      const allowedEmails = getAllowedEmails();
      logger.dev('[CurbOS API] Admin check failed, checking tier:', {
        userEmail: normalizedEmail,
        allowedEmailsCount: allowedEmails.length,
        isInAllowedList: allowedEmails.includes(normalizedEmail),
      });
    }

    // Check tier-based access (Business tier required)
    const result = await evaluateTierGate('curbos', userEmail);

    return NextResponse.json({
      allowed: result.allowed,
      reason: result.reason,
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
