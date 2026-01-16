import { requireAdmin } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/admin/system/health
 * Get system health metrics
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    if (!supabaseAdmin) {
      return NextResponse.json({
        success: true,
        status: 'down',
        database: {
          connected: false,
          responseTime: 0,
        },
        api: {
          averageResponseTime: 0,
          errorRate: 0,
        },
        uptime: 0,
        recentErrors: 0,
      });
    }

    // Test database connectivity and measure response time
    const dbStartTime = Date.now();
    const { error: dbError } = await supabaseAdmin.from('users').select('id').limit(1);
    const dbResponseTime = Date.now() - dbStartTime;

    const databaseConnected = !dbError;

    // Get recent errors count (last 24 hours)
    const { count: recentErrors, error: errorsQueryError } = await supabaseAdmin
      .from('admin_error_logs')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (errorsQueryError) {
      logger.warn('[Admin System Health API] Error fetching recent errors count:', {
        error: errorsQueryError.message,
        code: (errorsQueryError as unknown).code,
      });
    }

    // Determine overall system status
    let status: 'healthy' | 'degraded' | 'down' = 'healthy';
    if (!databaseConnected) {
      status = 'down';
    } else if (dbResponseTime > 1000 || (recentErrors || 0) > 10) {
      status = 'degraded';
    }

    // Calculate uptime (simplified - in production, track actual uptime)
    const uptime = process.uptime(); // Node.js process uptime in seconds

    return NextResponse.json({
      success: true,
      status,
      database: {
        connected: databaseConnected,
        responseTime: dbResponseTime,
      },
      api: {
        averageResponseTime: dbResponseTime, // Simplified - in production, track actual API response times
        errorRate: (recentErrors || 0) > 0 ? Math.min(((recentErrors || 0) / 100) * 100, 100) : 0, // Simplified calculation
      },
      uptime,
      recentErrors: recentErrors || 0,
    });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }

    logger.error('[Admin System Health API] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/admin/system/health', method: 'GET' },
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
