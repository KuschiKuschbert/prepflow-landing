import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { logger } from '@/lib/logger';
import { logCacheInvalidation } from '@/lib/admin-audit';
import { invalidateTierCache } from '@/lib/tier-config-db';
import { ApiErrorHandler } from '@/lib/api-error-handler';

/**
 * POST /api/admin/tiers/cache
 * Invalidate tier configuration cache
 */
export async function POST(request: NextRequest) {
  try {
    const adminUser = await requireAdmin(request);
    if (adminUser instanceof NextResponse) return adminUser;

    await invalidateTierCache();
    await logCacheInvalidation(adminUser.email, request);

    return NextResponse.json({ success: true, message: 'Cache invalidated' });
  } catch (error) {
    logger.error('[Admin Tiers Cache] Unexpected error:', error);
    return NextResponse.json(
      ApiErrorHandler.createError('Internal server error', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}

/**
 * GET /api/admin/tiers/cache
 * Get cache status
 */
export async function GET(request: NextRequest) {
  try {
    const adminUser = await requireAdmin(request);
    if (adminUser instanceof NextResponse) return adminUser;

    // Cache status is managed in-memory, so we just return a simple status
    return NextResponse.json({
      cacheEnabled: true,
      note: 'Cache is managed in-memory with 5-minute TTL. Use POST to invalidate.',
    });
  } catch (error) {
    logger.error('[Admin Tiers Cache] Unexpected error:', error);
    return NextResponse.json(
      ApiErrorHandler.createError('Internal server error', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}
