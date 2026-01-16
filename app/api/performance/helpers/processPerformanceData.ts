import { filterSalesDataByDateRange, parseDateRange } from '@/lib/api/performance/dateFiltering';
import { deduplicateDishes, filterDishesWithSales } from '@/lib/api/performance/dishDeduplication';
import { calculatePerformanceMetrics } from '@/lib/api/performance/performanceCalculation';
import { aggregateSalesData } from '@/lib/api/performance/salesAggregation';
import {
  calculateAveragePopularity,
  calculateAverageProfitMargin,
  calculateThresholds,
} from '@/lib/api/performance/thresholdCalculation';

/**
 * Process performance data for all dishes.
 *
 * @param {Array} dishes - Raw dishes data from database
 * @param {string | null} startDateParam - Start date parameter
 * @param {string | null} endDateParam - End date parameter
 * @returns {Object} Processed performance data with metadata
 */
export function processPerformanceData(
  dishes: any[],
  startDateParam: string | null,
  endDateParam: string | null,
) {
  const dateRange = parseDateRange(startDateParam, endDateParam);

  // Filter sales_data by date range if provided
  const filteredDishes = dishes?.map((dish: any) => {
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

  return {
    performanceData,
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
