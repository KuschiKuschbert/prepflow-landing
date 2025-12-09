import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { syncAllSubscriptions } from '@/lib/billing-sync';
import { logAdminApiAction } from '@/lib/admin-audit';
import { logger } from '@/lib/logger';

/**
 * POST /api/admin/billing/sync-subscriptions
 * Admin endpoint to sync all subscriptions from Stripe.
 * Useful for recovery after webhook failures.
 *
 * @param {NextRequest} req - Request object
 * @param {Object} req.body - Request body (optional)
 * @param {number} [req.body.limit] - Maximum number of subscriptions to sync (default: 100)
 * @returns {Promise<NextResponse>} Sync report
 */
export async function POST(req: NextRequest) {
  try {
    const adminUser = await requireAdmin(req);

    const body = await req.json().catch(() => ({}));
    const limit = typeof body.limit === 'number' && body.limit > 0 ? body.limit : 100;

    logger.info('[Admin Billing Sync] Starting subscription sync:', {
      adminEmail: adminUser.email,
      limit,
    });

    const result = await syncAllSubscriptions(limit);

    await logAdminApiAction(adminUser, 'sync_subscriptions', req, {
      target_type: 'system',
      details: {
        limit,
        synced: result.synced,
        errors: result.errors,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Synced ${result.synced} subscriptions with ${result.errors} errors`,
      synced: result.synced,
      errors: result.errors,
      report: result.report,
    });
  } catch (error) {
    const apiError = ApiErrorHandler.fromException(
      error instanceof Error ? error : new Error(String(error)),
    );
    return NextResponse.json(apiError, { status: apiError.status || 500 });
  }
}
