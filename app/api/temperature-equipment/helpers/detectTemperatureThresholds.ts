/**
 * Automatically detect temperature thresholds based on equipment name and type.
 * Uses Queensland food safety standards as the baseline.
 *
 * @param {string} name - Equipment name
 * @param {string} equipmentType - Equipment type (fridge, freezer, food_cooking, etc.)
 * @returns {Object} Object with min_temp_celsius and max_temp_celsius
 */
export function detectTemperatureThresholds(
  name: string,
  equipmentType: string,
): { min_temp_celsius: number | null; max_temp_celsius: number | null } {
  if (!name && !equipmentType) {
    // No information to detect from - return nulls
    return {
      min_temp_celsius: null,
      max_temp_celsius: null,
    };
  }

  const nameLower = (name || '').toLowerCase();
  const typeLower = (equipmentType || '').toLowerCase();

  // Check equipment type first (more reliable)
  // Freezer equipment
  if (
    typeLower === 'freezer' ||
    nameLower.includes('freezer') ||
    nameLower.includes('frozen') ||
    nameLower.includes('deep freeze')
  ) {
    return {
      min_temp_celsius: -24, // Optimal minimum freezer temperature
      max_temp_celsius: -18, // Queensland freezer standard - must be at or below -18°C
    };
  }

  // Hot holding equipment - check type first, then name patterns
  if (
    typeLower === 'food_hot_holding' ||
    typeLower === 'food_cooking' ||
    nameLower.includes('hot') ||
    nameLower.includes('warming') ||
    nameLower.includes('steam') ||
    nameLower.includes('bain marie') ||
    nameLower.includes('bain-marie') ||
    nameLower.includes('hot holding') ||
    nameLower.includes('hot-holding') ||
    nameLower.includes('heat') ||
    nameLower.includes('warmer')
  ) {
    return {
      min_temp_celsius: 60, // Queensland hot holding standard
      max_temp_celsius: null, // No upper limit for hot holding
    };
  }

  // Cold holding equipment
  if (
    typeLower === 'food_cold_holding' ||
    nameLower.includes('cold holding') ||
    nameLower.includes('cold-holding')
  ) {
    return {
      min_temp_celsius: 0, // Minimum temperature for cold holding
      max_temp_celsius: 5, // Queensland cold holding standard - must be at or below 5°C
    };
  }

  // Storage equipment (fridges, walk-ins, etc.)
  if (
    typeLower === 'storage' ||
    typeLower === 'fridge' ||
    nameLower.includes('fridge') ||
    nameLower.includes('refrigerator') ||
    nameLower.includes('cooler') ||
    nameLower.includes('walk-in') ||
    nameLower.includes('walkin') ||
    nameLower.includes('cold room') ||
    nameLower.includes('coldroom') ||
    nameLower.includes('chiller')
  ) {
    return {
      min_temp_celsius: 0, // Minimum temperature for cold storage
      max_temp_celsius: 5, // Queensland cold storage standard - must be at or below 5°C
    };
  }

  // Default to cold storage if no match (safest default for food safety)
  return {
    min_temp_celsius: 0,
    max_temp_celsius: 5,
  };
}
