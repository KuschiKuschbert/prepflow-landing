import { getTemperatureStandards } from './temperature-standards';
import {
  formatDate,
  formatTime,
  generateTemperature,
  generateTimeForCheck,
  randomFloat,
  randomInt,
} from './temperature-log-generator/utils';

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

function generateFoodLog(
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
