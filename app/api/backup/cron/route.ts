/**
 * GET /api/backup/cron
 * Cron job endpoint for running scheduled backups.
 * Should be called by Vercel Cron or external cron service.
 */

import { NextRequest, NextResponse } from 'next/server';
import { runScheduledBackups } from '@/lib/backup/scheduler';
import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';

/**
 * Cron job endpoint for running scheduled backups.
 *
 * @param {NextRequest} request - Next.js request object
 * @returns {Promise<NextResponse>} Backup completion response
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret (if using Vercel Cron, this is handled automatically)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(ApiErrorHandler.createError('Unauthorized', 'UNAUTHORIZED', 401), { status: 401 });
    }

    logger.info('[Backup Cron] Running scheduled backups');
    await runScheduledBackups();

    return NextResponse.json({
      success: true,
      message: 'Scheduled backups completed',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    logger.error('[Backup Cron] Error:', error);
    return NextResponse.json(
      { error: 'Failed to run scheduled backups', message: error.message },
      { status: 500 },
    );
  }
}
