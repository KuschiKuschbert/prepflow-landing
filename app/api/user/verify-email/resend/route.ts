import { ApiErrorHandler } from '@/lib/api-error-handler';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/user/verify-email/resend
 * Resend email verification email
 * Note: Email verification is managed by Auth0, so this endpoint provides instructions
 *
 * @returns {Promise<NextResponse>} Resend response
 */
export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const userEmail = user.email;

    // Auth0 manages email verification
    // In a production system, you would:
    // 1. Trigger Auth0 email verification
    // 2. Or send verification email via Resend
    // 3. Update email_verified status in database

    logger.info('[Verify Email API] Verification email requested:', {
      userEmail,
      note: 'Email verification is managed by Auth0',
    });

    return NextResponse.json({
      success: true,
      message:
        'Email verification is managed by Auth0. Please check your email or visit your Auth0 dashboard to resend verification.',
      auth0_dashboard: 'https://manage.auth0.com',
      note: 'If you need to verify your email, please use the Auth0 password reset flow or contact support.',
    });
  } catch (error) {
    logger.error('[Verify Email API] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/user/verify-email/resend', method: 'POST' },
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
