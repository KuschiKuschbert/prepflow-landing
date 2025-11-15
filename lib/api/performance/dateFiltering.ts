/**
 * Date filtering utilities for performance API
 */

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export function parseDateRange(startDateParam: string | null, endDateParam: string | null): DateRange {
  const startDate = startDateParam ? new Date(startDateParam) : null;
  const endDate = endDateParam ? new Date(endDateParam) : null;

  if (startDate) startDate.setHours(0, 0, 0, 0);
  if (endDate) endDate.setHours(23, 59, 59, 999);

  return { startDate, endDate };
}

export function filterSalesDataByDateRange(
  salesData: Array<{ date: string }>,
  dateRange: DateRange,
): Array<{ date: string }> {
  if (!dateRange.startDate && !dateRange.endDate) {
    return salesData;
  }

  return salesData.filter(sale => {
    const saleDate = new Date(sale.date);
    if (dateRange.startDate && saleDate < dateRange.startDate) return false;
    if (dateRange.endDate && saleDate > dateRange.endDate) return false;
    return true;
  });
}
