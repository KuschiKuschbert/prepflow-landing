/**
 * Temperature log import configuration
 */
import { CSVImportConfig } from '@/components/ui/CSVImportModal';
import { parseTemperatureLogsCSV } from './parseTemperatureLogsCSV';
import { validateTemperatureLog } from './validateTemperatureLog';
import { formatTemperatureLogPreview } from './formatTemperatureLogPreview';
import { generateTemperatureLogTemplate } from './generateTemperatureLogTemplate';
import type { TemperatureLogImportRow } from '../../temperature-import';

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
