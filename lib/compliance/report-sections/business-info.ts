import type { ReportData } from '../report-types';

export function generateBusinessInfo(businessInfo: ReportData['business_info']): string {
  if (!businessInfo) return '';

  return `
    <div class="section">
      <div class="section-title">Business Information</div>
      <p><strong>Active Licenses:</strong> ${businessInfo.active_licenses.length}</p>
      <p><strong>Total Compliance Records:</strong> ${businessInfo.total_compliance_records}</p>
    </div>
  `;
}
