// PrepFlow Personality System - Presets by Spirit

import { type PersonalitySettings } from './schema';

export const PRESETS: Record<string, Partial<PersonalitySettings>> = {
  zen: {
    mindfulMoments: true,
    imaginaryMetrics: true,
    metaMoments: false,
    chefHabits: false,
    chaosReports: false,
  },
  spicy: {
    mindfulMoments: true,
    imaginaryMetrics: true,
    metaMoments: true,
    chefHabits: true,
    chaosReports: true,
  },
  wise: {
    mindfulMoments: true,
    imaginaryMetrics: true,
    metaMoments: true,
    chefHabits: false,
    chaosReports: true,
  },
  passive: {
    mindfulMoments: false,
    imaginaryMetrics: true,
    metaMoments: true,
    chefHabits: true,
    chaosReports: true,
  },
  gremlin: {
    mindfulMoments: true,
    imaginaryMetrics: true,
    metaMoments: true,
    chefHabits: true,
    chaosReports: true,
    footerEasterEggs: true,
  },
};
