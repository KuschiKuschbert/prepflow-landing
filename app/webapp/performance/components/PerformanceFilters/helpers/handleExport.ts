/**
 * Handle export action.
 */
import { logger } from '@/lib/logger';
import {
  exportPerformanceReportToCSV,
  exportPerformanceReportToHTML,
  exportPerformanceReportToPDF,
} from '../../../utils/exportPerformanceReport';
import type { PerformanceItem, DateRange, PerformanceMetadata } from '@/lib/types/performance';
import type { ExportFormat } from '@/components/ui/ExportButton';

export async function handleExportHelper(
  format: ExportFormat,
  performanceItems: PerformanceItem[],
  dateRange: DateRange,
  metadata: PerformanceMetadata | null | undefined,
  performanceScore: number | undefined,
  showError: (message: string) => void,
  showSuccess: (message: string) => void,
  setExportLoading: (loading: ExportFormat | null) => void,
): Promise<void> {
  if (performanceItems.length === 0) {
    showError('No performance data to export');
    return;
  }
  setExportLoading(format);
  try {
    switch (format) {
      case 'csv':
        exportPerformanceReportToCSV(performanceItems);
        showSuccess('Performance data exported to CSV');
        break;
      case 'html':
        exportPerformanceReportToHTML(performanceItems, dateRange, metadata, performanceScore);
        showSuccess('Performance report exported to HTML');
        break;
      case 'pdf':
        await exportPerformanceReportToPDF(performanceItems, dateRange, metadata, performanceScore);
        showSuccess('Performance report exported to PDF');
        break;
    }
  } catch (error) {
    logger.error(`Failed to export performance report to ${format}:`, error);
    showError(`Failed to export performance report to ${format.toUpperCase()}`);
  } finally {
    setExportLoading(null);
  }
}
