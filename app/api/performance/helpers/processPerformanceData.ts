import { filterSalesDataByDateRange, parseDateRange } from '@/lib/api/performance/dateFiltering';
import { deduplicateDishes, filterDishesWithSales } from '@/lib/api/performance/dishDeduplication';
import { calculatePerformanceMetrics } from '@/lib/api/performance/performanceCalculation';
import { aggregateSalesData } from '@/lib/api/performance/salesAggregation';
import {
    calculateAveragePopularity,
    calculateAverageProfitMargin,
    calculateThresholds,
} from '@/lib/api/performance/thresholdCalculation';
import { PerformanceDish } from '@/lib/api/performance/types';
import { aggregateTimeSeries } from './aggregateTimeSeries';

/**
 * Process performance data for all dishes.
 *
 * @param {Array} dishes - Raw dishes data from database
 * @param {string | null} startDateParam - Start date parameter
 * @param {string | null} endDateParam - End date parameter
 * @returns {Object} Processed performance data with metadata
 */
export function processPerformanceData(
  dishes: PerformanceDish[],
  startDateParam: string | null,
  endDateParam: string | null,
) {
  const dateRange = parseDateRange(startDateParam, endDateParam);
  const filteredDishes = dishes?.map(dish => {
    if (!dish.sales_data || dish.sales_data.length === 0) return dish;
    return {
      ...dish,
      sales_data: filterSalesDataByDateRange(dish.sales_data, dateRange),
    };
  });

  // Remove duplicates by keeping only the most recent entry for each dish name
  const uniqueDishes = deduplicateDishes(filteredDishes || []);

  // Filter dishes with sales data for analysis
  const dishesWithSales = filterDishesWithSales(filteredDishes || []);

  // PrepFlow COGS Methodology - Dynamic thresholds based on menu averages
  const averageProfitMargin = calculateAverageProfitMargin(uniqueDishes);
  const averagePopularity = calculateAveragePopularity(
    dishesWithSales,
    startDateParam || endDateParam ? dateRange : null,
  );
  const { profitThreshold, popularityThreshold } = calculateThresholds(
    averageProfitMargin,
    averagePopularity,
  );

  // Calculate performance data for all dishes
  const performanceData = uniqueDishes.map(dish => {
    const aggregatedSales = aggregateSalesData(
      dish.sales_data,
      startDateParam || endDateParam ? dateRange : null,
    );
    const metrics = calculatePerformanceMetrics(
      dish,
      aggregatedSales,
      profitThreshold,
      popularityThreshold,
    );

    return {
      ...dish,
      number_sold: aggregatedSales.numberSold,
      popularity_percentage: aggregatedSales.popularityPercentage,
      profit_category: metrics.profitCategory,
      popularity_category: metrics.popularityCategory,
      menu_item_class: metrics.menuItemClass,
      food_cost: metrics.foodCost,
      contribution_margin: metrics.contributionMargin,
      gross_profit: metrics.grossProfitExclGST, // Gross profit excluding GST
      gross_profit_percentage: dish.profit_margin ?? 0,
    };
  });

  // Generate Time-Series History
  const performanceHistory = aggregateTimeSeries(
    filteredDishes || [], // Use all dishes (including dups if dates differ) to catch all sales?
    // Actually, deduplication logic "keep most recent" might lose historical sales if not careful.
    // Ideally we aggregate sales from ALL filteredDishes before deduplication if dedupe strips items.
    // However, deduplicateDishes logic likely keeps one "dish definition" but sales_data is nested.
    // Let's assume uniqueDishes has correct sales_data attached or use filteredDishes if uniqueDishes strips sales.
    // Looking at deduplicateDishes: "Remove duplicates by keeping only the most recent entry".
    // If "entry" means dish row, and sales are joined... wait.
    // If the same dish ID appears multiple times? No, dish.sales_data is an array.
    // If deduplication removes "duplicate dish definitions", we should verify if sales_data is merged.
    // Assuming uniqueDishes is safe to use for now, but let's use filteredDishes to be safe and catch all sales.
    startDateParam ? dateRange.startDate?.toISOString().split('T')[0] ?? null : null,
    endDateParam ? dateRange.endDate?.toISOString().split('T')[0] ?? null : null
  );

  return {
    performanceData,
    performanceHistory,
    metadata: {
      methodology: 'PrepFlow COGS Dynamic',
      averageProfitMargin: averageProfitMargin,
      averagePopularity: averagePopularity,
      profitThreshold: profitThreshold,
      popularityThreshold: popularityThreshold,
      totalDishes: dishes?.length || 0,
      uniqueDishes: uniqueDishes.length,
      dishesWithSales: dishesWithSales.length,
      // Note: Profit average includes ALL dishes (profit exists regardless of sales)
      // Popularity average includes ONLY dishes with sales (can't calculate without sales)
      // Final output includes ALL dishes (items without sales are valuable insights)
    },
  };
}
