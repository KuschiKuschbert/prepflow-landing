/**
 * Export utilities for performance reports
 * Supports CSV, PDF, HTML export formats
 */

import { exportToCSV } from '@/lib/csv/csv-utils';
import { exportHTMLReport, exportPDFReport } from '@/lib/exports/export-html';
import type { PerformanceItem, PerformanceMetadata, DateRange } from '@/lib/types/performance';
import { formatPerformanceReportForPrint } from './formatPerformanceReportForPrint';

const CSV_HEADERS = [
  'Item Name',
  'Selling Price',
  'Cost Per Serving',
  'Gross Profit',
  'Gross Profit %',
  'Number Sold',
  'Total Revenue',
  'Total Cost',
  'Total Profit',
  'Popularity %',
  'Profit Category',
  'Popularity Category',
  'Menu Item Class',
];

/**
 * Map performance item to CSV row format
 *
 * @param {PerformanceItem} item - Performance item to map
 * @returns {Record<string, any>} CSV row object
 */
function mapPerformanceItemToCSVRow(item: PerformanceItem): Record<string, unknown> {
  return {
    'Item Name': item.name || '',
    'Selling Price': item.selling_price || 0,
    'Cost Per Serving': item.cost_per_serving || 0,
    'Gross Profit': item.gross_profit || 0,
    'Gross Profit %': item.gross_profit_percentage || 0,
    'Number Sold': item.number_sold || 0,
    'Total Revenue': (item.selling_price || 0) * (item.number_sold || 0),
    'Total Cost': (item.cost_per_serving || 0) * (item.number_sold || 0),
    'Total Profit': (item.gross_profit || 0) * (item.number_sold || 0),
    'Popularity %': item.popularity_percentage || 0,
    'Profit Category': item.profit_category || '',
    'Popularity Category': item.popularity_category || '',
    'Menu Item Class': item.menu_item_class || '',
  };
}

/**
 * Export performance items to CSV
 *
 * @param {PerformanceItem[]} items - Performance items to export
 */
export function exportPerformanceReportToCSV(items: PerformanceItem[]): void {
  if (!items || items.length === 0) {
    return;
  }

  const csvData = items.map(mapPerformanceItemToCSVRow);
  exportToCSV(
    csvData,
    CSV_HEADERS,
    `performance-report-${new Date().toISOString().split('T')[0]}.csv`,
  );
}

/**
 * Export performance report to HTML
 *
 * @param {PerformanceItem[]} items - Performance items to export
 * @param {DateRange} dateRange - Date range for the report
 * @param {PerformanceMetadata} metadata - Performance metadata
 * @param {number} performanceScore - Performance score
 */
export function exportPerformanceReportToHTML(
  items: PerformanceItem[],
  dateRange: DateRange,
  metadata?: PerformanceMetadata | null,
  performanceScore?: number,
): void {
  if (!items || items.length === 0) {
    return;
  }

  const contentHtml = formatPerformanceReportForPrint(items, dateRange, metadata, performanceScore);
  const dateRangeMeta =
    dateRange.startDate && dateRange.endDate
      ? `From: ${dateRange.startDate.toLocaleDateString('en-AU')} To: ${dateRange.endDate.toLocaleDateString('en-AU')}`
      : 'All dates';

  exportHTMLReport({
    title: 'Performance Report',
    subtitle: 'Menu Item Performance Analysis',
    content: contentHtml,
    filename: `performance-report-${new Date().toISOString().split('T')[0]}.html`,
    totalItems: items.length,
    customMeta: dateRangeMeta,
  });
}

/**
 * Export performance report to PDF
 *
 * @param {PerformanceItem[]} items - Performance items to export
 * @param {DateRange} dateRange - Date range for the report
 * @param {PerformanceMetadata} metadata - Performance metadata
 * @param {number} performanceScore - Performance score
 */
export async function exportPerformanceReportToPDF(
  items: PerformanceItem[],
  dateRange: DateRange,
  metadata?: PerformanceMetadata | null,
  performanceScore?: number,
): Promise<void> {
  if (!items || items.length === 0) {
    return;
  }

  const contentHtml = formatPerformanceReportForPrint(items, dateRange, metadata, performanceScore);
  const dateRangeMeta =
    dateRange.startDate && dateRange.endDate
      ? `From: ${dateRange.startDate.toLocaleDateString('en-AU')} To: ${dateRange.endDate.toLocaleDateString('en-AU')}`
      : 'All dates';

  await exportPDFReport({
    title: 'Performance Report',
    subtitle: 'Menu Item Performance Analysis',
    content: contentHtml,
    filename: `performance-report-${new Date().toISOString().split('T')[0]}.pdf`,
    totalItems: items.length,
    customMeta: dateRangeMeta,
  });
}
