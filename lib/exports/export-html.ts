/**
 * HTML and PDF export utilities
 * Provides client-side export functionality for HTML and PDF formats
 * Uses unified export templates with Cyber Carrot branding
 */

import { generateExportTemplate } from './pdf-template';
import { logger } from '@/lib/logger';

export interface ExportReportOptions {
  title: string;
  subtitle?: string;
  content: string;
  filename: string;
  totalItems?: number;
  customMeta?: string;
}

/**
 * Export content as HTML file
 * Creates a downloadable HTML file with unified template
 *
 * @param {ExportReportOptions} options - Export options
 */
export function exportHTMLReport({
  title,
  subtitle,
  content,
  filename,
  totalItems,
  customMeta,
}: ExportReportOptions): void {
  try {
    const html = generateExportTemplate({
      title,
      subtitle,
      content,
      forPDF: false,
      totalItems,
      customMeta,
    });

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    logger.error('[Export HTML] Failed to export HTML report:', error);
    throw error;
  }
}

/**
 * Export content as PDF file
 * Creates a downloadable PDF file via API endpoint
 *
 * @param {ExportReportOptions} options - Export options
 */
export async function exportPDFReport({
  title,
  subtitle,
  content,
  filename,
  totalItems,
  customMeta,
}: ExportReportOptions): Promise<void> {
  try {
    const html = generateExportTemplate({
      title,
      subtitle,
      content,
      forPDF: true,
      totalItems,
      customMeta,
    });

    // Call API endpoint for PDF generation
    const response = await fetch('/api/export/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        subtitle,
        content,
        totalItems,
        customMeta,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to generate PDF: ${errorText}`);
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    logger.error('[Export PDF] Failed to export PDF report:', error);
    throw error;
  }
}



