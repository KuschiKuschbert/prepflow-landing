import { logger } from '@/lib/logger';
import { processAccountDeletions } from '@/lib/data-retention/cleanup';
import { processPendingBreachNotifications } from '@/lib/security/breach-notification';
import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';

/**
 * GET /api/cron/data-retention
 * Cron endpoint for processing scheduled account deletions and breach notifications
 * Should be called daily via Vercel Cron or external cron service
 *
 * Security: Protected by CRON_SECRET environment variable
 *
 * @param {NextRequest} req - Request object
 * @returns {Promise<NextResponse>} Processing results
 */
export async function GET(req: NextRequest) {
  try {
    // Verify cron secret (if configured)
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret) {
      const authHeader = req.headers.get('authorization');
      if (authHeader !== `Bearer ${cronSecret}`) {
        logger.warn('[Cron Data Retention] Unauthorized cron request');
        return NextResponse.json(ApiErrorHandler.createError('Unauthorized', 'UNAUTHORIZED', 401), { status: 401 });
      }
    }

    logger.info('[Cron Data Retention] Starting scheduled cleanup tasks...');

    // Process account deletions (30-day retention)
    const deletionResults = await processAccountDeletions();

    // Process breach notifications (72-hour compliance)
    const breachResults = await processPendingBreachNotifications();

    const results = {
      timestamp: new Date().toISOString(),
      accountDeletions: {
        processed: deletionResults.processed,
        deleted: deletionResults.deleted,
        failed: deletionResults.failed,
        warningsSent: deletionResults.warningsSent,
      },
      breachNotifications: {
        processed: breachResults.processed,
        notified: breachResults.notified,
        failed: breachResults.failed,
      },
    };

    logger.info('[Cron Data Retention] Cleanup tasks completed:', results);

    return NextResponse.json({
      success: true,
      ...results,
    });
  } catch (error) {
    logger.error('[Cron Data Retention] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/cron/data-retention', method: 'GET' },
    });

    return NextResponse.json(
      {
        success: false,
        error:
          process.env.NODE_ENV === 'development'
            ? error instanceof Error
              ? error.message
              : 'Unknown error'
            : 'Internal server error',
      },
      { status: 500 },
    );
  }
}




