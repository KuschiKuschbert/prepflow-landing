import type { ComplianceRecordImportRow } from '../compliance-import';

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
