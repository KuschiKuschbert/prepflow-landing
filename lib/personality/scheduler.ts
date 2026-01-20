// PrepFlow Personality System - Event Scheduler

'use client';

import { useEffect } from 'react';
import { trackTimeOfDayUsage } from './behavior-tracker';
import { triggerMoment, triggerVisualDelight } from './helpers/scheduler-events';
import { usePersonality } from './store';
import { dispatchSeasonal } from './ui';
import { getShiftBucket, isSilenced } from './utils';

const chance = (p: number): boolean => Math.random() < p;

export function usePersonalityScheduler() {
  const { settings } = usePersonality();

  useEffect(() => {
    if (!settings.enabled || isSilenced(settings)) return;

    // Set seasonal logo on mount
    dispatchSeasonal.maybeShow();

    // Track time of day usage
    const bucket = getShiftBucket();
    trackTimeOfDayUsage(bucket);

    const timers: number[] = [];

    // Idle / periodic triggers
    const idleTick = () => {
      if (!settings.enabled || isSilenced(settings)) return;

      const context = { settings };

      // Define moments and their config
      const moments: Array<{
        type: 'mindful' | 'metrics' | 'meta' | 'chaos';
        prob: number;
        enabled: boolean;
      }> = [
        { type: 'mindful', prob: 0.03, enabled: !!settings.mindfulMoments },
        { type: 'metrics', prob: 0.06, enabled: !!settings.imaginaryMetrics },
        { type: 'meta', prob: 0.02, enabled: !!settings.metaMoments },
        { type: 'chaos', prob: 0.01, enabled: !!settings.chaosReports },
      ];

      // Run triggers
      moments.filter(m => m.enabled).forEach(m => triggerMoment(m.type, m.prob, context));

      // Visual delight
      triggerVisualDelight(context);

      // Schedule next tick (60-120 seconds)
      timers.push(window.setTimeout(idleTick, 60_000 + Math.random() * 60_000));
    };

    // Start first tick after 30 seconds
    timers.push(window.setTimeout(idleTick, 30_000));

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [settings]);
}
