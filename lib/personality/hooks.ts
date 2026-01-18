// PrepFlow Personality System - Action Hooks

'use client';

import { useCallback } from 'react';
import { usePersonality } from './store';
import { dispatchToast, dispatchSuccessCelebration } from './ui';
import { trackSave as trackAchievementSave } from './achievement-tracker';
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

// Re-export achievement hooks
export {
  useOnRecipeCreated,
  useOnIngredientAdded,
  useOnDishCreated,
  useOnCOGSCalculated,
  useOnPerformanceAnalyzed,
  useOnTemperatureLogged,
  useOnRecipeShared,
  useOnMenuBuilt,
} from './hooks/helpers/useAchievementHooks';

// Re-export context hooks
export {
  useContextualPersonality,
  useOnSuccess,
  useOnMoodShift,
} from './hooks/helpers/useContextHooks';
