// PrepFlow Personality System - Schema & Types

export const SPIRITS = ['zen', 'spicy', 'wise', 'passive', 'gremlin'] as const;

export type Spirit = (typeof SPIRITS)[number];

export interface PersonalitySettings {
  enabled: boolean;
  spirit: Spirit;
  moodShiftMessages: boolean;
  chefHabits: boolean;
  chaosReports: boolean;
  imaginaryMetrics: boolean;
  mindfulMoments: boolean;
  metaMoments: boolean;
  seasonalLogoEvents: boolean;
  visualDelights: boolean;
  footerEasterEggs: boolean;
  voiceReactions: boolean;
  silencedUntil?: number; // timestamp for 24h silence
}

const DEFAULT_SETTINGS: PersonalitySettings = {
  enabled: true,
  spirit: 'zen',
  moodShiftMessages: true,
  chefHabits: true,
  chaosReports: true,
  imaginaryMetrics: true,
  mindfulMoments: true,
  metaMoments: true,
  seasonalLogoEvents: true,
  visualDelights: true,
  footerEasterEggs: true,
  voiceReactions: false,
};

// Runtime validation helper
export function validateSpirit(value: unknown): Spirit {
  if (typeof value === 'string' && SPIRITS.includes(value as Spirit)) {
    return value as Spirit;
  }
  return 'zen';
}

export function getDefaultSettings(): PersonalitySettings {
  return { ...DEFAULT_SETTINGS };
}

export function validateSettings(settings: unknown): PersonalitySettings {
  if (!settings || typeof settings !== 'object') {
    return getDefaultSettings();
  }

  const s = settings as Partial<PersonalitySettings>;

  return {
    enabled: typeof s.enabled === 'boolean' ? s.enabled : DEFAULT_SETTINGS.enabled,
    spirit: validateSpirit(s.spirit),
    moodShiftMessages:
      typeof s.moodShiftMessages === 'boolean'
        ? s.moodShiftMessages
        : DEFAULT_SETTINGS.moodShiftMessages,
    chefHabits: typeof s.chefHabits === 'boolean' ? s.chefHabits : DEFAULT_SETTINGS.chefHabits,
    chaosReports:
      typeof s.chaosReports === 'boolean' ? s.chaosReports : DEFAULT_SETTINGS.chaosReports,
    imaginaryMetrics:
      typeof s.imaginaryMetrics === 'boolean'
        ? s.imaginaryMetrics
        : DEFAULT_SETTINGS.imaginaryMetrics,
    mindfulMoments:
      typeof s.mindfulMoments === 'boolean' ? s.mindfulMoments : DEFAULT_SETTINGS.mindfulMoments,
    metaMoments: typeof s.metaMoments === 'boolean' ? s.metaMoments : DEFAULT_SETTINGS.metaMoments,
    seasonalLogoEvents:
      typeof s.seasonalLogoEvents === 'boolean'
        ? s.seasonalLogoEvents
        : DEFAULT_SETTINGS.seasonalLogoEvents,
    visualDelights:
      typeof s.visualDelights === 'boolean' ? s.visualDelights : DEFAULT_SETTINGS.visualDelights,
    footerEasterEggs:
      typeof s.footerEasterEggs === 'boolean'
        ? s.footerEasterEggs
        : DEFAULT_SETTINGS.footerEasterEggs,
    voiceReactions:
      typeof s.voiceReactions === 'boolean' ? s.voiceReactions : DEFAULT_SETTINGS.voiceReactions,
    silencedUntil: typeof s.silencedUntil === 'number' ? s.silencedUntil : undefined,
  };
}
