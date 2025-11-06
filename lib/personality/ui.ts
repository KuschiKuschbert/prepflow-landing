// PrepFlow Personality System - UI Dispatchers

import { content } from './content';
import { type PersonalitySettings } from './schema';
import { getShiftBucket } from './utils';

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Get settings from localStorage (for use outside React)
function getSettings(): PersonalitySettings {
  if (typeof window === 'undefined') {
    return { enabled: false } as PersonalitySettings;
  }
  try {
    const stored = localStorage.getItem('prepflow-personality');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed as PersonalitySettings;
    }
  } catch {
    // Ignore errors
  }
  return { enabled: false } as PersonalitySettings;
}

export const dispatchToast = {
  pick(kind: 'mindful' | 'meta' | 'metrics' | 'chaos' | 'chefHabits' | 'moodShift'): string | null {
    const settings = getSettings();
    if (!settings.enabled) return null;

    let pool: string[] = [];

    if (kind === 'mindful' || kind === 'meta') {
      const spirit = settings.spirit as keyof typeof content.mindful;
      pool = (content[kind] as Record<string, string[]>)[spirit] || [];
    } else if (kind === 'moodShift') {
      const bucket = getShiftBucket();
      pool = content.moodShift[bucket] || [];
    } else {
      pool = (content[kind] as string[]) || [];
    }

    if (!pool.length) return null;

    const message = pick(pool);
    return message;
  },
};

export const dispatchVisual = {
  random() {
    if (typeof window === 'undefined') return;
    const settings = getSettings();
    if (!settings.enabled || !settings.visualDelights) return;
    // Trigger steam puff via DOM class
    document.documentElement.classList.add('pf-steam-on');
    setTimeout(() => {
      document.documentElement.classList.remove('pf-steam-on');
    }, 2000);
  },
};

export const dispatchSeasonal = {
  maybeShow() {
    if (typeof window === 'undefined') return;
    const settings = getSettings();
    if (!settings.enabled || !settings.seasonalLogoEvents) return;

    const { checkSeasonalMatch } = require('./utils');
    const effect = checkSeasonalMatch();
    if (effect) {
      document.documentElement.setAttribute('data-seasonal', effect);
    }
  },
};
