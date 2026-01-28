import { PerformanceDish } from '@/lib/api/performance/types';

export interface PerformanceHistoryItem {
  date: string;
  grossProfit: number;
  revenue: number;
  itemsSold: number;
}

/**
 * Aggregates sales data into a daily time-series.
 *
 * @param {PerformanceDish[]} dishes - Processed dishes with sales data
 * @param {string | null} startDate - Filter start date (YYYY-MM-DD)
 * @param {string | null} endDate - Filter end date (YYYY-MM-DD)
 * @returns {PerformanceHistoryItem[]} Sorted time-series data
 */
export function aggregateTimeSeries(
  dishes: PerformanceDish[],
  startDate: string | null,
  endDate: string | null,
): PerformanceHistoryItem[] {
  const historyMap: Record<string, PerformanceHistoryItem> = {};

  dishes.forEach(dish => {
    if (!dish.sales_data) return;

    dish.sales_data.forEach(sale => {
      const saleDate = sale.date.split('T')[0];

      // Filter by date range if provided
      if (startDate && saleDate < startDate) return;
      if (endDate && saleDate > endDate) return;

      if (!historyMap[saleDate]) {
        historyMap[saleDate] = {
          date: saleDate,
          grossProfit: 0,
          revenue: 0,
          itemsSold: 0,
        };
      }

      const grossProfitPerItem = dish.profit_margin_value ?? (Number(dish.selling_price || 0) - Number(dish.cost_per_serving || 0));
      // Fallback calculation if profit_margin_value missing, assuming pure cost deduction without tax logic here
      // Ideally profit_margin_value comes from DB or calculated upstream with tax.
      // For simplicity/consistency with existing metrics, ensure we use same logic.

      // Revenue = Price * Sold
      const revenue = Number(dish.selling_price || 0) * sale.number_sold;

      // GP = GP/Item * Sold
      // Note: dish.profit_margin_value is usually pre-tax GP.
      // If undef, calculate: (Price / 1.1) - Cost (assuming 10% GST included in price)
      // For this helper, let's stick to simple (Price - Cost) * Sold if pre-calc missing
      const gp = (Number(dish.selling_price || 0) - Number(dish.cost_per_serving || 0)) * sale.number_sold;

      historyMap[saleDate].grossProfit += gp;
      historyMap[saleDate].revenue += revenue;
      historyMap[saleDate].itemsSold += sale.number_sold;
    });
  });

  return Object.values(historyMap).sort((a, b) => a.date.localeCompare(b.date));
}
