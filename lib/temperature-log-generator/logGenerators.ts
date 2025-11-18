import { getTemperatureStandards } from '../temperature-standards';
import {
  formatDate,
  formatTime,
  generateTemperature,
  generateTimeForCheck,
  randomFloat,
  randomInt,
} from './utils';
import type { TemperatureLogOptions, GeneratedTemperatureLog } from './types';

const STAFF_NAMES = ['Sarah Chen', 'Mike Johnson', 'Emma Wilson', 'James Brown', 'Lisa Anderson'];
const FOOD_ITEMS = [
  'Chicken Breast',
  'Beef Mince',
  'Fresh Salmon',
  'Mixed Vegetables',
  'Soup',
  'Pasta Sauce',
  'Cooked Rice',
  'Caesar Salad',
  'Pasta Carbonara',
];

/**
 * Generate equipment temperature log.
 *
 * @param {TemperatureLogOptions['equipment'][0]} equipment - Equipment configuration
 * @param {Date} date - Date for the log
 * @param {string} countryCode - Country code for standards
 * @param {boolean} isOutOfRange - Whether temperature should be out of range
 * @returns {GeneratedTemperatureLog} Generated equipment log
 */
export function generateEquipmentLog(
  equipment: TemperatureLogOptions['equipment'][0],
  date: Date,
  countryCode: string,
  isOutOfRange: boolean,
): GeneratedTemperatureLog {
  const { hour, minute } = generateTimeForCheck(Math.random() > 0.5);
  const temp = generateTemperature(
    equipment.equipment_type,
    countryCode,
    equipment.min_temp_celsius,
    equipment.max_temp_celsius,
    isOutOfRange,
  );
  const status = isOutOfRange ? '⚠️ Out of range' : '✅ Normal';
  return {
    log_date: formatDate(date),
    log_time: formatTime(hour, minute),
    temperature_type: equipment.equipment_type.toLowerCase().replace(/\s+/g, '_'),
    temperature_celsius: temp,
    location: equipment.name,
    notes: `${status} - ${equipment.equipment_type}`,
    logged_by: STAFF_NAMES[randomInt(0, STAFF_NAMES.length - 1)],
    equipment_id: equipment.id,
  };
}

/**
 * Generate food temperature log.
 *
 * @param {Date} date - Date for the log
 * @param {string} countryCode - Country code for standards
 * @param {'food_hot_holding' | 'food_cold_holding' | 'food_cooking'} foodType - Type of food log
 * @param {boolean} isOutOfRange - Whether temperature should be out of range
 * @returns {GeneratedTemperatureLog} Generated food log
 */
export function generateFoodLog(
  date: Date,
  countryCode: string,
  foodType: 'food_hot_holding' | 'food_cold_holding' | 'food_cooking',
  isOutOfRange: boolean,
): GeneratedTemperatureLog {
  const standards = getTemperatureStandards(countryCode);
  const { hour, minute } = generateTimeForCheck(Math.random() > 0.5);
  let temp: number;
  if (foodType === 'food_hot_holding')
    temp = isOutOfRange
      ? randomFloat(standards.hot.min - 5, standards.hot.min - 1)
      : randomFloat(standards.hot.min, standards.hot.min + 10);
  else if (foodType === 'food_cold_holding')
    temp = isOutOfRange
      ? randomFloat(standards.cold.max + 1, standards.cold.max + 3)
      : randomFloat(standards.cold.min, standards.cold.max);
  else temp = randomFloat(70, 85);
  const foodItem = FOOD_ITEMS[randomInt(0, FOOD_ITEMS.length - 1)];
  const status = isOutOfRange ? '⚠️ Out of range' : '✅ Normal';
  return {
    log_date: formatDate(date),
    log_time: formatTime(hour, minute),
    temperature_type: foodType,
    temperature_celsius: parseFloat(temp.toFixed(1)),
    location: foodItem,
    notes: `${status} - ${foodType.replace(/_/g, ' ')}`,
    logged_by: STAFF_NAMES[randomInt(0, STAFF_NAMES.length - 1)],
  };
}
