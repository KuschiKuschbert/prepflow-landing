/**
 * Format temperature logs section for compliance report
 */

import { escapeHtml } from '@/lib/exports/template-utils';
import { formatDate } from './formatDate';
import type { TemperatureLog, TemperatureEquipment } from '@/app/webapp/temperature/types';

/**
 * Format temperature logs section
 *
 * @param {TemperatureLog[]} temperatureLogs - Array of temperature logs
 * @param {TemperatureEquipment[]} temperatureEquipment - Array of temperature equipment
 * @returns {string} HTML for temperature logs section
 */
export function formatTemperatureLogsSection(
  temperatureLogs: TemperatureLog[],
  temperatureEquipment: TemperatureEquipment[],
): string {
  let html = `
    <div class="compliance-report-section">
      <h3>Temperature Monitoring Logs</h3>
      <table class="compliance-report-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Location/Equipment</th>
            <th>Temperature (°C)</th>
            <th>Type</th>
            <th>Compliance Status</th>
            <th>Logged By</th>
          </tr>
        </thead>
        <tbody>
  `;

  temperatureLogs.forEach(log => {
    const equipment = temperatureEquipment.find(
      eq => eq.name === log.location || eq.location === log.location,
    );

    let complianceStatus = 'Unknown';
    let statusColor = '#666';
    if (equipment && equipment.min_temp_celsius !== null && equipment.max_temp_celsius !== null) {
      const temp = log.temperature_celsius;
      if (temp >= equipment.min_temp_celsius && temp <= equipment.max_temp_celsius) {
        complianceStatus = 'In Range';
        statusColor = '#10b981';
      } else {
        complianceStatus = 'Out of Range';
        statusColor = '#ef4444';
      }
    }

    html += `
      <tr>
        <td>${formatDate(log.log_date)}</td>
        <td>${log.log_time || 'N/A'}</td>
        <td>${escapeHtml(log.location || 'N/A')}</td>
        <td><strong>${log.temperature_celsius}°C</strong></td>
        <td>${escapeHtml(log.temperature_type || 'N/A')}</td>
        <td style="color: ${statusColor}; font-weight: 600;">${complianceStatus}</td>
        <td>${escapeHtml(log.logged_by || 'N/A')}</td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
    </div>
  `;

  return html;
}
