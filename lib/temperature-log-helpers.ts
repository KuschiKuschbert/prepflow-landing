/**
 * Helper functions for temperature log generation (legacy endpoint)
 */

export interface EquipmentConfig {
  name: string;
  equipment_type: string;
  min_temp_celsius: number;
  max_temp_celsius: number;
}

/**
 * Generate realistic temperature based on equipment type and time of day
 */
export function generateRealisticTemperature(
  equipment: EquipmentConfig,
  timeOfDay: 'morning' | 'evening',
): number {
  const { equipment_type, min_temp_celsius, max_temp_celsius } = equipment;

  let baseTemp: number;
  let variation: number;

  switch (equipment_type) {
    case 'fridge':
    case 'walk_in_cooler':
    case 'reach_in_cooler':
      baseTemp = 4;
      variation = 2;
      break;
    case 'freezer':
    case 'walk_in_freezer':
      baseTemp = -18;
      variation = 3;
      break;
    case 'bain_marie':
      baseTemp = 75;
      variation = 5;
      break;
    case 'hot_cabinet':
      baseTemp = 65;
      variation = 5;
      break;
    default:
      baseTemp = (min_temp_celsius + max_temp_celsius) / 2;
      variation = (max_temp_celsius - min_temp_celsius) / 4;
  }

  const timeVariation = timeOfDay === 'evening' ? 0.5 : 0;
  const randomVariation = (Math.random() - 0.5) * variation;
  const finalTemp = baseTemp + timeVariation + randomVariation;

  if (min_temp_celsius && max_temp_celsius) {
    return Math.max(min_temp_celsius - 2, Math.min(max_temp_celsius + 2, finalTemp));
  }

  return Math.round(finalTemp * 10) / 10;
}

/**
 * Generate food temperatures
 */
export function generateFoodTemperature(type: 'hot_holding' | 'cold_holding' | 'cooking'): number {
  switch (type) {
    case 'hot_holding':
      return 65 + (Math.random() - 0.5) * 10;
    case 'cold_holding':
      return 3 + (Math.random() - 0.5) * 4;
    case 'cooking':
      return 75 + (Math.random() - 0.5) * 10;
    default:
      return 20;
  }
}

/**
 * Get temperature status text
 */
export function getTemperatureStatusText(temp: number, equipment: EquipmentConfig): string {
  if (equipment.min_temp_celsius && equipment.max_temp_celsius) {
    if (temp < equipment.min_temp_celsius) {
      return 'Below minimum range';
    } else if (temp > equipment.max_temp_celsius) {
      return 'Above maximum range';
    } else {
      return 'Within safe range';
    }
  }
  return 'Temperature logged';
}

/**
 * Get food safety status text
 */
export function getFoodSafetyStatusText(temp: number): string {
  if (temp < 5) {
    return 'Safe - below danger zone';
  } else if (temp > 60) {
    return 'Safe - above danger zone';
  } else {
    return 'In danger zone - monitor closely';
  }
}
