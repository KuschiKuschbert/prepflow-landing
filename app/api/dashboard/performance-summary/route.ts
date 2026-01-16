import { ApiErrorHandler } from '@/lib/api-error-handler';
import { filterSalesDataByDateRange } from '@/lib/api/performance/dateFiltering';
import { deduplicateDishes, filterDishesWithSales } from '@/lib/api/performance/dishDeduplication';
import { calculatePerformanceMetrics } from '@/lib/api/performance/performanceCalculation';
import { aggregateSalesData } from '@/lib/api/performance/salesAggregation';
import {
  calculateAveragePopularity,
  calculateAverageProfitMargin,
  calculateThresholds,
} from '@/lib/api/performance/thresholdCalculation';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { fetchPerformanceDishes, type PerformanceDish } from './helpers/fetchPerformanceDishes';
import { findTargetMenuId } from './helpers/findTargetMenuId';
import { generatePerformanceSummary } from './helpers/generatePerformanceSummary';

export async function GET(request: NextRequest) {
  try {
    // Default to last 7 days for dashboard summary
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const today = new Date();

    const dateRange = {
      startDate: sevenDaysAgo,
      endDate: today,
    };

    // Get menu filter from query parameters
    const { searchParams } = new URL(request.url);
    const menuIdParam = searchParams.get('menuId');
    const lockedMenuOnly = searchParams.get('lockedMenuOnly') === 'true';

    // Find target menu ID
    const targetMenuId = await findTargetMenuId(menuIdParam, lockedMenuOnly);

    // Fetch dishes
    const { dishes, isEmpty } = await fetchPerformanceDishes(targetMenuId);

    if (isEmpty) {
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
        dateRange: {
          startDate: dateRange.startDate.toISOString().split('T')[0],
          endDate: dateRange.endDate.toISOString().split('T')[0],
        },
        filteredByMenu: targetMenuId,
      });
    }

    // Filter sales_data by date range (last 7 days)
    const filteredDishes = dishes?.map((dish: PerformanceDish) => {
      if (!dish.sales_data || dish.sales_data.length === 0) return dish;
      return {
        ...dish,
        sales_data: filterSalesDataByDateRange(dish.sales_data, dateRange),
      };
    }) as PerformanceDish[];

    // Remove duplicates
    const uniqueDishes = deduplicateDishes(filteredDishes || []) as PerformanceDish[];

    // Filter dishes with sales data
    const dishesWithSales = filterDishesWithSales(filteredDishes || []) as PerformanceDish[];

    // Calculate thresholds
    const averageProfitMargin = calculateAverageProfitMargin(uniqueDishes);
    const averagePopularity = calculateAveragePopularity(dishesWithSales, dateRange);
    const { profitThreshold, popularityThreshold } = calculateThresholds(
      averageProfitMargin,
      averagePopularity,
    );

    // Calculate performance data
    const performanceData = uniqueDishes.map(dish => {
      const aggregatedSales = aggregateSalesData(dish.sales_data || null, dateRange);
      const metrics = calculatePerformanceMetrics(
        dish,
        aggregatedSales,
        profitThreshold,
        popularityThreshold,
      );

      return {
        id: dish.id,
        name: dish.name as string,
        selling_price: dish.selling_price,
        number_sold: aggregatedSales.numberSold,
        popularity_percentage: aggregatedSales.popularityPercentage,
        profit_category: metrics.profitCategory,
        popularity_category: metrics.popularityCategory,
        menu_item_class: metrics.menuItemClass,
        gross_profit: metrics.grossProfitExclGST,
        gross_profit_percentage: dish.profit_margin ?? 0,
      };
    });

    // Generate summary
    const summary = generatePerformanceSummary(performanceData);

    return NextResponse.json({
      success: true,
      ...summary,
      dateRange: {
        startDate: dateRange.startDate.toISOString().split('T')[0],
        endDate: dateRange.endDate.toISOString().split('T')[0],
      },
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
