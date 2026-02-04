import type { TemperatureEquipment, TemperatureLog } from '../../types';

/**
 * Format temperature logs for HTML/PDF export
 *
 * @param {TemperatureLog[]} logs - Temperature logs to format
 * @param {TemperatureEquipment[]} equipment - Equipment list for lookup
 * @returns {string} HTML content
 */
export function formatTemperatureLogsForExport(
  logs: TemperatureLog[],
  equipment: TemperatureEquipment[],
): string {
  // Group by equipment
  const logsByEquipment = logs.reduce(
    (acc, log) => {
      const eq = equipment.find(e => e.name === log.location || e.id === log.location);
      const key = eq?.name || log.location || 'Unknown';
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(log);
      return acc;
    },
    {} as Record<string, TemperatureLog[]>,
  );

  const formatLogRow = (log: TemperatureLog) => `
    <tr style="border-bottom: 1px solid rgba(42, 42, 42, 0.5);">
      <td style="padding: 10px; color: rgba(255, 255, 255, 0.9);">${new Date(log.log_date).toLocaleDateString('en-AU')}</td>
      <td style="padding: 10px; color: rgba(255, 255, 255, 0.8);">${log.log_time}</td>
      <td style="padding: 10px; color: rgba(255, 255, 255, 0.8);">${log.temperature_type}</td>
      <td style="text-align: right; padding: 10px; color: rgba(255, 255, 255, 0.9); font-weight: 600;">${log.temperature_celsius.toFixed(1)}°C</td>
    </tr>
  `;

  return Object.entries(logsByEquipment)
    .map(
      ([equipmentName, equipmentLogs]) => `
      <div style="margin-bottom: 32px; page-break-inside: avoid;">
        <h3 style="font-size: 20px; font-weight: 600; color: #ffffff; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid rgba(42, 42, 42, 0.8);">
          ${equipmentName}
        </h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: rgba(42, 42, 42, 0.5);">
              <th style="text-align: left; padding: 10px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Date</th>
              <th style="text-align: left; padding: 10px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Time</th>
              <th style="text-align: left; padding: 10px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Type</th>
              <th style="text-align: right; padding: 10px; font-weight: 600; color: rgba(255, 255, 255, 0.9); border-bottom: 2px solid rgba(41, 231, 205, 0.3);">Temperature</th>
            </tr>
          </thead>
          <tbody>
            ${equipmentLogs
              .sort((a, b) => {
                const dateCompare = a.log_date.localeCompare(b.log_date);
                return dateCompare !== 0 ? dateCompare : a.log_time.localeCompare(b.log_time);
              })
              .map(formatLogRow)
              .join('')}
          </tbody>
        </table>
      </div>
    `,
    )
    .join('');
}
