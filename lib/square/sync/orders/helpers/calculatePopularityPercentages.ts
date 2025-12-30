/**
 * Calculate popularity percentages for sales data.
 */
import type { SalesData } from '../types';

/**
 * Calculate popularity percentages for sales data
 * Popularity is calculated as the percentage of total sales for each dish on each date
 */
export function calculatePopularityPercentages(salesData: SalesData[]): void {
  // Group sales data by date
  const salesByDate = new Map<string, SalesData[]>();

  for (const data of salesData) {
    if (!salesByDate.has(data.date)) {
      salesByDate.set(data.date, []);
    }
    salesByDate.get(data.date)!.push(data);
  }

  // Calculate percentages for each date
  for (const [date, dateSalesData] of salesByDate.entries()) {
    const totalSold = dateSalesData.reduce((sum, data) => sum + data.number_sold, 0);

    if (totalSold === 0) {
      // If no sales, set all percentages to 0
      for (const data of dateSalesData) {
        data.popularity_percentage = 0;
      }
      continue;
    }

    // Calculate percentage for each dish
    for (const data of dateSalesData) {
      data.popularity_percentage = parseFloat(((data.number_sold / totalSold) * 100).toFixed(2));
    }
  }
}
