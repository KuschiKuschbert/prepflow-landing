/**
 * Compliance record CSV import configuration
 * Provides parsing, validation, and template generation for compliance record imports
 */

import { parseCSV, type ParseCSVResult } from '@/lib/csv/csv-utils';
import { CSVImportConfig } from '@/components/ui/CSVImportModal';
import {
  normalizeColumnName,
  mapCSVRowToEntity,
  parseDate,
  parseBoolean,
  parseNumber,
  formatEntityPreview,
} from './import-utils';

export interface ComplianceRecordImportRow {
  compliance_type_id: number;
  document_name: string;
  issue_date?: string;
  expiry_date?: string;
  status: 'active' | 'expired' | 'pending_renewal';
  document_url?: string;
  notes?: string;
  reminder_enabled?: boolean;
  reminder_days_before?: number;
}

/**
 * Parse compliance records from CSV text
 */
export function parseComplianceRecordsCSV(
  csvText: string,
): ParseCSVResult<ComplianceRecordImportRow> {
  const result = parseCSV<Record<string, any>>(csvText, {
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

/**
 * Validate compliance record import row
 */
export function validateComplianceRecord(
  row: ComplianceRecordImportRow,
  index: number,
): { valid: boolean; error?: string } {
  if (!row.compliance_type_id || row.compliance_type_id <= 0 || isNaN(row.compliance_type_id)) {
    return { valid: false, error: 'Compliance type ID is required and must be a positive number' };
  }

  if (!row.document_name || row.document_name.trim().length === 0) {
    return { valid: false, error: 'Document name is required' };
  }

  if (!row.status || !['active', 'expired', 'pending_renewal'].includes(row.status)) {
    return { valid: false, error: 'Status must be one of: active, expired, pending_renewal' };
  }

  return { valid: true };
}

/**
 * Format compliance record for preview
 */
export function formatComplianceRecordPreview(
  record: ComplianceRecordImportRow,
  index: number,
): React.ReactNode {
  return (
    <div className="space-y-1">
      <div className="font-medium text-white">{record.document_name}</div>
      <div className="text-xs text-gray-400">
        {formatEntityPreview(record, ['status', 'issue_date', 'expiry_date', 'compliance_type_id'])}
      </div>
    </div>
  );
}

/**
 * Generate compliance record CSV template
 */
export function generateComplianceRecordTemplate(): string {
  const headers = [
    'compliance_type_id',
    'document_name',
    'issue_date',
    'expiry_date',
    'status',
    'document_url',
    'notes',
    'reminder_enabled',
    'reminder_days_before',
  ];

  const exampleRow = [
    '1',
    'Food Safety Certificate',
    '2024-01-01',
    '2025-01-01',
    'active',
    'https://example.com/certificate.pdf',
    'Annual renewal required',
    'true',
    '30',
  ];

  return [headers.join(','), exampleRow.join(',')].join('\n');
}

/**
 * Compliance record import configuration
 */
export const complianceRecordImportConfig: CSVImportConfig<ComplianceRecordImportRow> = {
  entityName: 'Compliance Record',
  entityNamePlural: 'compliance records',
  expectedColumns: ['compliance_type_id', 'document_name', 'status'],
  optionalColumns: [
    'issue_date',
    'expiry_date',
    'document_url',
    'notes',
    'reminder_enabled',
    'reminder_days_before',
  ],
  parseCSV: parseComplianceRecordsCSV,
  validateEntity: validateComplianceRecord,
  formatEntityForPreview: formatComplianceRecordPreview,
  generateTemplate: generateComplianceRecordTemplate,
  templateFilename: 'compliance-record-import-template.csv',
  instructions: [
    'First row should contain column headers',
    'Required columns: compliance_type_id (or type_id), document_name (or name), status',
    'Optional columns: issue_date, expiry_date, document_url, notes, reminder_enabled, reminder_days_before',
    'Date format: YYYY-MM-DD (e.g., 2025-01-15)',
    'Status must be one of: active, expired, pending_renewal',
    'reminder_enabled should be true/false or yes/no',
  ],
};
