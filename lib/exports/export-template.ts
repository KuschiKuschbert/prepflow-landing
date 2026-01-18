/**
 * Unified export template wrapper
 * Enhances pdf-template.ts for consistency across all export formats
 * Supports CSV, PDF, HTML exports with Cyber Carrot branding
 */

import { escapeHtml as escapeHtmlServer, generateExportTemplate } from './pdf-template';

export interface ExportTemplateOptions {
  title: string;
  subtitle?: string;
  content: string;
  format: 'csv' | 'pdf' | 'html';
  totalItems?: number;
  customMeta?: string;
  forPDF?: boolean;
}

/**
 * Generate export template for server-side use (PDF/HTML)
 * Wraps pdf-template.ts with consistent options
 *
 * @param {ExportTemplateOptions} options - Template options
 * @returns {string} Complete HTML document
 */
export function generateServerExportTemplate({
  title,
  subtitle,
  content,
  format,
  totalItems,
  customMeta,
  forPDF = false,
}: ExportTemplateOptions): string {
  return generateExportTemplate({
    title,
    subtitle,
    content,
    forPDF: format === 'pdf' || forPDF,
    totalItems,
    customMeta,
  });
}

/**
 * Generate CSV export with proper formatting
 * Uses unified CSV utilities
 * Note: CSV exports should use exportToCSVString from lib/csv/csv-utils.ts directly
 * This function is a placeholder for consistency - actual CSV generation is handled by csv-utils
 */
export function generateCSVExport(
  _data: Record<string, unknown>[],
  _headers: string[],
  _filename: string,
): string {
  // CSV exports should use exportToCSVString from lib/csv/csv-utils.ts directly
  // This is kept for API consistency but delegates to csv-utils
  throw new Error('Use exportToCSVString from lib/csv/csv-utils.ts for CSV exports');
}

/**
 * Escape HTML for server-side templates
 * Re-exports from pdf-template for consistency
 *
 * @param {string} text - Text to escape
 * @returns {string} Escaped HTML string
 */
export function escapeHtml(text: string): string {
  return escapeHtmlServer(text);
}
