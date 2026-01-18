/**
 * Parse temperature logs from CSV text
 */
import { parseCSV, type ParseCSVResult } from '@/lib/csv/csv-utils';
import {
  mapCSVRowToEntity,
  normalizeColumnName,
  parseDate,
  parseNumber,
} from '@/lib/imports/import-utils';
import type { TemperatureLogImportRow } from '../../temperature-import';

export function parseTemperatureLogsCSV(csvText: string): ParseCSVResult<TemperatureLogImportRow> {
  const result = parseCSV<Record<string, unknown>>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: header => normalizeColumnName(header),
  });

  const logs: TemperatureLogImportRow[] = result.data.map(row => {
    const log = mapCSVRowToEntity<TemperatureLogImportRow>(row, {
      log_date: ['log_date', 'date', 'log date'],
      log_time: ['log_time', 'time', 'log time'],
      temperature_type: ['temperature_type', 'type', 'equipment_type', 'equipment type'],
      temperature_celsius: ['temperature_celsius', 'temperature', 'temp', 'temp_celsius'],
      location: ['location', 'loc'],
      notes: ['notes', 'note'],
      logged_by: ['logged_by', 'logged by', 'user', 'staff'],
    });

    // Normalize values
    return {
      log_date: parseDate(log.log_date) || new Date().toISOString().split('T')[0],
      log_time: log.log_time
        ? String(log.log_time).trim()
        : new Date().toTimeString().split(' ')[0].slice(0, 5),
      temperature_type: String(log.temperature_type || '').trim(),
      temperature_celsius: parseNumber(log.temperature_celsius),
      location: log.location ? String(log.location).trim() : undefined,
      notes: log.notes ? String(log.notes).trim() : undefined,
      logged_by: log.logged_by ? String(log.logged_by).trim() : undefined,
    };
  });

  return {
    ...result,
    data: logs,
  };
}
