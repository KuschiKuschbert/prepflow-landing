import { formatEntityPreview } from '../../import-utils';
import type { ComplianceRecordImportRow } from '../compliance-import';

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

