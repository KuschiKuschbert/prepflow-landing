/**
 * Compliance record CSV import configuration
 * Provides parsing, validation, and template generation for compliance record imports
 */

import { CSVImportConfig } from '@/components/ui/CSVImportModal';
import { parseComplianceRecordsCSV } from './compliance-import/helpers/parseComplianceRecordsCSV';
import { validateComplianceRecord } from './compliance-import/helpers/validateComplianceRecord';
import { formatComplianceRecordPreview } from './compliance-import/helpers/formatComplianceRecordPreview';
import { generateComplianceRecordTemplate } from './compliance-import/helpers/generateComplianceRecordTemplate';

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

// Re-export helper functions for external use
export {
  parseComplianceRecordsCSV,
  validateComplianceRecord,
  formatComplianceRecordPreview,
  generateComplianceRecordTemplate,
};

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
