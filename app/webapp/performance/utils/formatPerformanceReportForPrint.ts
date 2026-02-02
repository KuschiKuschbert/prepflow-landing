/**
 * Format performance report for print/export
 * Generates HTML content for performance reports
 */
import { generateItemsSection } from './formatPerformanceReportForPrint/helpers/generateItemsSection';
import { generateSummarySection } from './formatPerformanceReportForPrint/helpers/generateSummarySection';
import type { PerformanceItem, PerformanceMetadata, DateRange } from '@/lib/types/performance';

/**
 * Format performance report for print/export
 *
 * @param {PerformanceItem[]} items - Performance items
 * @param {DateRange} dateRange - Date range for the report
 * @param {PerformanceMetadata} metadata - Performance metadata
 * @param {number} performanceScore - Performance score
 * @returns {string} HTML content
 */
export function formatPerformanceReportForPrint(
  items: PerformanceItem[],
  dateRange: DateRange,
  metadata?: PerformanceMetadata | null,
  performanceScore?: number,
): string {
  const itemsByClass = items.reduce(
    (acc, item) => {
      if (!acc[item.menu_item_class]) acc[item.menu_item_class] = [];
      acc[item.menu_item_class].push(item);
      return acc;
    },
    {} as Record<string, PerformanceItem[]>,
  );
  return `
    <div style="max-width: 100%;">
      ${generateSummarySection({ items, dateRange, metadata, performanceScore })}
      ${generateItemsSection(itemsByClass)}
    </div>
  `;
}
