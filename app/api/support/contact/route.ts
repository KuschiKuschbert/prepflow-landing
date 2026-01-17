import { ApiErrorHandler } from '@/lib/api-error-handler';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from './helpers/checkRateLimit';
import { createTicket } from './helpers/createTicket';
import { detectSeverity } from './helpers/detectSeverity';
import { getUserId } from './helpers/getUserId';
import { validateRequest } from './helpers/validateRequest';

/**
 * POST /api/support/contact
 * Submit a support request
 *
 * @param {NextRequest} req - Request object with support request data
 * @returns {Promise<NextResponse>} Submission response
 */
export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    if (!user?.email) {
      return NextResponse.json(
        ApiErrorHandler.createError('Authentication required', 'UNAUTHORIZED', 401),
        { status: 401 },
      );
    }

    const userEmail = user.email;

    // Check rate limit
    const rateLimit = checkRateLimit(userEmail);
    if (!rateLimit.allowed) {
      logger.warn('[Support API] Rate limit exceeded:', {
        userEmail,
        retryAfter: rateLimit.retryAfter,
        context: { endpoint: '/api/support/contact', method: 'POST' },
      });

      return NextResponse.json(
        ApiErrorHandler.createError(
          'Too many requests. Give it another go in a moment, chef.',
          'RATE_LIMIT_EXCEEDED',
          429,
        ),
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfter || 900),
          },
        },
      );
    }

    const body = await req.json();

    // Validate request body
    const validation = validateRequest(body);
    if (!validation.isValid) {
      return validation.error!;
    }

    const { subject, message, type, related_error_id } = validation.data as {
      subject: string;
      message: string;
      type: string;
      related_error_id?: string;
    };

    // Try to find user_id from email
    const userId = await getUserId(userEmail);

    // Auto-detect severity from message content
    const severity = detectSeverity(subject, message);

    // Store ticket in database
    const ticketResult = await createTicket(
      userId,
      userEmail,
      subject,
      message,
      type || 'other',
      severity,
      related_error_id || null,
    );

    if (ticketResult instanceof NextResponse) {
      return ticketResult;
    }

    // TODO: Send email notification via Resend if SUPPORT_EMAIL_NOTIFICATIONS=true
    // if (process.env.SUPPORT_EMAIL_NOTIFICATIONS === 'true') {
    //   // Send email to hello@prepflow.org
    // }

    return NextResponse.json({
      success: true,
      message: 'Support request submitted successfully. We will respond within 48 hours.',
      ticket_id: ticketResult.ticketId,
    });
  } catch (error) {
    logger.error('[Support API] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/support/contact', method: 'POST' },
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
