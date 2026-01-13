import { ApiErrorHandler } from '@/lib/api-error-handler';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { exportUserData } from '@/lib/backup/export';
import { markDataExported } from '@/lib/data-retention/schedule-deletion';
import { checkTransferRestriction } from '@/lib/data-transfer/restrictions';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/account/export
 * Export user data as JSON download (GDPR compliance).
 * Also marks data as exported in account_deletions table.
 * Enforces cross-border data transfer restrictions.
 *
 * @returns {Promise<NextResponse>} Export response with JSON file download
 */
export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const userId = user.email;

    // Check transfer restrictions before exporting
    const restrictionCheck = await checkTransferRestriction(userId, req);

    if (!restrictionCheck.allowed) {
      logger.warn('[Account Export API] Data export blocked due to transfer restrictions:', {
        userEmail: userId,
        countryCode: restrictionCheck.countryCode,
        reason: restrictionCheck.reason,
      });

      return NextResponse.json(
        ApiErrorHandler.createError(
          restrictionCheck.reason || 'Data exports to your country are restricted.',
          'EXPORT_RESTRICTED',
          403,
          {
            requiresConsent: restrictionCheck.requiresConsent,
            countryCode: restrictionCheck.countryCode,
          },
        ),
        { status: 403 },
      );
    }

    // Export user data
    const backupData = await exportUserData(userId);

    // Mark data as exported (for 30-day retention tracking)
    await markDataExported(userId);

    // Convert to JSON string
    const jsonData = JSON.stringify(backupData, null, 2);
    const filename = `prepflow-export-${new Date().toISOString().split('T')[0]}.json`;

    // Return as download
    return new NextResponse(jsonData, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const stack = error instanceof Error ? error.stack : undefined;
    logger.error('[Account Export API] Failed to export data:', {
      error: message,
      stack,
    });

    return NextResponse.json(
      ApiErrorHandler.createError('Failed to export data', 'EXPORT_FAILED', 500, {
        details: message,
      }),
      { status: 500 },
    );
  }
}
