/**
 * Regional Temperature Standards Configuration
 *
 * Defines country-specific food safety temperature standards based on
 * official health regulations (FDA, FSA, EU, etc.)
 */

export interface TemperatureStandards {
  cold: {
    min: number;
    max: number;
    description: string;
  };
  hot: {
    min: number;
    max?: number;
    description: string;
  };
  freezer: {
    min: number;
    max: number;
    description: string;
  };
  dangerZone: {
    min: number;
    max: number;
    description: string;
  };
}

const TEMPERATURE_STANDARDS: Record<string, TemperatureStandards> = {
  AU: {
    // Queensland Health standards
    cold: {
      min: 0,
      max: 5,
      description: 'Cold storage (Queensland Health): 0-5°C',
    },
    hot: {
      min: 60,
      max: 75,
      description: 'Hot holding (Queensland Health): ≥60°C',
    },
    freezer: {
      min: -24,
      max: -18,
      description: 'Freezer (Queensland Health): -24°C to -18°C',
    },
    dangerZone: {
      min: 5,
      max: 60,
      description: 'Temperature Danger Zone: 5°C to 60°C',
    },
  },
  US: {
    // FDA Food Code
    cold: {
      min: -2,
      max: 4,
      description: 'Cold storage (FDA): ≤4°C (40°F)',
    },
    hot: {
      min: 60,
      max: 75,
      description: 'Hot holding (FDA): ≥60°C (140°F)',
    },
    freezer: {
      min: -25,
      max: -18,
      description: 'Freezer (FDA): ≤-18°C (0°F)',
    },
    dangerZone: {
      min: 4,
      max: 60,
      description: 'Temperature Danger Zone: 4°C to 60°C',
    },
  },
  UK: {
    // Food Standards Agency
    cold: {
      min: 0,
      max: 5,
      description: 'Cold storage (FSA): ≤5°C (41°F)',
    },
    hot: {
      min: 63,
      max: 75,
      description: 'Hot holding (FSA): ≥63°C (145°F)',
    },
    freezer: {
      min: -25,
      max: -18,
      description: 'Freezer (FSA): ≤-18°C (0°F)',
    },
    dangerZone: {
      min: 5,
      max: 63,
      description: 'Temperature Danger Zone: 5°C to 63°C',
    },
  },
  EU: {
    // EU General Food Law / EFSA
    cold: {
      min: 0,
      max: 4,
      description: 'Cold storage (EU): ≤4°C (39°F)',
    },
    hot: {
      min: 63,
      max: 75,
      description: 'Hot holding (EU): ≥63°C (145°F)',
    },
    freezer: {
      min: -25,
      max: -18,
      description: 'Freezer (EU): ≤-18°C (0°F)',
    },
    dangerZone: {
      min: 4,
      max: 63,
      description: 'Temperature Danger Zone: 4°C to 63°C',
    },
  },
  CA: {
    // Canadian Food Inspection Agency (similar to US FDA)
    cold: {
      min: -2,
      max: 4,
      description: 'Cold storage (CFIA): ≤4°C (40°F)',
    },
    hot: {
      min: 60,
      max: 75,
      description: 'Hot holding (CFIA): ≥60°C (140°F)',
    },
    freezer: {
      min: -25,
      max: -18,
      description: 'Freezer (CFIA): ≤-18°C (0°F)',
    },
    dangerZone: {
      min: 4,
      max: 60,
      description: 'Temperature Danger Zone: 4°C to 60°C',
    },
  },
  NZ: {
    // New Zealand Food Safety Authority (similar to AU)
    cold: {
      min: 0,
      max: 5,
      description: 'Cold storage (NZFSA): 0-5°C',
    },
    hot: {
      min: 60,
      max: 75,
      description: 'Hot holding (NZFSA): ≥60°C',
    },
    freezer: {
      min: -24,
      max: -18,
      description: 'Freezer (NZFSA): -24°C to -18°C',
    },
    dangerZone: {
      min: 5,
      max: 60,
      description: 'Temperature Danger Zone: 5°C to 60°C',
    },
  },
};

/**
 * Get temperature standards for a specific country
 * @param countryCode Two-letter country code (AU, US, UK, EU, CA, NZ)
 * @returns Temperature standards for the country, or AU defaults if not found
 */
export function getTemperatureStandards(countryCode: string): TemperatureStandards {
  const normalizedCode = countryCode.toUpperCase();
  return TEMPERATURE_STANDARDS[normalizedCode] || TEMPERATURE_STANDARDS.AU;
}

/**
 * Get recommended temperature range for specific equipment type and country
 * @param equipmentType Equipment type (e.g., 'Cold Storage', 'Freezer', 'Hot Holding')
 * @param countryCode Two-letter country code
 * @returns Recommended min/max temperature range
 */
export function getRecommendedTempRange(
  equipmentType: string,
  countryCode: string,
): { min: number; max: number } {
  const standards = getTemperatureStandards(countryCode);
  const type = equipmentType.toLowerCase();

  if (type.includes('freezer')) {
    return {
      min: standards.freezer.min,
      max: standards.freezer.max,
    };
  }

  if (type.includes('hot') || type.includes('warming') || type.includes('steam')) {
    return {
      min: standards.hot.min,
      max: standards.hot.max || standards.hot.min + 15,
    };
  }

  // Default to cold storage
  return {
    min: standards.cold.min,
    max: standards.cold.max,
  };
}

/**
 * Check if a temperature is within safe range for equipment type and country
 * @param temp Temperature in Celsius
 * @param equipmentType Equipment type
 * @param countryCode Two-letter country code
 * @returns True if temperature is safe, false otherwise
 */
export function isTempInSafeRange(
  temp: number,
  equipmentType: string,
  countryCode: string,
): boolean {
  const range = getRecommendedTempRange(equipmentType, countryCode);
  return temp >= range.min && temp <= range.max;
}

/**
 * Get stricter temperature range (comparing regional standards vs equipment settings)
 * Used when generating temperature logs - use the more restrictive range
 */
export function getStricterTempRange(
  regionalRange: { min: number; max: number },
  equipmentMin: number | null,
  equipmentMax: number | null,
): { min: number; max: number } {
  let min = regionalRange.min;
  let max = regionalRange.max;

  // Use stricter minimum (higher value)
  if (equipmentMin !== null && equipmentMin > min) {
    min = equipmentMin;
  }

  // Use stricter maximum (lower value)
  if (equipmentMax !== null && equipmentMax < max) {
    max = equipmentMax;
  }

  return { min, max };
}
