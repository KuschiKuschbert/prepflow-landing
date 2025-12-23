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

