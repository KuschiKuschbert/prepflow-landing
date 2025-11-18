import { TemperatureEquipment } from '../../types';

/**
 * Temperature status utilities.
 */

/**
 * Get temperature status (low, high, or normal) based on equipment thresholds.
 *
 * @param {number} temp - Current temperature
 * @param {string} location - Equipment location/name
 * @param {TemperatureEquipment[]} equipment - Array of temperature equipment
 * @returns {'low' | 'high' | 'normal'} Temperature status
 */
export function getTemperatureStatus(
  temp: number,
  location: string,
  equipment: TemperatureEquipment[],
): 'low' | 'high' | 'normal' {
  // Match equipment by name OR location field
  const equipmentItem = equipment.find(e => e.name === location || e.location === location);
  if (!equipmentItem || !equipmentItem.is_active) return 'normal';
  // Check for null/undefined explicitly (0 is a valid temperature)
  if (
    equipmentItem.min_temp_celsius !== null &&
    equipmentItem.min_temp_celsius !== undefined &&
    temp < equipmentItem.min_temp_celsius
  )
    return 'low';
  if (
    equipmentItem.max_temp_celsius !== null &&
    equipmentItem.max_temp_celsius !== undefined &&
    temp > equipmentItem.max_temp_celsius
  )
    return 'high';
  return 'normal';
}

/**
 * Get food safety status based on temperature and time in danger zone.
 *
 * @param {number} temp - Current temperature
 * @param {string} logTime - Log time string
 * @param {string} logDate - Log date string
 * @param {string} type - Equipment type
 * @returns {Object | null} Food safety status object or null
 */
export function getFoodSafetyStatus(
  temp: number,
  logTime: string,
  logDate: string,
  type: string,
): null | { status: 'safe' | 'warning' | 'danger'; message: string; color: string; icon: string } {
  if (type !== 'food_cooking' && type !== 'food_hot_holding' && type !== 'food_cold_holding')
    return null;
  if (temp < 5 || temp > 60)
    return { status: 'safe', message: 'Outside danger zone', color: 'text-green-400', icon: '✅' };
  const logDateTime = new Date(`${logDate}T${logTime}`);
  const now = new Date();
  const hoursInDangerZone = (now.getTime() - logDateTime.getTime()) / (1000 * 60 * 60);
  if (hoursInDangerZone < 2) {
    return {
      status: 'safe',
      message: `${(2 - hoursInDangerZone).toFixed(1)}h remaining - can refrigerate`,
      color: 'text-green-400',
      icon: '✅',
    };
  } else if (hoursInDangerZone < 4) {
    return {
      status: 'warning',
      message: `${(4 - hoursInDangerZone).toFixed(1)}h remaining - use immediately`,
      color: 'text-yellow-400',
      icon: '⚠️',
    };
  } else {
    return {
      status: 'danger',
      message: `${hoursInDangerZone.toFixed(1)}h in danger zone - DISCARD`,
      color: 'text-red-400',
      icon: '🚨',
    };
  }
}

/**
 * Get status color classes based on status string.
 *
 * @param {string} status - Status string (high, low, or normal)
 * @returns {string} Tailwind CSS classes for status color
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case 'high':
      return 'text-red-400 bg-red-400/10 border-red-400/20';
    case 'low':
      return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    default:
      return 'text-green-400 bg-green-400/10 border-green-400/20';
  }
}
