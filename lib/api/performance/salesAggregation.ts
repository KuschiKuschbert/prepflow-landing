/**
 * Sales data aggregation utilities for performance API
 */

export interface AggregatedSalesData {
  numberSold: number;
  popularityPercentage: number;
  hasSalesData: boolean;
}

/**
 * Aggregate sales data for a dish over a date range or use most recent entry
 */
export function aggregateSalesData(
  salesData: Array<{ number_sold: number; popularity_percentage: number; date: string }> | null,
  dateRange: { startDate: Date | null; endDate: Date | null } | null,
): AggregatedSalesData {
  const sortedSalesData = salesData
    ? [...salesData].sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA; // Descending order (newest first)
      })
    : [];

  const hasSalesData = sortedSalesData.length > 0;

  if (!hasSalesData) {
    return {
      numberSold: 0,
      popularityPercentage: 0,
      hasSalesData: false,
    };
  }

  if (dateRange?.startDate || dateRange?.endDate) {
    // Aggregate over date range: sum number_sold, average popularity_percentage
    const totalSold = sortedSalesData.reduce((sum, sale) => sum + (sale.number_sold || 0), 0);
    const avgPopularity =
      sortedSalesData.reduce((sum, sale) => sum + (sale.popularity_percentage || 0), 0) /
      sortedSalesData.length;
    return {
      numberSold: totalSold,
      popularityPercentage: avgPopularity,
      hasSalesData: true,
    };
  } else {
    // Use most recent entry (backward compatibility)
    const latestSales = sortedSalesData[0];
    return {
      numberSold: latestSales?.number_sold || 0,
      popularityPercentage: latestSales?.popularity_percentage || 0,
      hasSalesData: true,
    };
  }
}

