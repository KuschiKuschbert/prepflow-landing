import { standardAdminChecks } from '@/lib/admin-auth';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import {
    checkSystemHealth,
    fetchErrorCounts,
    fetchRecentSafetyErrors,
    fetchTicketCounts,
    fetchTotalDataRecords,
    fetchUserCounts,
} from './helpers/fetchDashboardData';

/**
 * GET /api/admin/dashboard/stats
 * Get admin dashboard statistics
 */
export async function GET(request: NextRequest) {
  try {
    const { supabase, error } = await standardAdminChecks(request);
    if (error) return error;
    if (!supabase) throw new Error('Unexpected database state');

    const stats = await getDashboardStats();

    return NextResponse.json({
      success: true,
      ...stats,
    });
  } catch (error) {
    return handleRouteError(error);
  }
}

async function getDashboardStats() {
  const [
    userCounts,
    errorCounts,
    ticketCounts,
    recentSafetyErrors,
    totalDataRecords,
    systemHealth,
  ] = await Promise.all([
    fetchUserCounts(),
    fetchErrorCounts(),
    fetchTicketCounts(),
    fetchRecentSafetyErrors(),
    fetchTotalDataRecords(),
    checkSystemHealth(),
  ]);

  return {
    totalUsers: userCounts.totalUsers,
    activeSubscriptions: userCounts.activeSubscriptions,
    systemHealth,
    recentErrors: errorCounts.recentErrors,
    totalDataRecords,
    criticalErrors: errorCounts.criticalErrors,
    unresolvedTickets: ticketCounts.unresolvedTickets,
    recentSafetyErrors,
  };
}

function handleRouteError(error: unknown) {
  if (error instanceof NextResponse) {
    return error;
  }

  logger.error('[Admin Dashboard Stats] Unexpected error:', {
    error: error instanceof Error ? error.message : String(error),
    context: { endpoint: '/api/admin/dashboard/stats', method: 'GET' },
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
