/**
 * Print utility for temperature logs
 * Formats temperature logs with charts and data tables
 * Uses unified print template with Cyber Carrot branding
 */

import { printWithTemplate } from '@/lib/exports/print-template';
import type { TemperatureLog, TemperatureEquipment } from '../types';

export interface PrintTemperatureLogsOptions {
  logs: TemperatureLog[];
  equipment: TemperatureEquipment[];
  dateRange?: {
    start: string;
    end: string;
  };
  equipmentFilter?: string;
}

/**
 * Format temperature logs for printing
 *
 * @param {PrintTemperatureLogsOptions} options - Temperature logs print options
 * @returns {void} Opens print dialog
 */
export function printTemperatureLogs({
  logs,
  equipment,
  dateRange,
  equipmentFilter,
}: PrintTemperatureLogsOptions): void {
  // Group logs by equipment
  const logsByEquipment = logs.reduce(
    (acc, log) => {
      const eq = equipment.find(e => e.name === log.location || e.id === log.location);
      const key = eq?.name || log.location || 'Unknown';
      if (!acc[key]) {
        acc[key] = {
          equipment: eq,
          logs: [],
        };
      }
      acc[key].logs.push(log);
      return acc;
    },
    {} as Record<string, { equipment?: TemperatureEquipment; logs: TemperatureLog[] }>,
  );

  const content = `
    <div style="max-width: 100%;">
      <!-- Summary Section -->
      <div style="margin-bottom: 32px; padding: 20px; background: rgba(42, 42, 42, 0.3); border-radius: 12px;">
        <h2 style="font-size: 24px; font-weight: 600; color: #ffffff; margin-bottom: 16px;">
          Summary
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
          <div>
            <div style="font-size: 14px; color: rgba(255, 255, 255, 0.7); margin-bottom: 4px;">Total Logs</div>
            <div style="font-size: 28px; font-weight: 700; color: #29E7CD;">${logs.length}</div>
          </div>
          <div>
            <div style="font-size: 14px; color: rgba(255, 255, 255, 0.7); margin-bottom: 4px;">Equipment</div>
            <div style="font-size: 28px; font-weight: 700; color: #29E7CD;">${Object.keys(logsByEquipment).length}</div>
          </div>
          ${
            dateRange
              ? `
            <div>
              <div style="font-size: 14px; color: rgba(255, 255, 255, 0.7); margin-bottom: 4px;">Date Range</div>
              <div style="font-size: 16px; font-weight: 600; color: rgba(255, 255, 255, 0.9);">
                ${new Date(dateRange.start).toLocaleDateString('en-AU')} - ${new Date(dateRange.end).toLocaleDateString('en-AU')}
              </div>
            </div>
          `
              : ''
          }
        </div>
      </div>

      <!-- Logs by Equipment -->
      ${Object.entries(logsByEquipment)
        .map(
          ([equipmentName, { equipment: eq, logs: equipmentLogs }]) => `
        <div style="margin-bottom: 32px; page-break-inside: avoid;">
          <h3 style="font-size: 20px; font-weight: 600; color: #ffffff; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid rgba(42, 42, 42, 0.8);">
            ${equipmentName}
            ${eq ? `<span style="font-size: 14px; font-weight: 400; color: rgba(255, 255, 255, 0.6); margin-left: 8px;">(${eq.equipment_type})</span>` : ''}
          </h3>

          <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <thead>
              <tr style="background: rgba(42, 42, 42, 0.5);">
                <th style="text-align: left; padding: 10px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Date</th>
                <th style="text-align: left; padding: 10px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Time</th>
                <th style="text-align: left; padding: 10px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Type</th>
                <th style="text-align: right; padding: 10px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Temperature</th>
                ${
                  eq
                    ? `
                  <th style="text-align: center; padding: 10px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Status</th>
                `
                    : ''
                }
              </tr>
            </thead>
            <tbody>
              ${equipmentLogs
                .sort((a, b) => {
                  const dateCompare = a.log_date.localeCompare(b.log_date);
                  return dateCompare !== 0 ? dateCompare : a.log_time.localeCompare(b.log_time);
                })
                .map(log => {
                  const temp = log.temperature_celsius;
                  const minTemp = eq?.min_temp_celsius;
                  const maxTemp = eq?.max_temp_celsius;
                  const isInRange =
                    minTemp !== null &&
                    minTemp !== undefined &&
                    maxTemp !== null &&
                    maxTemp !== undefined &&
                    temp >= minTemp &&
                    temp <= maxTemp;
                  const statusColor = isInRange ? '#29E7CD' : '#D925C7';
                  const statusText = isInRange ? 'OK' : 'Out of Range';

                  return `
                    <tr style="border-bottom: 1px solid rgba(42, 42, 42, 0.5);">
                      <td style="padding: 10px; color: rgba(255, 255, 255, 0.9);">${new Date(log.log_date).toLocaleDateString('en-AU')}</td>
                      <td style="padding: 10px; color: rgba(255, 255, 255, 0.8);">${log.log_time}</td>
                      <td style="padding: 10px; color: rgba(255, 255, 255, 0.8);">${log.temperature_type}</td>
                      <td style="text-align: right; padding: 10px; color: rgba(255, 255, 255, 0.9); font-weight: 600;">${temp.toFixed(1)}°C</td>
                      ${
                        eq
                          ? `
                        <td style="text-align: center; padding: 10px;">
                          <span style="color: ${statusColor}; font-weight: 600;">${statusText}</span>
                        </td>
                      `
                          : ''
                      }
                    </tr>
                  `;
                })
                .join('')}
            </tbody>
          </table>
        </div>
      `,
        )
        .join('')}
    </div>
  `;

  const subtitle = equipmentFilter
    ? `Temperature Logs - ${equipmentFilter}`
    : dateRange
      ? `Temperature Logs - ${new Date(dateRange.start).toLocaleDateString('en-AU')} to ${new Date(dateRange.end).toLocaleDateString('en-AU')}`
      : 'Temperature Logs';

  printWithTemplate({
    title: 'Temperature Logs',
    subtitle,
    content,
    totalItems: logs.length,
  });
}
