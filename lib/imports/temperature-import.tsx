/**
 * Temperature log CSV import configuration
 * Provides parsing, validation, and template generation for temperature log imports
 */

import { parseCSV, type ParseCSVResult } from '@/lib/csv/csv-utils';
import { CSVImportConfig } from '@/components/ui/CSVImportModal';
import {
  normalizeColumnName,
  mapCSVRowToEntity,
  parseNumber,
  parseDate,
  formatEntityPreview,
} from './import-utils';

export interface TemperatureLogImportRow {
  log_date: string;
  log_time: string;
  temperature_type: string;
  temperature_celsius: number;
  location?: string;
  notes?: string;
  logged_by?: string;
}

/**
 * Parse temperature logs from CSV text
 */
export function parseTemperatureLogsCSV(csvText: string): ParseCSVResult<TemperatureLogImportRow> {
  const result = parseCSV<Record<string, any>>(csvText, {
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

/**
 * Validate temperature log import row
 */
export function validateTemperatureLog(
  row: TemperatureLogImportRow,
  index: number,
): { valid: boolean; error?: string } {
  if (!row.log_date || row.log_date.trim().length === 0) {
    return { valid: false, error: 'Log date is required' };
  }

  if (!row.temperature_type || row.temperature_type.trim().length === 0) {
    return { valid: false, error: 'Temperature type is required' };
  }

  if (row.temperature_celsius === undefined || isNaN(row.temperature_celsius)) {
    return { valid: false, error: 'Temperature (celsius) is required and must be a number' };
  }

  return { valid: true };
}

/**
 * Format temperature log for preview
 */
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

/**
 * Generate temperature log CSV template
 */
export function generateTemperatureLogTemplate(): string {
  const headers = [
    'log_date',
    'log_time',
    'temperature_type',
    'temperature_celsius',
    'location',
    'notes',
    'logged_by',
  ];

  const exampleRow = [
    '2025-01-15',
    '14:30',
    'Walk-in Freezer',
    '-18',
    'Kitchen',
    'Routine check',
    'John Smith',
  ];

  return [headers.join(','), exampleRow.join(',')].join('\n');
}

/**
 * Temperature log import configuration
 */
export const temperatureLogImportConfig: CSVImportConfig<TemperatureLogImportRow> = {
  entityName: 'Temperature Log',
  entityNamePlural: 'temperature logs',
  expectedColumns: ['log_date', 'log_time', 'temperature_type', 'temperature_celsius'],
  optionalColumns: ['location', 'notes', 'logged_by'],
  parseCSV: parseTemperatureLogsCSV,
  validateEntity: validateTemperatureLog,
  formatEntityForPreview: formatTemperatureLogPreview,
  generateTemplate: generateTemperatureLogTemplate,
  templateFilename: 'temperature-log-import-template.csv',
  instructions: [
    'First row should contain column headers',
    'Required columns: log_date (or date), log_time (or time), temperature_type (or type), temperature_celsius (or temperature)',
    'Optional columns: location, notes, logged_by',
    'Date format: YYYY-MM-DD (e.g., 2025-01-15)',
    'Time format: HH:MM (e.g., 14:30)',
    'Temperature should be in Celsius',
  ],
};
