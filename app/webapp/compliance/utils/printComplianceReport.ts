/**
 * Print utility for compliance records
 * Formats compliance records with metadata
 * Uses unified print template with Cyber Carrot branding
 */

import { printWithTemplate } from '@/lib/exports/print-template';
import type { ComplianceRecord } from '../types';
import { formatComplianceSummary } from './printComplianceReport/formatSummary';
import { formatComplianceRecordsByType } from './printComplianceReport/formatRecords';

export interface PrintComplianceReportOptions {
  records: ComplianceRecord[];
  dateRange?: {
    start: string;
    end: string;
  };
  statusFilter?: 'active' | 'expired' | 'pending_renewal' | 'all';
}

/**
 * Get status label for compliance record
 *
 * @param {string} status - Record status
 * @returns {string} Human-readable status label
 */
function getStatusLabel(status: string): string {
  switch (status) {
    case 'active':
      return 'Active';
    case 'expired':
      return 'Expired';
    case 'pending_renewal':
      return 'Pending Renewal';
    default:
      return status;
  }
}

/**
 * Format compliance records for printing
 *
 * @param {PrintComplianceReportOptions} options - Compliance report print options
 * @returns {void} Opens print dialog
 */
export function printComplianceReport({
  records,
  dateRange: _dateRange,
  statusFilter = 'all',
}: PrintComplianceReportOptions): void {
  // Filter records by status if needed
  const filteredRecords =
    statusFilter === 'all' ? records : records.filter(r => r.status === statusFilter);

  // Group by compliance type
  const recordsByType = filteredRecords.reduce(
    (acc, record) => {
      const typeName = record.compliance_types.name;
      if (!acc[typeName]) {
        acc[typeName] = [];
      }
      acc[typeName].push(record);
      return acc;
    },
    {} as Record<string, ComplianceRecord[]>,
  );

  const content = `
    <div style="max-width: 100%;">
      ${formatComplianceSummary(filteredRecords)}
      ${formatComplianceRecordsByType(recordsByType)}
    </div>
  `;

  const subtitle =
    statusFilter !== 'all'
      ? `Compliance Report - ${getStatusLabel(statusFilter)}`
      : 'Compliance Report';

  printWithTemplate({
    title: 'Compliance Report',
    subtitle,
    content,
    totalItems: filteredRecords.length,
  });
}
