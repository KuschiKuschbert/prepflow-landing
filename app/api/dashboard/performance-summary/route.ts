import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { fetchDishesForPerformance, getFilterMenuId } from '@/app/api/performance/service';
import { processPerformanceData } from '@/app/api/performance/helpers/processPerformanceData';
import { generatePerformanceSummary } from './helpers/generatePerformanceSummary';

/**
 * Dashboard performance summary - uses shared service and processPerformanceData.
 * Defaults to last 7 days; returns top/bottom sellers, hidden gems, category counts.
 */
export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Default to last 7 days for dashboard summary
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const startDateStr = sevenDaysAgo.toISOString().split('T')[0];
    const endDateStr = today.toISOString().split('T')[0];

    const { searchParams } = new URL(request.url);
    const menuIdParam = searchParams.get('menuId');
    const lockedMenuOnly = searchParams.get('lockedMenuOnly') === 'true';

    const targetMenuId = await getFilterMenuId(supabaseAdmin, menuIdParam, lockedMenuOnly);
    const dishes = await fetchDishesForPerformance(supabaseAdmin, targetMenuId);

    if (dishes.length === 0) {
      return NextResponse.json({
        success: true,
        topSellers: [],
        bottomSellers: [],
        hiddenGems: [],
        categoryCounts: {
          chefsKiss: 0,
          hiddenGem: 0,
          bargainBucket: 0,
          burntToast: 0,
        },
        dateRange: { startDate: startDateStr, endDate: endDateStr },
        filteredByMenu: targetMenuId ?? undefined,
      });
    }

    const { performanceData } = processPerformanceData(dishes, startDateStr, endDateStr);
    const summary = generatePerformanceSummary(performanceData);

    return NextResponse.json({
      success: true,
      ...summary,
      dateRange: { startDate: startDateStr, endDate: endDateStr },
    });
  } catch (error) {
    logger.error('Error in performance summary API:', error);
    return NextResponse.json(
      ApiErrorHandler.createError(
        error instanceof Error ? error.message : 'An unexpected error occurred',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}
