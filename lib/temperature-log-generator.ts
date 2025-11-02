/**
 * Temperature Log Generator
 *
 * Generates realistic temperature logs based on regional standards
 * and equipment specifications.
 */

import {
  getTemperatureStandards,
  getRecommendedTempRange,
  getStricterTempRange,
} from './temperature-standards';

export interface TemperatureLogOptions {
  equipment: Array<{
    id: string;
    name: string;
    equipment_type: string;
    min_temp_celsius: number | null;
    max_temp_celsius: number | null;
    is_active: boolean;
  }>;
  countryCode?: string;
  days?: number;
  logsPerDay?: number;
  includeOutOfRange?: boolean;
  outOfRangePercentage?: number;
}

export interface GeneratedTemperatureLog {
  log_date: string;
  log_time: string;
  temperature_type: string;
  temperature_celsius: number;
  location: string;
  notes: string | null;
  logged_by: string;
  equipment_id?: string;
}

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
 * Generate a random number between min and max (inclusive)
 */
function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Generate a random integer between min and max (inclusive)
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Format date as YYYY-MM-DD
 */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format time as HH:MM
 */
function formatTime(hour: number, minute: number): string {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

/**
 * Generate a realistic temperature for equipment type and country
 */
function generateTemperature(
  equipmentType: string,
  countryCode: string,
  equipmentMin: number | null,
  equipmentMax: number | null,
  isOutOfRange: boolean = false,
): number {
  const regionalRange = getRecommendedTempRange(equipmentType, countryCode);
  const strictRange = getStricterTempRange(regionalRange, equipmentMin, equipmentMax);

  if (isOutOfRange) {
    // Generate temperature outside safe range (but not too extreme)
    const type = equipmentType.toLowerCase();
    if (type.includes('freezer')) {
      // Out of range: too warm (above max)
      return randomFloat(strictRange.max + 1, strictRange.max + 5);
    } else if (type.includes('hot')) {
      // Out of range: too cold (below min)
      return randomFloat(strictRange.min - 5, strictRange.min - 1);
    } else {
      // Cold storage: either too warm (above max) or too cold (below min)
      if (Math.random() > 0.5) {
        return randomFloat(strictRange.max + 1, strictRange.max + 3);
      } else {
        return randomFloat(strictRange.min - 3, strictRange.min - 1);
      }
    }
  }

  // Generate temperature within safe range
  const variance = (strictRange.max - strictRange.min) * 0.1; // 10% variance
  const min = strictRange.min + variance;
  const max = strictRange.max - variance;
  return parseFloat(randomFloat(min, max).toFixed(1));
}

/**
 * Generate a realistic time for temperature check (morning/evening focus)
 */
function generateTimeForCheck(isEvening: boolean): { hour: number; minute: number } {
  if (isEvening) {
    // Evening checks: 17:00 - 21:00
    return {
      hour: randomInt(17, 21),
      minute: randomInt(0, 59),
    };
  } else {
    // Morning checks: 6:00 - 10:00
    return {
      hour: randomInt(6, 10),
      minute: randomInt(0, 59),
    };
  }
}

/**
 * Generate temperature logs for equipment
 */
function generateEquipmentLog(
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
  const notes = `${status} - ${equipment.equipment_type}`;

  return {
    log_date: formatDate(date),
    log_time: formatTime(hour, minute),
    temperature_type: equipment.equipment_type.toLowerCase().replace(/\s+/g, '_'),
    temperature_celsius: temp,
    location: equipment.name,
    notes,
    logged_by: STAFF_NAMES[randomInt(0, STAFF_NAMES.length - 1)],
    equipment_id: equipment.id,
  };
}

/**
 * Generate temperature logs for food items
 */
function generateFoodLog(
  date: Date,
  countryCode: string,
  foodType: 'food_hot_holding' | 'food_cold_holding' | 'food_cooking',
  isOutOfRange: boolean,
): GeneratedTemperatureLog {
  const standards = getTemperatureStandards(countryCode);
  const { hour, minute } = generateTimeForCheck(Math.random() > 0.5);

  let temp: number;
  if (foodType === 'food_hot_holding') {
    if (isOutOfRange) {
      temp = randomFloat(standards.hot.min - 5, standards.hot.min - 1);
    } else {
      temp = randomFloat(standards.hot.min, standards.hot.min + 10);
    }
  } else if (foodType === 'food_cold_holding') {
    if (isOutOfRange) {
      temp = randomFloat(standards.cold.max + 1, standards.cold.max + 3);
    } else {
      temp = randomFloat(standards.cold.min, standards.cold.max);
    }
  } else {
    // food_cooking
    temp = randomFloat(70, 85); // Cooking temperature
  }

  const foodItem = FOOD_ITEMS[randomInt(0, FOOD_ITEMS.length - 1)];
  const status = isOutOfRange ? '⚠️ Out of range' : '✅ Normal';
  const notes = `${status} - ${foodType.replace(/_/g, ' ')}`;

  return {
    log_date: formatDate(date),
    log_time: formatTime(hour, minute),
    temperature_type: foodType,
    temperature_celsius: parseFloat(temp.toFixed(1)),
    location: foodItem,
    notes,
    logged_by: STAFF_NAMES[randomInt(0, STAFF_NAMES.length - 1)],
  };
}

/**
 * Generate temperature logs based on options
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

  if (activeEquipment.length === 0) {
    return logs;
  }

  // Focus on 4-5 most important pieces
  const keyEquipment = activeEquipment.slice(0, 5);
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - days);

  // Generate logs for each day
  for (let day = 0; day < days; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + day);

    // Skip weekends occasionally (20% chance)
    const dayOfWeek = currentDate.getDay();
    if ((dayOfWeek === 0 || dayOfWeek === 6) && Math.random() < 0.2) {
      continue;
    }

    // Determine how many logs for this day (varies 2-6)
    const logsToday = randomInt(Math.max(2, logsPerDay - 2), logsPerDay + 2);

    // Equipment logs (60% of logs)
    const equipmentLogs = Math.floor(logsToday * 0.6);
    for (let i = 0; i < equipmentLogs; i++) {
      const selectedEquipment = keyEquipment[randomInt(0, keyEquipment.length - 1)];
      const isOutOfRange = includeOutOfRange && Math.random() < outOfRangePercentage;
      logs.push(generateEquipmentLog(selectedEquipment, currentDate, countryCode, isOutOfRange));
    }

    // Food logs (40% of logs)
    const foodLogs = logsToday - equipmentLogs;
    const foodTypes: Array<'food_hot_holding' | 'food_cold_holding' | 'food_cooking'> = [
      'food_hot_holding',
      'food_cold_holding',
      'food_cooking',
    ];

    for (let i = 0; i < foodLogs; i++) {
      const foodType = foodTypes[randomInt(0, foodTypes.length - 1)];
      const isOutOfRange = includeOutOfRange && Math.random() < outOfRangePercentage;
      logs.push(generateFoodLog(currentDate, countryCode, foodType, isOutOfRange));
    }
  }

  // Sort by date and time
  logs.sort((a, b) => {
    const dateCompare = a.log_date.localeCompare(b.log_date);
    if (dateCompare !== 0) return dateCompare;
    return a.log_time.localeCompare(b.log_time);
  });

  return logs;
}
