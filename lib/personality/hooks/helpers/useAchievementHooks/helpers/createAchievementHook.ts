'use client';

import { useCallback } from 'react';
import { usePersonality } from '../../../store';
import { dispatchSuccessCelebration } from '../../../ui';

interface CreateAchievementHookOptions {
  feature?: string;
  trackFn: () => string | null | undefined;
  successType: 'create' | 'update';
  showSuccessMessage?: boolean;
}

/**
 * Create an achievement tracking hook with common pattern
 */
export function createAchievementHook({
  feature,
  trackFn,
  successType,
  showSuccessMessage = true,
}: CreateAchievementHookOptions) {
  return function useAchievementHook() {
    const { settings } = usePersonality();

    return useCallback(() => {
      if (!settings.enabled) return;

      if (feature) {
        const { trackFeatureUsage } = require('../../../behavior-tracker');
        trackFeatureUsage(feature);
      }

      const achievementId = trackFn();
      if (showSuccessMessage) {
        const msg = dispatchSuccessCelebration.pick(successType, !!achievementId);
        if (msg) {
          window.dispatchEvent(
            new CustomEvent('personality:addToast', { detail: { message: msg } }),
          );
        }
      }
    }, [settings]);
  };
}

