import { ComplianceRecords, Gap } from '../types';

export function checkComplianceRecords(records?: ComplianceRecords): Gap[] {
  const gaps: Gap[] = [];
  if (!records) return gaps;

  const criticalTypes = ['Food License', 'Council Registration', 'Pest Control'];
  const activeTypes = (records.active || []).map(r =>
    (r.compliance_types?.type_name || r.compliance_types?.name || '').toLowerCase(),
  );

  criticalTypes.forEach(criticalType => {
    const hasType = activeTypes.some(t => t.includes(criticalType.toLowerCase()));

    if (!hasType) {
      gaps.push({
        type: 'missing_compliance_record',
        severity: 'critical',
        missing_item: criticalType,
        description: `Missing active ${criticalType} compliance record`,
      });
    }
  });

  return gaps;
}
