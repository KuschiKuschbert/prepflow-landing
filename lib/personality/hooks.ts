// PrepFlow Personality System - Action Hooks

'use client';

import { useCallback } from 'react';
import { usePersonality } from './store';
import { dispatchToast } from './ui';

export function useOnSave() {
  const { settings } = usePersonality();

  return useCallback(() => {
    if (!settings.enabled) return;

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
