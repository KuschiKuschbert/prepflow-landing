/**
 * generate Employee Roster
 * Extracted from report-generator.ts
 */

import {
    formatAustralianDate,
    getDaysUntilExpiry
} from '../australian-standards';
import type { ReportEmployee } from '../report-types/report-item-types';

// Type for qualification with expiry info
interface EmployeeQualification {
  id?: string;
  qualification_name?: string;
  expiry_date?: string | null;
  [key: string]: unknown;
}

export function generateEmployeeRoster(employees: ReportEmployee[]): string {
  if (!employees || employees.length === 0) {
    return `
      <div class="section">
        <div class="section-title">Employee Roster</div>
        <p>No active employees found.</p>
      </div>
    `;
  }

  return `
    <div class="section">
      <div class="section-title">Employee Roster (${employees.length} active employees)</div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Employment Start</th>
            <th>Qualifications</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${employees
            .map(emp => {
              const qualifications = emp.employee_qualifications || [];
              const expiringQuals = qualifications.filter((q: EmployeeQualification) => {
                const days = getDaysUntilExpiry(q.expiry_date ?? null);
                return days !== null && days > 0 && days <= 90;
              });
              const expiredQuals = qualifications.filter((q: EmployeeQualification) => {
                const days = getDaysUntilExpiry(q.expiry_date ?? null);
                return days !== null && days < 0;
              });

              return `
              <tr>
                <td><strong>${emp.full_name}</strong></td>
                <td>${emp.role || 'N/A'}</td>
                <td>${formatAustralianDate(emp.employment_start_date)}</td>
                <td>
                  ${qualifications.length} total
                  ${expiredQuals.length > 0 ? `<span style="color: #ef4444;">(${expiredQuals.length} expired)</span>` : ''}
                  ${expiringQuals.length > 0 ? `<span style="color: #f59e0b;">(${expiringQuals.length} expiring)</span>` : ''}
                </td>
                <td>
                  <span class="status-badge" style="background-color: #10b98120; color: #10b981;">
                    ${emp.status}
                  </span>
                </td>
              </tr>
            `;
            })
            .join('')}
        </tbody>
      </table>
    </div>
  `;
}
