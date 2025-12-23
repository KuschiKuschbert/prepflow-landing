'use client';

import { useCallback } from 'react';
import { usePersonality } from '../../store';
import { dispatchToast, dispatchSuccessCelebration } from '../../ui';

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
