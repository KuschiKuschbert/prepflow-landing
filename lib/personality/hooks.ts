// PrepFlow Personality System - Action Hooks

'use client';

import { useCallback } from 'react';
import { usePersonality } from './store';
import { dispatchToast, dispatchSuccessCelebration } from './ui';
import {
  trackSave as trackAchievementSave,
  trackRecipeCreated,
  trackIngredientAdded,
  trackDishCreated,
  trackCOGSCalculated,
  trackPerformanceAnalyzed,
  trackTemperatureLogged,
  trackRecipeShared,
  trackMenuBuilt,
} from './achievement-tracker';
import { trackSave as trackBehaviorSave, trackFeatureUsage } from './behavior-tracker';
import { getCurrentContext } from './utils';

export function useOnSave() {
  const { settings } = usePersonality();

  return useCallback(() => {
    if (!settings.enabled) return;

    // Track save for achievements
    const achievementId = trackAchievementSave();
    if (achievementId) {
      // Achievement celebration will be handled by AchievementToast component
      // Show success message with milestone flag
      const msg = dispatchSuccessCelebration.pick('update', true);
      if (msg) {
        window.dispatchEvent(new CustomEvent('personality:addToast', { detail: { message: msg } }));
      }
    }

    // Track save for behavior analysis
    trackBehaviorSave();

    // Track feature usage based on current context
    const context = getCurrentContext();
    if (context) {
      trackFeatureUsage(context);
    }

    // Context-aware messages (20% chance - higher priority)
    if (Math.random() < 0.2) {
      const msg = dispatchToast.pick('context');
      if (msg) {
        window.dispatchEvent(new CustomEvent('personality:addToast', { detail: { message: msg } }));
        return; // Context messages take priority, skip others
      }
    }

    // Chef habits (always on save)
    if (settings.chefHabits && Math.random() < 0.3) {
      const msg = dispatchToast.pick('chefHabits');
      if (msg) {
        window.dispatchEvent(new CustomEvent('personality:addToast', { detail: { message: msg } }));
      }
    }

    // Meta moments (10% chance)
    if (settings.metaMoments && Math.random() < 0.1) {
      const msg = dispatchToast.pick('meta');
      if (msg) {
        window.dispatchEvent(new CustomEvent('personality:addToast', { detail: { message: msg } }));
      }
    }

    // Imaginary metrics (15% chance)
    if (settings.imaginaryMetrics && Math.random() < 0.15) {
      const msg = dispatchToast.pick('metrics');
      if (msg) {
        window.dispatchEvent(new CustomEvent('personality:addToast', { detail: { message: msg } }));
      }
    }
  }, [settings]);
}

/**
 * Hook to track recipe creation and check for achievements
 */
export function useOnRecipeCreated() {
  const { settings } = usePersonality();

  return useCallback(() => {
    if (!settings.enabled) return;

    // Track feature usage
    trackFeatureUsage('recipes');

    const achievementId = trackRecipeCreated();
    if (achievementId) {
      // Achievement celebration handled by AchievementToast
      const msg = dispatchSuccessCelebration.pick('create', true);
      if (msg) {
        window.dispatchEvent(new CustomEvent('personality:addToast', { detail: { message: msg } }));
      }
    } else {
      // Regular success message
      const msg = dispatchSuccessCelebration.pick('create', false);
      if (msg) {
        window.dispatchEvent(new CustomEvent('personality:addToast', { detail: { message: msg } }));
      }
    }
  }, [settings]);
}

/**
 * Hook to track ingredient addition and check for achievements
 */
export function useOnIngredientAdded() {
  const { settings } = usePersonality();

  return useCallback(() => {
    if (!settings.enabled) return;

    // Track feature usage
    trackFeatureUsage('ingredients');

    const achievementId = trackIngredientAdded();
    if (achievementId) {
      const msg = dispatchSuccessCelebration.pick('create', true);
      if (msg) {
        window.dispatchEvent(new CustomEvent('personality:addToast', { detail: { message: msg } }));
      }
    }
  }, [settings]);
}

/**
 * Hook to track dish creation and check for achievements
 */
export function useOnDishCreated() {
  const { settings } = usePersonality();

  return useCallback(() => {
    if (!settings.enabled) return;

    // Track feature usage
    trackFeatureUsage('menu');

    const achievementId = trackDishCreated();
    if (achievementId) {
      const msg = dispatchSuccessCelebration.pick('create', true);
      if (msg) {
        window.dispatchEvent(new CustomEvent('personality:addToast', { detail: { message: msg } }));
      }
    } else {
      const msg = dispatchSuccessCelebration.pick('create', false);
      if (msg) {
        window.dispatchEvent(new CustomEvent('personality:addToast', { detail: { message: msg } }));
      }
    }
  }, [settings]);
}

/**
 * Hook to track COGS calculation and check for achievements
 */
export function useOnCOGSCalculated() {
  const { settings } = usePersonality();

  return useCallback(() => {
    if (!settings.enabled) return;

    // Track feature usage
    trackFeatureUsage('cogs');

    const achievementId = trackCOGSCalculated();
    if (achievementId) {
      const msg = dispatchSuccessCelebration.pick('update', true);
      if (msg) {
        window.dispatchEvent(new CustomEvent('personality:addToast', { detail: { message: msg } }));
      }
    }
  }, [settings]);
}

/**
 * Hook to track performance analysis and check for achievements
 */
export function useOnPerformanceAnalyzed() {
  const { settings } = usePersonality();

  return useCallback(() => {
    if (!settings.enabled) return;

    // Track feature usage
    trackFeatureUsage('performance');

    const achievementId = trackPerformanceAnalyzed();
    if (achievementId) {
      const msg = dispatchSuccessCelebration.pick('update', true);
      if (msg) {
        window.dispatchEvent(new CustomEvent('personality:addToast', { detail: { message: msg } }));
      }
    }
  }, [settings]);
}

/**
 * Hook to track temperature logging and check for achievements
 */
export function useOnTemperatureLogged() {
  const { settings } = usePersonality();

  return useCallback(() => {
    if (!settings.enabled) return;

    // Track feature usage
    trackFeatureUsage('temperature');

    const achievementId = trackTemperatureLogged();
    if (achievementId) {
      const msg = dispatchSuccessCelebration.pick('create', true);
      if (msg) {
        window.dispatchEvent(new CustomEvent('personality:addToast', { detail: { message: msg } }));
      }
    }
  }, [settings]);
}

/**
 * Hook to track recipe sharing and check for achievements
 */
export function useOnRecipeShared() {
  const { settings } = usePersonality();

  return useCallback(() => {
    if (!settings.enabled) return;

    const achievementId = trackRecipeShared();
    if (achievementId) {
      const msg = dispatchSuccessCelebration.pick('update', true);
      if (msg) {
        window.dispatchEvent(new CustomEvent('personality:addToast', { detail: { message: msg } }));
      }
    }
  }, [settings]);
}

/**
 * Hook to track menu building and check for achievements
 */
export function useOnMenuBuilt() {
  const { settings } = usePersonality();

  return useCallback(() => {
    if (!settings.enabled) return;

    const achievementId = trackMenuBuilt();
    if (achievementId) {
      const msg = dispatchSuccessCelebration.pick('create', true);
      if (msg) {
        window.dispatchEvent(new CustomEvent('personality:addToast', { detail: { message: msg } }));
      }
    }
  }, [settings]);
}

/**
 * Hook for context-aware personality messages
 * Automatically detects current page context and shows relevant messages
 */
export function useContextualPersonality() {
  const { settings } = usePersonality();

  return useCallback(() => {
    if (!settings.enabled) return;

    const msg = dispatchToast.pick('context');
    if (msg) {
      window.dispatchEvent(new CustomEvent('personality:addToast', { detail: { message: msg } }));
    }
  }, [settings]);
}

/**
 * Hook for success celebrations with personality
 * @param actionType - Type of action (create, update, delete)
 * @param isMilestone - Whether this is a milestone achievement
 */
export function useOnSuccess(
  actionType: 'create' | 'update' | 'delete' = 'create',
  isMilestone = false,
) {
  const { settings } = usePersonality();

  return useCallback(() => {
    if (!settings.enabled) return;

    const msg = dispatchSuccessCelebration.pick(actionType, isMilestone);
    if (msg) {
      window.dispatchEvent(new CustomEvent('personality:addToast', { detail: { message: msg } }));
    }
  }, [settings, actionType, isMilestone]);
}

export function useOnMoodShift() {
  const { settings } = usePersonality();

  return useCallback(() => {
    if (!settings.enabled || !settings.moodShiftMessages) return;

    const msg = dispatchToast.pick('moodShift');
    if (msg) {
      window.dispatchEvent(new CustomEvent('personality:addToast', { detail: { message: msg } }));
    }
  }, [settings]);
}
