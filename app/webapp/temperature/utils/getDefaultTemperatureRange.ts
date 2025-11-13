/**
 * Get default temperature range for equipment type based on Queensland Food Safety Standards
 * @param equipmentType Equipment type value (fridge, freezer, food_cooking, etc.)
 * @param equipmentName Optional equipment name for fallback detection
 * @returns Default min and max temperature in Celsius, or null if not applicable
 */
export function getDefaultTemperatureRange(
  equipmentType: string,
  equipmentName?: string,
): {
  minTemp: number | null;
  maxTemp: number | null;
} {
  const type = equipmentType.toLowerCase();
  const name = equipmentName?.toLowerCase() || '';

  // Freezer: -24°C to -18°C (Queensland standard)
  if (type === 'freezer') {
    return {
      minTemp: -24,
      maxTemp: -18,
    };
  }

  // Hot Holding: ≥60°C (Queensland standard)
  if (type === 'food_hot_holding') {
    return {
      minTemp: 60,
      maxTemp: 75, // Upper limit for practical purposes
    };
  }

  // Cold Holding: 0°C to 5°C (Queensland standard)
  if (type === 'food_cold_holding') {
    return {
      minTemp: 0,
      maxTemp: 5,
    };
  }

  // Fridge: 0°C to 5°C (Queensland standard)
  if (type === 'fridge') {
    return {
      minTemp: 0,
      maxTemp: 5,
    };
  }

  // Food Cooking: Typically 60°C+ but varies, so we'll set a safe range
  if (type === 'food_cooking') {
    return {
      minTemp: 60,
      maxTemp: null, // No upper limit for cooking
    };
  }

  // Storage: Default to cold storage range
  if (type === 'storage') {
    return {
      minTemp: 0,
      maxTemp: 5,
    };
  }

  // Fallback: Check equipment name for keywords if type didn't match
  if (name.includes('freezer') || name.includes('frozen')) {
    return {
      minTemp: -24,
      maxTemp: -18,
    };
  }

  if (name.includes('hot') || name.includes('warming') || name.includes('steam') || name.includes('bain marie')) {
    return {
      minTemp: 60,
      maxTemp: 75,
    };
  }

  if (name.includes('cold') || name.includes('fridge') || name.includes('refrigerator') || name.includes('cooler')) {
    return {
      minTemp: 0,
      maxTemp: 5,
    };
  }

  // Default: No automatic range (user must set manually)
  return {
    minTemp: null,
    maxTemp: null,
  };
}
