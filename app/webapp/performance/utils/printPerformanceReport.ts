/**
 * Print utility for performance reports
 * Formats performance analysis
 * Uses unified print template with Cyber Carrot branding
 */
import { printWithTemplate } from '@/lib/exports/print-template';
import { generateItemsSection } from './printPerformanceReport/helpers/generateItemsSection';
import { generateSummarySection } from './printPerformanceReport/helpers/generateSummarySection';
import type { PerformanceItem, PerformanceMetadata } from '@/lib/types/performance';

export interface PrintPerformanceReportOptions {
  performanceItems: PerformanceItem[];
  metadata?: PerformanceMetadata | null;
  performanceScore?: number;
  dateRange?: {
    start: Date;
    end: Date;
  };
  filters?: {
    profitCategory?: string[];
    popularityCategory?: string[];
    menuItemClass?: string[];
  };
}

/**
 * Format performance report for printing
 *
 * @param {PrintPerformanceReportOptions} options - Performance report print options
 * @returns {void} Opens print dialog
 */
export function printPerformanceReport({
  performanceItems,
  metadata,
  performanceScore,
  dateRange,
  filters: _filters,
}: PrintPerformanceReportOptions): void {
  const itemsByClass = performanceItems.reduce(
    (acc, item) => {
      if (!acc[item.menu_item_class]) acc[item.menu_item_class] = [];
      acc[item.menu_item_class].push(item);
      return acc;
    },
    {} as Record<string, PerformanceItem[]>,
  );
  const content = `
    <div style="max-width: 100%;">
      ${generateSummarySection({ performanceItems, dateRange, metadata, performanceScore })}
      ${generateItemsSection(itemsByClass)}
    </div>
  `;

  const subtitle = dateRange
    ? `Performance Report - ${dateRange.start.toLocaleDateString('en-AU')} to ${dateRange.end.toLocaleDateString('en-AU')}`
    : 'Performance Report';
  printWithTemplate({
    title: 'Performance Report',
    subtitle,
    content,
    totalItems: performanceItems.length,
    customMeta: metadata?.methodology ? `Methodology: ${metadata.methodology}` : undefined,
  });
}
