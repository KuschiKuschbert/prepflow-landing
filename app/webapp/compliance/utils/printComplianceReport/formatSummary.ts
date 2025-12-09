/**
 * Format summary section for compliance report print
 */

import type { ComplianceRecord } from '../../types';

/**
 * Format summary section
 *
 * @param {ComplianceRecord[]} filteredRecords - Filtered compliance records
 * @returns {string} HTML content for summary section
 */
export function formatComplianceSummary(filteredRecords: ComplianceRecord[]): string {
  return `
    <div style="margin-bottom: 32px; padding: 20px; background: rgba(42, 42, 42, 0.3); border-radius: 12px;">
      <h2 style="font-size: 24px; font-weight: 600; color: #ffffff; margin-bottom: 16px;">
        Summary
      </h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
        <div>
          <div style="font-size: 14px; color: rgba(255, 255, 255, 0.7); margin-bottom: 4px;">Total Records</div>
          <div style="font-size: 28px; font-weight: 700; color: #29E7CD;">${filteredRecords.length}</div>
        </div>
        <div>
          <div style="font-size: 14px; color: rgba(255, 255, 255, 0.7); margin-bottom: 4px;">Active</div>
          <div style="font-size: 28px; font-weight: 700; color: #29E7CD;">${filteredRecords.filter(r => r.status === 'active').length}</div>
        </div>
        <div>
          <div style="font-size: 14px; color: rgba(255, 255, 255, 0.7); margin-bottom: 4px;">Expired</div>
          <div style="font-size: 28px; font-weight: 700; color: #D925C7;">${filteredRecords.filter(r => r.status === 'expired').length}</div>
        </div>
        <div>
          <div style="font-size: 14px; color: rgba(255, 255, 255, 0.7); margin-bottom: 4px;">Pending Renewal</div>
          <div style="font-size: 28px; font-weight: 700; color: #FF6B00;">${filteredRecords.filter(r => r.status === 'pending_renewal').length}</div>
        </div>
      </div>
    </div>
  `;
}
