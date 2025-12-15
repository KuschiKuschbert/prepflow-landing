/**
 * Handle print action.
 */
import { logger } from '@/lib/logger';
import { printPerformanceReport } from '../../../utils/printPerformanceReport';
import type { PerformanceItem, DateRange, PerformanceMetadata } from '../../../types';

export function handlePrintHelper(
  performanceItems: PerformanceItem[],
  dateRange: DateRange,
  metadata: PerformanceMetadata | null | undefined,
  performanceScore: number | undefined,
  showError: (message: string) => void,
  showSuccess: (message: string) => void,
  setPrintLoading: (loading: boolean) => void,
): void {
  if (performanceItems.length === 0) {
    showError('No performance data to print');
    return;
  }
  setPrintLoading(true);
  try {
    printPerformanceReport({
      performanceItems,
      metadata,
      performanceScore,
      dateRange: dateRange.startDate && dateRange.endDate ? { start: dateRange.startDate, end: dateRange.endDate } : undefined,
    });
    showSuccess('Performance report opened for printing');
  } catch (error) {
    logger.error('Failed to print performance report:', error);
    showError('Failed to print performance report');
  } finally {
    setPrintLoading(false);
  }
}
