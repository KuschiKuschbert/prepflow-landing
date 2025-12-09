import { ApiErrorHandler } from '@/lib/api-error-handler';
import { authOptions } from '@/lib/auth-options';
import { logger } from '@/lib/logger';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getPreferences } from './helpers/getPreferences';
import { updatePreferences } from './helpers/updatePreferences';

const notificationPreferencesSchema = z.object({
  email: z
    .object({
      weeklyReports: z.boolean().optional(),
      securityAlerts: z.boolean().optional(),
      featureUpdates: z.boolean().optional(),
      marketing: z.boolean().optional(),
    })
    .optional(),
  inApp: z
    .object({
      personalityToasts: z.boolean().optional(),
      arcadeSounds: z.boolean().optional(),
      emailDigest: z.enum(['daily', 'weekly', 'monthly', 'never']).optional(),
    })
    .optional(),
});

/**
 * GET /api/user/notifications
 * Get current user's notification preferences
 *
 * @returns {Promise<NextResponse>} Notification preferences
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        ApiErrorHandler.createError('Authentication required', 'UNAUTHORIZED', 401),
        { status: 401 },
      );
    }

    return await getPreferences(session.user.email);
  } catch (error) {
    logger.error('[Notifications API] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/user/notifications', method: 'GET' },
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

/**
 * PUT /api/user/notifications
 * Update current user's notification preferences
 *
 * @param {NextRequest} req - Request object with preferences
 * @returns {Promise<NextResponse>} Updated preferences
 */
export async function PUT(req: NextRequest) {
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
    const validationResult = notificationPreferencesSchema.safeParse(body);
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

    const updates = validationResult.data;
    return await updatePreferences(userEmail, updates);
  } catch (error) {
    logger.error('[Notifications API] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/user/notifications', method: 'PUT' },
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
