import { getRecommendedTempRange, getStricterTempRange } from '../temperature-standards';

/**
 * Generate a random float between min and max (inclusive).
 *
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random float value
 */
export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Generate a random integer between min and max (inclusive).
 *
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random integer value
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Format a date as YYYY-MM-DD string.
 *
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format hour and minute as HH:MM string.
 *
 * @param {number} hour - Hour (0-23)
 * @param {number} minute - Minute (0-59)
 * @returns {string} Formatted time string
 */
export function formatTime(hour: number, minute: number): string {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

/**
 * Generate a temperature value for equipment based on type, country standards, and range.
 *
 * @param {string} equipmentType - Type of equipment (e.g., 'Freezer', 'Hot Holding')
 * @param {string} countryCode - Country code for temperature standards
 * @param {number | null} equipmentMin - Equipment minimum temperature override
 * @param {number | null} equipmentMax - Equipment maximum temperature override
 * @param {boolean} [isOutOfRange=false] - Whether to generate out-of-range temperature
 * @returns {number} Generated temperature in Celsius
 */
export function generateTemperature(
  equipmentType: string,
  countryCode: string,
  equipmentMin: number | null,
  equipmentMax: number | null,
  isOutOfRange: boolean = false,
): number {
  const regionalRange = getRecommendedTempRange(equipmentType, countryCode);
  const strictRange = getStricterTempRange(regionalRange, equipmentMin, equipmentMax);
  if (isOutOfRange) {
    const type = equipmentType.toLowerCase();
    if (type.includes('freezer')) return randomFloat(strictRange.max + 1, strictRange.max + 5);
    if (type.includes('hot')) return randomFloat(strictRange.min - 5, strictRange.min - 1);
    return Math.random() > 0.5
      ? randomFloat(strictRange.max + 1, strictRange.max + 3)
      : randomFloat(strictRange.min - 3, strictRange.min - 1);
  }
  const variance = (strictRange.max - strictRange.min) * 0.1;
  return parseFloat(randomFloat(strictRange.min + variance, strictRange.max - variance).toFixed(1));
}

/**
 * Generate a random time for temperature check (morning or evening shift).
 *
 * @param {boolean} isEvening - Whether to generate evening time (17-21) or morning time (6-10)
 * @returns {Object} Time object with hour and minute
 * @returns {number} returns.hour - Hour (0-23)
 * @returns {number} returns.minute - Minute (0-59)
 */
export function generateTimeForCheck(isEvening: boolean): { hour: number; minute: number } {
  return isEvening
    ? { hour: randomInt(17, 21), minute: randomInt(0, 59) }
    : { hour: randomInt(6, 10), minute: randomInt(0, 59) };
}
