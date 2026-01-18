import { parseCSV, type ParseCSVResult } from '@/lib/csv/csv-utils';
import type { ComplianceRecordImportRow } from '../../compliance-import';
import {
    mapCSVRowToEntity,
    normalizeColumnName,
    parseBoolean,
    parseDate,
    parseNumber,
} from '../../import-utils';

/**
 * Parse compliance records from CSV text
 */
export function parseComplianceRecordsCSV(
  csvText: string,
): ParseCSVResult<ComplianceRecordImportRow> {
  const result = parseCSV<Record<string, unknown>>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: header => normalizeColumnName(header),
  });

  const records: ComplianceRecordImportRow[] = result.data.map(row => {
    const record = mapCSVRowToEntity<ComplianceRecordImportRow>(row, {
      compliance_type_id: ['compliance_type_id', 'type_id', 'type', 'compliance_type'],
      document_name: ['document_name', 'name', 'document'],
      issue_date: ['issue_date', 'issue date', 'issued'],
      expiry_date: ['expiry_date', 'expiry date', 'expires', 'expiry'],
      status: ['status'],
      document_url: ['document_url', 'url', 'document url'],
      notes: ['notes', 'note'],
      reminder_enabled: ['reminder_enabled', 'reminder', 'reminder enabled'],
      reminder_days_before: ['reminder_days_before', 'reminder days', 'days before'],
    });

    // Normalize status
    const statusValue = String(record.status || 'active')
      .toLowerCase()
      .trim();
    const normalizedStatus =
      statusValue === 'expired' || statusValue === 'expire'
        ? 'expired'
        : statusValue === 'pending' ||
            statusValue === 'pending_renewal' ||
            statusValue === 'renewal'
          ? 'pending_renewal'
          : 'active';

    return {
      compliance_type_id: parseNumber(record.compliance_type_id),
      document_name: String(record.document_name || '').trim(),
      issue_date: record.issue_date ? parseDate(record.issue_date) || undefined : undefined,
      expiry_date: record.expiry_date ? parseDate(record.expiry_date) || undefined : undefined,
      status: normalizedStatus as 'active' | 'expired' | 'pending_renewal',
      document_url: record.document_url ? String(record.document_url).trim() : undefined,
      notes: record.notes ? String(record.notes).trim() : undefined,
      reminder_enabled:
        record.reminder_enabled !== undefined ? parseBoolean(record.reminder_enabled) : undefined,
      reminder_days_before: record.reminder_days_before
        ? parseNumber(record.reminder_days_before, 30)
        : undefined,
    };
  });

  return {
    ...result,
    data: records,
  };
}
