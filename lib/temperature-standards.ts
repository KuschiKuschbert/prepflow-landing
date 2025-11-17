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
    cold: { min: 0, max: 5, description: 'Cold storage (Queensland Health): 0-5°C' },
    hot: { min: 60, max: 75, description: 'Hot holding (Queensland Health): ≥60°C' },
    freezer: { min: -24, max: -18, description: 'Freezer (Queensland Health): -24°C to -18°C' },
    dangerZone: { min: 5, max: 60, description: 'Temperature Danger Zone: 5°C to 60°C' },
  },
  US: {
    cold: { min: -2, max: 4, description: 'Cold storage (FDA): ≤4°C (40°F)' },
    hot: { min: 60, max: 75, description: 'Hot holding (FDA): ≥60°C (140°F)' },
    freezer: { min: -25, max: -18, description: 'Freezer (FDA): ≤-18°C (0°F)' },
    dangerZone: { min: 4, max: 60, description: 'Temperature Danger Zone: 4°C to 60°C' },
  },
  UK: {
    cold: { min: 0, max: 5, description: 'Cold storage (FSA): ≤5°C (41°F)' },
    hot: { min: 63, max: 75, description: 'Hot holding (FSA): ≥63°C (145°F)' },
    freezer: { min: -25, max: -18, description: 'Freezer (FSA): ≤-18°C (0°F)' },
    dangerZone: { min: 5, max: 63, description: 'Temperature Danger Zone: 5°C to 63°C' },
  },
  EU: {
    cold: { min: 0, max: 4, description: 'Cold storage (EU): ≤4°C (39°F)' },
    hot: { min: 63, max: 75, description: 'Hot holding (EU): ≥63°C (145°F)' },
    freezer: { min: -25, max: -18, description: 'Freezer (EU): ≤-18°C (0°F)' },
    dangerZone: { min: 4, max: 63, description: 'Temperature Danger Zone: 4°C to 63°C' },
  },
  CA: {
    cold: { min: -2, max: 4, description: 'Cold storage (CFIA): ≤4°C (40°F)' },
    hot: { min: 60, max: 75, description: 'Hot holding (CFIA): ≥60°C (140°F)' },
    freezer: { min: -25, max: -18, description: 'Freezer (CFIA): ≤-18°C (0°F)' },
    dangerZone: { min: 4, max: 60, description: 'Temperature Danger Zone: 4°C to 60°C' },
  },
  NZ: {
    cold: { min: 0, max: 5, description: 'Cold storage (NZFSA): 0-5°C' },
    hot: { min: 60, max: 75, description: 'Hot holding (NZFSA): ≥60°C' },
    freezer: { min: -24, max: -18, description: 'Freezer (NZFSA): -24°C to -18°C' },
    dangerZone: { min: 5, max: 60, description: 'Temperature Danger Zone: 5°C to 60°C' },
  },
};

export function getTemperatureStandards(countryCode: string): TemperatureStandards {
  return TEMPERATURE_STANDARDS[countryCode.toUpperCase()] || TEMPERATURE_STANDARDS.AU;
}

export function getRecommendedTempRange(
  equipmentType: string,
  countryCode: string,
): { min: number; max: number } {
  const standards = getTemperatureStandards(countryCode);
  const type = equipmentType.toLowerCase();
  if (type.includes('freezer')) return { min: standards.freezer.min, max: standards.freezer.max };
  if (type.includes('hot') || type.includes('warming') || type.includes('steam'))
    return { min: standards.hot.min, max: standards.hot.max || standards.hot.min + 15 };
  return { min: standards.cold.min, max: standards.cold.max };
}

export function isTempInSafeRange(
  temp: number,
  equipmentType: string,
  countryCode: string,
): boolean {
  const range = getRecommendedTempRange(equipmentType, countryCode);
  return temp >= range.min && temp <= range.max;
}

export function getStricterTempRange(
  regionalRange: { min: number; max: number },
  equipmentMin: number | null,
  equipmentMax: number | null,
): { min: number; max: number } {
  let min = regionalRange.min;
  let max = regionalRange.max;
  if (equipmentMin !== null && equipmentMin > min) min = equipmentMin;
  if (equipmentMax !== null && equipmentMax < max) max = equipmentMax;
  return { min, max };
}
