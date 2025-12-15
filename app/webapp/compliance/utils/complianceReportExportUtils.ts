/**
 * Compliance report export utilities
 * Provides print and export functionality for comprehensive compliance reports
 */

import { printWithTemplate } from '@/lib/exports/print-template';
import {
  formatComplianceReportForPrint,
  type ComplianceReportData,
} from './formatComplianceReportForPrint';
import { getComplianceReportPrintStyles } from './complianceReportPrintStyles';
import { exportToCSV } from '@/lib/csv/csv-utils';
import { logger } from '@/lib/logger';
import type { ExportFormat } from '@/components/ui/ExportButton';

/**
 * Print compliance report using unified template
 *
 * @param {ComplianceReportData} data - Compliance report data
 * @returns {void} Opens print dialog
 */
export function printComplianceReport(data: ComplianceReportData): void {
  try {
    // Format compliance report content as HTML
    const contentHtml = formatComplianceReportForPrint(data);

    // Get compliance report-specific styles
    const reportStyles = getComplianceReportPrintStyles();

    // Count total items
    const totalItems =
      (data.complianceRecords?.length || 0) +
      (data.temperatureLogs?.length || 0) +
      (data.cleaningTasks?.length || 0);

    // Use unified print template with compliance variant
    printWithTemplate({
      title: 'Compliance Report',
      subtitle: data.reportPeriod
        ? `${formatDate(data.reportPeriod.start)} - ${formatDate(data.reportPeriod.end)}`
        : 'Comprehensive Compliance Audit',
      content: `<style>${reportStyles}</style>${contentHtml}`,
      totalItems,
      customMeta: `Generated: ${new Date().toLocaleDateString('en-AU')}`,
      variant: 'compliance',
    });
  } catch (err) {
    logger.error('[Compliance Report Export] Print error:', err);
    throw err;
  }
}

/**
 * Export compliance report to various formats
 *
 * @param {ComplianceReportData} data - Compliance report data
 * @param {ExportFormat} format - Export format ('csv' | 'html' | 'pdf')
 * @returns {void} Downloads file or opens print dialog
 */
export function exportComplianceReport(data: ComplianceReportData, format: ExportFormat): void {
  if (format === 'csv') {
    // Flatten all data into CSV format
    const csvRows: any[] = [];

    // Compliance Records
    if (data.complianceRecords) {
      data.complianceRecords.forEach(record => {
        csvRows.push({
          Type: 'Compliance Record',
          'Document Name': record.document_name,
          'Compliance Type': record.compliance_types.name,
          'Issue Date': record.issue_date ? formatDate(record.issue_date) : '',
          'Expiry Date': record.expiry_date ? formatDate(record.expiry_date) : '',
          Status: record.status,
          Notes: record.notes || '',
        });
      });
    }

    // Temperature Logs
    if (data.temperatureLogs) {
      data.temperatureLogs.forEach(log => {
        csvRows.push({
          Type: 'Temperature Log',
          Date: formatDate(log.log_date),
          Time: log.log_time || '',
          Location: log.location || '',
          'Temperature (°C)': log.temperature_celsius,
          'Temperature Type': log.temperature_type || '',
          'Logged By': log.logged_by || '',
          Notes: log.notes || '',
        });
      });
    }

    // Cleaning Tasks
    if (data.cleaningTasks) {
      data.cleaningTasks.forEach(task => {
        const lastCompletion =
          task.completions && task.completions.length > 0
            ? formatDate(task.completions[0].completion_date)
            : 'Never';

        csvRows.push({
          Type: 'Cleaning Task',
          'Task Name': task.task_name || 'Unnamed Task',
          Area: task.cleaning_areas?.area_name || 'N/A',
          Frequency: task.frequency_type || 'N/A',
          'Last Completed': lastCompletion,
          Status: task.completions && task.completions.length > 0 ? 'Completed' : 'Pending',
        });
      });
    }

    const headers = Object.keys(csvRows[0] || {});
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `compliance_report_${dateStr}.csv`;

    exportToCSV(csvRows, headers, filename);
  } else if (format === 'html' || format === 'pdf') {
    // For HTML and PDF, use the print template logic
    printComplianceReport(data);
  }
}

/**
 * Format date in Australian format
 */
function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

