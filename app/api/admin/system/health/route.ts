import { standardAdminChecks } from '@/lib/admin-auth';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/admin/system/health
 * Get system health metrics
 */
const MS_IN_DAY = 24 * 60 * 60 * 1000;
const DB_SLOW_THRESHOLD_MS = 1000;
const HIGH_ERROR_THRESHOLD = 10;

/**
 * GET /api/admin/system/health
 * Get system health metrics
 */
export async function GET(request: NextRequest) {
  try {
    const { supabase, error } = await standardAdminChecks(request);
    if (error) return error;

    if (!supabase) {
      return NextResponse.json({
        success: true,
        status: 'down',
        database: { connected: false, responseTime: 0 },
        api: { averageResponseTime: 0, errorRate: 0 },
        uptime: 0,
        recentErrors: 0,
      });
    }

    // Measure DB response time
    const dbStartTime = Date.now();
    const { error: dbError } = await supabase.from('users').select('id').limit(1);
    const dbResponseTime = Date.now() - dbStartTime;
    const databaseConnected = !dbError;

    // Get recent errors (last 24h)
    const { count: recentErrors } = await supabase
      .from('admin_error_logs')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - MS_IN_DAY).toISOString());

    const errorCount = recentErrors || 0;

    // Determine status
    let status: 'healthy' | 'degraded' | 'down' = 'healthy';
    if (!databaseConnected) status = 'down';
    else if (dbResponseTime > DB_SLOW_THRESHOLD_MS || errorCount > HIGH_ERROR_THRESHOLD) status = 'degraded';

    return NextResponse.json({
      success: true,
      status,
      database: { connected: databaseConnected, responseTime: dbResponseTime },
      api: {
        averageResponseTime: dbResponseTime,
        errorRate: errorCount > 0 ? Math.min((errorCount / 100) * 100, 100) : 0,
      },
      uptime: process.uptime(),
      recentErrors: errorCount,
    });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    logger.error('[Admin System Health API] Error:', error);

    return NextResponse.json(
      ApiErrorHandler.createError('Internal server error', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}
