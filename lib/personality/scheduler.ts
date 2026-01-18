// PrepFlow Personality System - Event Scheduler

'use client';

import { useEffect } from 'react';
import { adjustMessageProbability, getAdaptiveSettings } from './adaptive-personality';
import { trackTimeOfDayUsage } from './behavior-tracker';
import { generateRealMetricsMessage } from './real-metrics';
import { usePersonality } from './store';
import { dispatchSeasonal, dispatchToast, dispatchVisual } from './ui';
import { getShiftBucket, getTimeBasedAdjustments, isSilenced } from './utils';

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

    // Get adaptive settings
    const adaptiveSettings = getAdaptiveSettings(settings);
    const timeAdjustments = getTimeBasedAdjustments();

    const timers: number[] = [];

    // Idle / periodic triggers
    const idleTick = () => {
      if (!settings.enabled || isSilenced(settings)) return;

      const currentAdaptive = getAdaptiveSettings(settings);
      const currentTimeAdjustments = getTimeBasedAdjustments();

      const triggerMoment = (type: 'mindful' | 'metrics' | 'meta' | 'chaos', baseProb: number) => {
        let probability = baseProb;
        probability = adjustMessageProbability(probability, currentAdaptive);
        probability *= currentTimeAdjustments.toneMultiplier;

        if (chance(probability)) {
          let msg: string | null = null;

          if (type === 'metrics') {
            // Try real metrics first (30% chance), fallback to imaginary
            msg = chance(0.3) ? generateRealMetricsMessage() : dispatchToast.pick('metrics');
            if (!msg) msg = dispatchToast.pick('metrics'); // Final fallback
          } else {
            msg = dispatchToast.pick(type);
          }

          if (msg) {
            window.dispatchEvent(
              new CustomEvent('personality:addToast', { detail: { message: msg } }),
            );
          }
        }
      };

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
      moments.filter(m => m.enabled).forEach(m => triggerMoment(m.type, m.prob));

      // Visual delight (special case for now)
      if (settings.visualDelights) {
        let probability = 0.02;
        probability = adjustMessageProbability(probability, currentAdaptive);
        probability *= currentTimeAdjustments.toneMultiplier;

        if (chance(probability)) {
          dispatchVisual.random();
        }
      }

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
