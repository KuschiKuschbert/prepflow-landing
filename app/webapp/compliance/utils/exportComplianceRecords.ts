/**
 * Export utilities for compliance records
 * Supports CSV, PDF, HTML export formats
 */

import { exportToCSV } from '@/lib/csv/csv-utils';
import { exportHTMLReport, exportPDFReport } from '@/lib/exports/export-html';
import type { ComplianceRecord } from '../types';
import { CSV_HEADERS, mapComplianceRecordToCSVRow } from './exportComplianceRecords/csvMapping';
import { formatComplianceRecordsForExport } from './exportComplianceRecords/formatRecords';

/**
 * Export compliance records to CSV
 *
 * @param {ComplianceRecord[]} records - Compliance records to export
 */
export function exportComplianceRecordsToCSV(records: ComplianceRecord[]): void {
  if (!records || records.length === 0) {
    return;
  }

  const csvData = records.map(mapComplianceRecordToCSVRow);
  const filename = `compliance-records-${new Date().toISOString().split('T')[0]}.csv`;
  exportToCSV(csvData, CSV_HEADERS, filename);
}

/**
 * Export compliance records to HTML
 *
 * @param {ComplianceRecord[]} records - Compliance records to export
 */
export function exportComplianceRecordsToHTML(records: ComplianceRecord[]): void {
  if (!records || records.length === 0) {
    return;
  }

  const content = formatComplianceRecordsForExport(records);

  exportHTMLReport({
    title: 'Compliance Records',
    subtitle: 'Compliance Report',
    content,
    filename: `compliance-records-${new Date().toISOString().split('T')[0]}.html`,
    totalItems: records.length,
  });
}

/**
 * Export compliance records to PDF (via API)
 *
 * @param {ComplianceRecord[]} records - Compliance records to export
 */
export async function exportComplianceRecordsToPDF(records: ComplianceRecord[]): Promise<void> {
  if (!records || records.length === 0) {
    return;
  }

  const content = formatComplianceRecordsForExport(records);

  await exportPDFReport({
    title: 'Compliance Records',
    subtitle: 'Compliance Report',
    content,
    filename: `compliance-records-${new Date().toISOString().split('T')[0]}.pdf`,
    totalItems: records.length,
  });
}
