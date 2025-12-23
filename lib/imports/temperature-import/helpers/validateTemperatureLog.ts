/**
 * Validate temperature log import row
 */
import type { TemperatureLogImportRow } from '../temperature-import';

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

