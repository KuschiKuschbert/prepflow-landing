/**
 * Format temperature log for preview
 */
import { formatEntityPreview } from '@/lib/imports/import-utils';
import type { TemperatureLogImportRow } from '../../temperature-import';

export function formatTemperatureLogPreview(
  log: TemperatureLogImportRow,
  index: number,
): React.ReactNode {
  return (
    <div className="space-y-1">
      <div className="font-medium text-white">
        {log.temperature_type} - {log.temperature_celsius}°C
      </div>
      <div className="text-xs text-gray-400">
        {formatEntityPreview(log, ['log_date', 'log_time', 'location', 'logged_by'])}
      </div>
    </div>
  );
}
