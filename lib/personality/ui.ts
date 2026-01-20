// PrepFlow Personality System - UI Dispatchers

import { content } from './content';
import { type PersonalitySettings } from './schema';
import { checkSeasonalMatch, getCurrentContext, getShiftBucket } from './utils';

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
  pick(
    kind: 'mindful' | 'meta' | 'metrics' | 'chaos' | 'chefHabits' | 'moodShift' | 'context',
  ): string | null {
    const settings = getSettings();
    if (!settings.enabled) return null;

    let pool: string[] = [];

    if (kind === 'mindful' || kind === 'meta') {
      const spirit = settings.spirit as keyof typeof content.mindful;
      pool = (content[kind] as Record<string, string[]>)[spirit] || [];
    } else if (kind === 'moodShift') {
      const bucket = getShiftBucket();
      pool = content.moodShift[bucket] || [];
    } else if (kind === 'context') {
      const context = getCurrentContext();
      if (context && content.context[context]) {
        const spirit = settings.spirit as keyof typeof content.context.ingredients;
        pool = content.context[context][spirit] || [];
      }
    } else {
      pool = (content[kind] as string[]) || [];
    }

    if (!pool.length) return null;

    const message = pick(pool);
    return message;
  },
};

export const dispatchErrorPersonality = {
  pick(errorType: 'validation' | 'network' | 'server' | 'notFound'): string | null {
    const settings = getSettings();
    if (!settings.enabled) return null;

    const spirit = settings.spirit as keyof typeof content.errors.validation;
    const pool = content.errors[errorType]?.[spirit] || [];

    if (!pool.length) return null;

    return pick(pool);
  },
};

export const dispatchSuccessCelebration = {
  pick(actionType: 'create' | 'update' | 'delete', isMilestone = false): string | null {
    const settings = getSettings();
    if (!settings.enabled) return null;

    if (isMilestone) {
      const pool = content.success.milestone || [];
      if (pool.length) return pick(pool);
    }

    const spirit = settings.spirit as keyof typeof content.success.create;
    const pool = content.success[actionType]?.[spirit] || [];

    if (!pool.length) return null;

    return pick(pool);
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
  sparkle() {
    if (typeof window === 'undefined') return;
    const settings = getSettings();
    if (!settings.enabled || !settings.visualDelights) return;
    document.documentElement.classList.add('pf-sparkle-on');
    setTimeout(() => {
      document.documentElement.classList.remove('pf-sparkle-on');
    }, 1500);
  },
  shake(element?: HTMLElement) {
    if (typeof window === 'undefined') return;
    const settings = getSettings();
    if (!settings.enabled || !settings.visualDelights) return;
    const target = element || document.documentElement;
    target.classList.add('pf-shake-on');
    setTimeout(() => {
      target.classList.remove('pf-shake-on');
    }, 500);
  },
  celebrationGlow(element?: HTMLElement) {
    if (typeof window === 'undefined') return;
    const settings = getSettings();
    if (!settings.enabled || !settings.visualDelights) return;
    const target = element || document.documentElement;
    target.classList.add('pf-celebration-glow');
    setTimeout(() => {
      target.classList.remove('pf-celebration-glow');
    }, 2000);
  },
};

export const dispatchSeasonal = {
  maybeShow() {
    if (typeof window === 'undefined') return;
    const settings = getSettings();
    if (!settings.enabled || !settings.seasonalLogoEvents) return;

    const effect = checkSeasonalMatch();
    if (effect) {
      document.documentElement.setAttribute('data-seasonal', effect);
    }
  },
};
