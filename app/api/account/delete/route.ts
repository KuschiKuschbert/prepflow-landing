import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { scheduleAccountDeletion } from '@/lib/data-retention/schedule-deletion';
import { logger } from '@/lib/logger';
import { NextRequest } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';

/**
 * POST /api/account/delete
 * Schedule user account deletion (30-day retention period)
 * Account will be permanently deleted 30 days after this request
 *
 * @returns {Promise<NextResponse>} Deletion scheduling response
 */
export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const userEmail = user.email;

    if (!userEmail) {
      return NextResponse.json(
        ApiErrorHandler.createError('User email not found', 'MISSING_EMAIL', 400),
        { status: 400 },
      );
    }

    // Schedule deletion 30 days from now
    const result = await scheduleAccountDeletion({
      userEmail,
      metadata: {
        requestedVia: 'api',
        requestedAt: new Date().toISOString(),
      },
    });

    if (!result.success) {
      logger.error('[Account Delete API] Failed to schedule deletion:', {
        userEmail,
        error: result.error,
      });

      return NextResponse.json(
        ApiErrorHandler.createError(
          result.error || 'Failed to schedule account deletion',
          'DELETION_SCHEDULE_FAILED',
          500,
        ),
        { status: 500 },
      );
    }

    logger.info('[Account Delete API] Account deletion scheduled:', {
      userEmail,
      scheduledDeletionAt: result.scheduledDeletionAt?.toISOString(),
    });

    const daysUntilDeletion = result.scheduledDeletionAt
      ? Math.ceil((result.scheduledDeletionAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : 30;

    return NextResponse.json(
      {
        success: true,
        message: `Account deletion scheduled. Your account will be permanently deleted in ${daysUntilDeletion} days. You can export your data until then.`,
        scheduledDeletionAt: result.scheduledDeletionAt?.toISOString(),
        daysUntilDeletion,
      },
      { status: 202 },
    );
  } catch (error) {
    // requireAuth throws NextResponse for auth errors
    if (error instanceof NextResponse) {
      throw error;
    }

    logger.error('[Account Delete API] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/account/delete', method: 'POST' },
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
