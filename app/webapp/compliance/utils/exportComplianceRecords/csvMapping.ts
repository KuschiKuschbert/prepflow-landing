/**
 * CSV mapping utilities for compliance records export
 */

import type { ComplianceRecord } from '../../types';

export const CSV_HEADERS = [
  'Document Name',
  'Compliance Type',
  'Issue Date',
  'Expiry Date',
  'Status',
  'Reminder Enabled',
  'Reminder Days Before',
  'Notes',
];

/**
 * Map compliance record to CSV row format
 *
 * @param {ComplianceRecord} record - Compliance record to map
 * @returns {Record<string, any>} CSV row object
 */
export function mapComplianceRecordToCSVRow(record: ComplianceRecord): Record<string, unknown> {
  return {
    'Document Name': record.document_name || '',
    'Compliance Type': record.compliance_types.name || '',
    'Issue Date': record.issue_date ? new Date(record.issue_date).toLocaleDateString('en-AU') : '',
    'Expiry Date': record.expiry_date
      ? new Date(record.expiry_date).toLocaleDateString('en-AU')
      : '',
    Status: record.status || '',
    'Reminder Enabled': record.reminder_enabled ? 'Yes' : 'No',
    'Reminder Days Before': record.reminder_days_before || 0,
    Notes: record.notes || '',
  };
}
