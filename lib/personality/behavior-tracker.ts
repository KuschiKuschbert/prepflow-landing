// PrepFlow Personality System - Behavior Tracker

const STORAGE_KEY = 'prepflow-behavior';

export interface BehaviorProfile {
  saveFrequency: 'low' | 'medium' | 'high'; // Based on saves per session
  sessionDuration: 'short' | 'medium' | 'long'; // Based on average session time
  userExperience: 'new' | 'experienced'; // Based on total usage
  featureUsage: {
    ingredients: number;
    recipes: number;
    cogs: number;
    performance: number;
    temperature: number;
    menu: number;
  };
  timeOfDayUsage: {
    morning: number;
    lunch: number;
    evening: number;
    late: number;
  };
  lastUpdated: number;
}

function getDefaultProfile(): BehaviorProfile {
  return {
    saveFrequency: 'medium',
    sessionDuration: 'medium',
    userExperience: 'new',
    featureUsage: {
      ingredients: 0,
      recipes: 0,
      cogs: 0,
      performance: 0,
      temperature: 0,
      menu: 0,
    },
    timeOfDayUsage: {
      morning: 0,
      lunch: 0,
      evening: 0,
      late: 0,
    },
    lastUpdated: Date.now(),
  };
}

function loadProfile(): BehaviorProfile {
  if (typeof window === 'undefined') return getDefaultProfile();

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...getDefaultProfile(), ...JSON.parse(stored) };
    }
  } catch {
    // Ignore errors
  }

  return getDefaultProfile();
}

function saveProfile(profile: BehaviorProfile): void {
  if (typeof window === 'undefined') return;

  try {
    profile.lastUpdated = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // Ignore errors
  }
}

/**
 * Track a save action
 */
export function trackSave(): void {
  const profile = loadProfile();
  const now = Date.now();
  const timeSinceLastUpdate = now - profile.lastUpdated;

  // Update save frequency based on saves per minute
  // This is simplified - in a real system, you'd track saves per session
  if (timeSinceLastUpdate < 60000) {
    // Less than 1 minute since last update = high frequency
    profile.saveFrequency = 'high';
  } else if (timeSinceLastUpdate < 300000) {
    // 1-5 minutes = medium frequency
    profile.saveFrequency = 'medium';
  } else {
    // More than 5 minutes = low frequency
    profile.saveFrequency = 'low';
  }

  saveProfile(profile);
}

/**
 * Track feature usage
 */
export function trackFeatureUsage(feature: keyof BehaviorProfile['featureUsage']): void {
  const profile = loadProfile();
  profile.featureUsage[feature] = (profile.featureUsage[feature] || 0) + 1;

  // Update user experience based on total feature usage
  const totalUsage = Object.values(profile.featureUsage).reduce((sum, count) => sum + count, 0);
  profile.userExperience = totalUsage > 50 ? 'experienced' : 'new';

  saveProfile(profile);
}

/**
 * Track time of day usage
 */
export function trackTimeOfDayUsage(bucket: 'morning' | 'lunch' | 'evening' | 'late'): void {
  const profile = loadProfile();
  profile.timeOfDayUsage[bucket] = (profile.timeOfDayUsage[bucket] || 0) + 1;
  saveProfile(profile);
}

/**
 * Track session duration (call when session ends)
 */
export function trackSessionDuration(durationMs: number): void {
  const profile = loadProfile();
  const durationMinutes = durationMs / 60000;

  if (durationMinutes < 5) {
    profile.sessionDuration = 'short';
  } else if (durationMinutes < 30) {
    profile.sessionDuration = 'medium';
  } else {
    profile.sessionDuration = 'long';
  }

  saveProfile(profile);
}

/**
 * Get current behavior profile
 */
export function getBehaviorProfile(): BehaviorProfile {
  return loadProfile();
}

