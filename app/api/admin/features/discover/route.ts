import { requireAdmin } from '@/lib/admin-auth';
import { scanForFeatureFlags, groupFlagsByType } from '@/lib/feature-flag-scanner';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/admin/features/discover
 * Discover feature flags by scanning the codebase
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    logger.dev('[Admin Features Discovery] Starting codebase scan...');
    logger.dev('[Admin Features Discovery] Working directory:', process.cwd());

    // Scan codebase for feature flags
    let discoveredFlags: ReturnType<typeof scanForFeatureFlags>;
    try {
      discoveredFlags = scanForFeatureFlags();
    } catch (scanError) {
      logger.error('[Admin Features Discovery] Scanner error:', {
        error: scanError instanceof Error ? scanError.message : String(scanError),
        stack: scanError instanceof Error ? scanError.stack : undefined,
      });
      throw scanError;
    }

    // Group by type
    const grouped = groupFlagsByType(discoveredFlags);

    logger.dev('[Admin Features Discovery] Found flags:', {
      regular: grouped.regular.length,
      hidden: grouped.hidden.length,
      total: discoveredFlags.length,
      regularFlags: grouped.regular.map(f => f.flagKey),
      hiddenFlags: grouped.hidden.map(f => f.flagKey),
      allFlags: discoveredFlags.map(f => ({ key: f.flagKey, type: f.type, file: f.file })),
    });

    return NextResponse.json({
      success: true,
      regular: grouped.regular,
      hidden: grouped.hidden,
      total: discoveredFlags.length,
    });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }

    logger.error('[Admin Features Discovery] Error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/admin/features/discover', method: 'GET' },
    });

    const apiError = ApiErrorHandler.fromException(
      error instanceof Error ? error : new Error(String(error)),
    );
    return NextResponse.json(apiError, { status: apiError.status || 500 });
  }
}
