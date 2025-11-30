import { ApiErrorHandler } from '@/lib/api-error-handler';
import { authOptions } from '@/lib/auth-options';
import { logger } from '@/lib/logger';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const supportRequestSchema = z.object({
  subject: z.string().min(1).max(200),
  message: z.string().min(10).max(5000),
  type: z.enum(['bug', 'feature', 'question', 'other']).optional(),
});

/**
 * POST /api/support/contact
 * Submit a support request
 *
 * @param {NextRequest} req - Request object with support request data
 * @returns {Promise<NextResponse>} Submission response
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        ApiErrorHandler.createError('Authentication required', 'UNAUTHORIZED', 401),
        { status: 401 },
      );
    }

    const userEmail = session.user.email;
    const body = await req.json();

    // Validate request body
    const validationResult = supportRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Invalid request data',
          'VALIDATION_ERROR',
          400,
          validationResult.error.issues,
        ),
        { status: 400 },
      );
    }

    const { subject, message, type } = validationResult.data;

    // Log support request (in production, you'd send an email or create a ticket)
    logger.info('[Support API] Support request received:', {
      userEmail,
      subject,
      type: type || 'other',
      messageLength: message.length,
    });

    // In production, you would:
    // 1. Send email via Resend to hello@prepflow.org
    // 2. Create ticket in support system
    // 3. Store in support_tickets table

    return NextResponse.json({
      success: true,
      message: 'Support request submitted successfully. We will respond within 48 hours.',
      ticket_id: `TICKET-${Date.now()}`, // Placeholder
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
