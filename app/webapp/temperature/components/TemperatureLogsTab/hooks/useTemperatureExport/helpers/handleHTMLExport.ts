/**
 * Handle HTML export for temperature logs.
 */
import type { TemperatureEquipment, TemperatureLog } from '../../../../types';
import type { DateRange } from '../../../utils/calculateDateRange';

export async function handleHTMLExportHelper(
  logsToExport: TemperatureLog[],
  equipment: TemperatureEquipment[],
  dateRange: DateRange | null,
  showSuccess: (message: string) => void,
): Promise<void> {
  const { generatePrintTemplate } = await import('@/lib/exports/print-template');
  const { formatTemperatureLogsForPrint } = await import('../../../../utils/formatTemperatureLogsForPrint');
  const { getTemperatureLogPrintStyles } = await import('../../../../utils/temperatureLogPrintStyles');
  const contentHtml = formatTemperatureLogsForPrint({ logs: logsToExport, equipment, dateRange });
  const temperatureLogStyles = getTemperatureLogPrintStyles();
  let subtitle = 'Temperature Logs';
  if (dateRange) {
    subtitle = `Temperature Logs - ${dateRange.start} to ${dateRange.end}`;
  }
  const html = generatePrintTemplate({
    title: 'Temperature Monitoring',
    subtitle,
    content: `<style>${temperatureLogStyles}</style>${contentHtml}`,
    totalItems: logsToExport.length,
    customMeta: dateRange ? `Date Range: ${dateRange.start} - ${dateRange.end}` : undefined,
  });
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const dateStr = dateRange ? `${dateRange.start}_to_${dateRange.end}` : new Date().toISOString().split('T')[0];
  a.download = `temperature_logs_${dateStr}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showSuccess('Temperature logs exported as HTML');
}
