/**
 * Threshold calculation utilities for PrepFlow COGS Dynamic methodology
 */

/**
 * Calculate average profit margin from all dishes
 * Includes ALL dishes (even without sales) because profit margin exists regardless of sales volume
 */
import { CalculationDish, DishWithSalesData } from './types';

/**
 * Calculate average profit margin from all dishes
 * Includes ALL dishes (even without sales) because profit margin exists regardless of sales volume
 */
export function calculateAverageProfitMargin(dishes: CalculationDish[]): number {
  if (dishes.length === 0) {
    return 70.0; // Default fallback average for empty menus
  }

  const totalProfitMargin = dishes.reduce((sum, dish) => {
    // Handle null/undefined profit_margin - exclude from average calculation
    const profitMargin = dish.profit_margin ?? 0;
    return sum + profitMargin;
  }, 0);

  return totalProfitMargin / dishes.length;
}

/**
 * Calculate average popularity from dishes with sales data
 * Includes ONLY dishes with sales data because can't calculate popularity without sales
 */
export function calculateAveragePopularity(
  dishesWithSales: DishWithSalesData[],
  dateRange: { startDate: Date | null; endDate: Date | null } | null,
): number {
  if (dishesWithSales.length === 0) {
    return 8.3; // Default fallback average for menus with no sales data
  }

  const totalPopularity = dishesWithSales.reduce((sum, dish) => {
    const sortedSalesData = dish.sales_data
      ? [...dish.sales_data].sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateB - dateA; // Descending order (newest first)
        })
      : [];

    if (dateRange?.startDate || dateRange?.endDate) {
      // Average popularity over date range
      const avgPopularity =
        sortedSalesData.reduce((s, sale) => s + (sale.popularity_percentage || 0), 0) /
        Math.max(1, sortedSalesData.length);
      return sum + avgPopularity;
    } else {
      // Use most recent entry (backward compatibility)
      const latestSales = sortedSalesData[0];
      return sum + (latestSales?.popularity_percentage || 0);
    }
  }, 0);

  return totalPopularity / dishesWithSales.length;
}

/**
 * Calculate dynamic thresholds based on PrepFlow methodology
 */
export function calculateThresholds(
  averageProfitMargin: number,
  averagePopularity: number,
): {
  profitThreshold: number;
  popularityThreshold: number;
} {
  return {
    profitThreshold: averageProfitMargin, // HIGH if above menu average
    popularityThreshold: averagePopularity * 0.8, // HIGH if ≥ 80% of average
  };
}
