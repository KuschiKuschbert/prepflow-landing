/**
 * Legacy temperature log generation (for deprecated endpoint)
 */

import {
  generateRealisticTemperature,
  generateFoodTemperature,
  getTemperatureStatusText,
  getFoodSafetyStatusText,
} from './temperature-log-helpers';

export interface TemperatureLogEntry {
  log_date: string;
  log_time: string;
  temperature_celsius: number;
  temperature_type: string;
  location: string;
  notes: string;
  logged_by: string;
  created_at: string;
}

const FOOD_ITEMS = {
  hotHolding: ['Chicken Curry', 'Beef Stew', 'Vegetable Soup', 'Pasta Sauce', 'Rice Pilaf'],
  coldHolding: ['Salad Bar Mix', 'Coleslaw', 'Potato Salad', 'Fruit Salad', 'Caesar Salad'],
  cooking: ['Chicken Breast', 'Salmon Fillet', 'Beef Tenderloin', 'Pork Chops', 'Vegetable Medley'],
};

const STAFF_MEMBERS = [
  'Chef Sarah',
  'Chef Mike',
  'Chef Emma',
  'Chef James',
  'Chef Lisa',
  'Sous Chef Tom',
  'Line Cook Alex',
  'Prep Cook Sam',
  'Kitchen Manager Kim',
];

/**
 * Generate temperature logs for a date range
 */
export function generateLegacyTemperatureLogs(
  equipment: any[],
  startDate: Date,
  endDate: Date,
): TemperatureLogEntry[] {
  const temperatureLogs: TemperatureLogEntry[] = [];

  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    const currentDate = new Date(date);
    const dateStr = currentDate.toISOString().split('T')[0];

    // Generate equipment logs (morning and evening)
    for (const item of equipment) {
      // Morning entry (7:00-9:00 AM)
      const morningHour = 7 + Math.floor(Math.random() * 3);
      const morningMinute = Math.floor(Math.random() * 60);
      const morningTime = `${morningHour.toString().padStart(2, '0')}:${morningMinute.toString().padStart(2, '0')}`;
      const morningTemp = generateRealisticTemperature(item, 'morning');

      temperatureLogs.push({
        log_date: dateStr,
        log_time: morningTime,
        temperature_celsius: morningTemp,
        temperature_type: item.equipment_type,
        location: item.name,
        notes: `Morning temperature check - ${getTemperatureStatusText(morningTemp, item)}`,
        logged_by: STAFF_MEMBERS[Math.floor(Math.random() * STAFF_MEMBERS.length)],
        created_at: new Date(`${dateStr}T${morningTime}:00`).toISOString(),
      });

      // Evening entry (5:00-7:00 PM)
      const eveningHour = 17 + Math.floor(Math.random() * 3);
      const eveningMinute = Math.floor(Math.random() * 60);
      const eveningTime = `${eveningHour.toString().padStart(2, '0')}:${eveningMinute.toString().padStart(2, '0')}`;
      const eveningTemp = generateRealisticTemperature(item, 'evening');

      temperatureLogs.push({
        log_date: dateStr,
        log_time: eveningTime,
        temperature_celsius: eveningTemp,
        temperature_type: item.equipment_type,
        location: item.name,
        notes: `Evening temperature check - ${getTemperatureStatusText(eveningTemp, item)}`,
        logged_by: STAFF_MEMBERS[Math.floor(Math.random() * STAFF_MEMBERS.length)],
        created_at: new Date(`${dateStr}T${eveningTime}:00`).toISOString(),
      });
    }

    // Generate hot holding food items (2 entries per day)
    for (let i = 0; i < 2; i++) {
      const foodItem =
        FOOD_ITEMS.hotHolding[Math.floor(Math.random() * FOOD_ITEMS.hotHolding.length)];
      const baseHour = i === 0 ? 11 : 14;
      const hour = baseHour + Math.floor(Math.random() * 2);
      const minute = Math.floor(Math.random() * 60);
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const temp = generateFoodTemperature('hot_holding');

      temperatureLogs.push({
        log_date: dateStr,
        log_time: time,
        temperature_celsius: temp,
        temperature_type: 'food_hot_holding',
        location: foodItem,
        notes: `Hot holding temperature check - ${getFoodSafetyStatusText(temp)}`,
        logged_by: STAFF_MEMBERS[Math.floor(Math.random() * STAFF_MEMBERS.length)],
        created_at: new Date(`${dateStr}T${time}:00`).toISOString(),
      });
    }

    // Generate cold holding food items (2 entries per day)
    for (let i = 0; i < 2; i++) {
      const foodItem =
        FOOD_ITEMS.coldHolding[Math.floor(Math.random() * FOOD_ITEMS.coldHolding.length)];
      const baseHour = i === 0 ? 10 : 15;
      const hour = baseHour + Math.floor(Math.random() * 2);
      const minute = Math.floor(Math.random() * 60);
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const temp = generateFoodTemperature('cold_holding');

      temperatureLogs.push({
        log_date: dateStr,
        log_time: time,
        temperature_celsius: temp,
        temperature_type: 'food_cold_holding',
        location: foodItem,
        notes: `Cold holding temperature check - ${getFoodSafetyStatusText(temp)}`,
        logged_by: STAFF_MEMBERS[Math.floor(Math.random() * STAFF_MEMBERS.length)],
        created_at: new Date(`${dateStr}T${time}:00`).toISOString(),
      });
    }

    // Generate cooking food items (1 entry per day)
    const cookingItem = FOOD_ITEMS.cooking[Math.floor(Math.random() * FOOD_ITEMS.cooking.length)];
    const cookingHour = 13 + Math.floor(Math.random() * 2);
    const cookingMinute = Math.floor(Math.random() * 60);
    const cookingTime = `${cookingHour.toString().padStart(2, '0')}:${cookingMinute.toString().padStart(2, '0')}`;
    const cookingTemp = generateFoodTemperature('cooking');

    temperatureLogs.push({
      log_date: dateStr,
      log_time: cookingTime,
      temperature_celsius: cookingTemp,
      temperature_type: 'food_cooking',
      location: cookingItem,
      notes: `Cooking temperature check - ${getFoodSafetyStatusText(cookingTemp)}`,
      logged_by: STAFF_MEMBERS[Math.floor(Math.random() * STAFF_MEMBERS.length)],
      created_at: new Date(`${dateStr}T${cookingTime}:00`).toISOString(),
    });
  }

  return temperatureLogs;
}
