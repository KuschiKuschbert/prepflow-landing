/**
 * Temperature log generator utilities.
 */

import { randomInt } from './temperature-log-generator/utils';
import { generateEquipmentLog, generateFoodLog } from './temperature-log-generator/logGenerators';
import type {
  TemperatureLogOptions,
  GeneratedTemperatureLog,
} from './temperature-log-generator/types';

// Re-export types
export type {
  TemperatureLogOptions,
  GeneratedTemperatureLog,
} from './temperature-log-generator/types';

/**
 * Generate temperature logs for a date range.
 *
 * @param {TemperatureLogOptions} options - Generation options
 * @returns {GeneratedTemperatureLog[]} Array of generated temperature logs
 */
export function generateTemperatureLogs(options: TemperatureLogOptions): GeneratedTemperatureLog[] {
  const {
    equipment,
    countryCode = 'AU',
    days = 30,
    logsPerDay = 4,
    includeOutOfRange = true,
    outOfRangePercentage = 0.08, // 8% out of range
  } = options;

  const logs: GeneratedTemperatureLog[] = [];
  const activeEquipment = equipment.filter(eq => eq.is_active);
  if (activeEquipment.length === 0) return logs;
  const keyEquipment = activeEquipment.slice(0, 5);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  for (let day = 0; day < days; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + day);
    const dayOfWeek = currentDate.getDay();
    if ((dayOfWeek === 0 || dayOfWeek === 6) && Math.random() < 0.2) continue;
    const logsToday = randomInt(Math.max(2, logsPerDay - 2), logsPerDay + 2);
    const equipmentLogs = Math.floor(logsToday * 0.6);
    for (let i = 0; i < equipmentLogs; i++) {
      const selectedEquipment = keyEquipment[randomInt(0, keyEquipment.length - 1)];
      logs.push(
        generateEquipmentLog(
          selectedEquipment,
          currentDate,
          countryCode,
          includeOutOfRange && Math.random() < outOfRangePercentage,
        ),
      );
    }
    const foodLogs = logsToday - equipmentLogs;
    const foodTypes: Array<'food_hot_holding' | 'food_cold_holding' | 'food_cooking'> = [
      'food_hot_holding',
      'food_cold_holding',
      'food_cooking',
    ];
    for (let i = 0; i < foodLogs; i++) {
      logs.push(
        generateFoodLog(
          currentDate,
          countryCode,
          foodTypes[randomInt(0, foodTypes.length - 1)],
          includeOutOfRange && Math.random() < outOfRangePercentage,
        ),
      );
    }
  }
  logs.sort((a, b) => {
    const dateCompare = a.log_date.localeCompare(b.log_date);
    return dateCompare !== 0 ? dateCompare : a.log_time.localeCompare(b.log_time);
  });

  return logs;
}
