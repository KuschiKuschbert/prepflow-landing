/**
 * Temperature log CSV import configuration
 * Provides parsing, validation, and template generation for temperature log imports
 */

export interface TemperatureLogImportRow {
  log_date: string;
  log_time: string;
  temperature_type: string;
  temperature_celsius: number;
  location?: string;
  notes?: string;
  logged_by?: string;
}

// Re-export helper functions
export { parseTemperatureLogsCSV } from './temperature-import/helpers/parseTemperatureLogsCSV';
export { validateTemperatureLog } from './temperature-import/helpers/validateTemperatureLog';
export { formatTemperatureLogPreview } from './temperature-import/helpers/formatTemperatureLogPreview';
export { generateTemperatureLogTemplate } from './temperature-import/helpers/generateTemperatureLogTemplate';
export { temperatureLogImportConfig } from './temperature-import/helpers/temperatureLogImportConfig';
