// PrepFlow Adaptive Navigation Optimization - Schema & Types

export interface AdaptiveNavSettings {
  enabled: boolean;
  selectedSections: string[]; // Array of category names to optimize
  lastUpdated?: number; // timestamp
}

const DEFAULT_SETTINGS: AdaptiveNavSettings = {
  enabled: false,
  selectedSections: [],
};

/**
 * Get default adaptive navigation settings.
 *
 * @returns {AdaptiveNavSettings} Default settings object
 */
export function getDefaultSettings(): AdaptiveNavSettings {
  return { ...DEFAULT_SETTINGS };
}

/**
 * Validate adaptive navigation settings.
 *
 * @param {unknown} settings - Settings to validate
 * @returns {AdaptiveNavSettings} Validated settings object
 */
export function validateSettings(settings: unknown): AdaptiveNavSettings {
  if (!settings || typeof settings !== 'object') {
    return getDefaultSettings();
  }

  const s = settings as Partial<AdaptiveNavSettings>;

  return {
    enabled: typeof s.enabled === 'boolean' ? s.enabled : DEFAULT_SETTINGS.enabled,
    selectedSections: Array.isArray(s.selectedSections)
      ? s.selectedSections.filter((item): item is string => typeof item === 'string')
      : DEFAULT_SETTINGS.selectedSections,
    lastUpdated: typeof s.lastUpdated === 'number' ? s.lastUpdated : undefined,
  };
}

/**
 * Navigation usage log entry.
 */
export interface NavigationUsageLog {
  href: string;
  timestamp: number;
  dayOfWeek: number; // 0-6 (Sunday = 0)
  hourOfDay: number; // 0-23
  timeSpent?: number; // milliseconds
  returnFrequency?: number; // visits per week
}

/**
 * Navigation usage pattern for a specific time slot.
 */
export interface NavigationPattern {
  href: string;
  hourOfDay: number;
  dayOfWeek?: number; // Optional: specific day, or undefined for all days
  frequency: number; // Number of times used at this time
  averageTimeSpent: number; // Average time spent in milliseconds
  returnFrequency: number; // Average return frequency
  score: number; // Calculated score for optimization
}

/**
 * Optimization result containing reordered navigation items.
 */
export interface OptimizationResult {
  items: Array<{
    href: string;
    originalIndex: number;
    optimizedIndex: number;
    score: number;
  }>;
  lastCalculated: number; // timestamp
  patternVersion: number; // Increments when patterns change
}

