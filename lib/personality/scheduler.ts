// PrepFlow Personality System - Event Scheduler

'use client';

import { useEffect } from 'react';
import { usePersonality } from './store';
import { dispatchToast, dispatchVisual, dispatchSeasonal } from './ui';
import { isSilenced, getTimeBasedAdjustments } from './utils';
import { generateRealMetricsMessage } from './real-metrics';
import { getAdaptiveSettings, adjustMessageProbability } from './adaptive-personality';
import { trackTimeOfDayUsage } from './behavior-tracker';
import { getShiftBucket } from './utils';

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

      // Update adaptive settings periodically
      const currentAdaptive = getAdaptiveSettings(settings);
      const currentTimeAdjustments = getTimeBasedAdjustments();

      // Mindful (rare - 3% chance per minute, adjusted)
      if (settings.mindfulMoments) {
        let probability = 0.03;
        probability = adjustMessageProbability(probability, currentAdaptive);
        probability *= currentTimeAdjustments.toneMultiplier;

        if (chance(probability)) {
          const msg = dispatchToast.pick('mindful');
          if (msg) {
            window.dispatchEvent(
              new CustomEvent('personality:addToast', { detail: { message: msg } }),
            );
          }
        }
      }

      // Metrics (occasional - 6% chance per minute, adjusted)
      if (settings.imaginaryMetrics) {
        let probability = 0.06;
        probability = adjustMessageProbability(probability, currentAdaptive);
        probability *= currentTimeAdjustments.toneMultiplier;

        if (chance(probability)) {
          // Try real metrics first (30% chance), fallback to imaginary
          if (chance(0.3)) {
            const realMsg = generateRealMetricsMessage();
            if (realMsg) {
              window.dispatchEvent(
                new CustomEvent('personality:addToast', { detail: { message: realMsg } }),
              );
            } else {
              // Fallback to imaginary metrics
              const msg = dispatchToast.pick('metrics');
              if (msg) {
                window.dispatchEvent(
                  new CustomEvent('personality:addToast', { detail: { message: msg } }),
                );
              }
            }
          } else {
            // Imaginary metrics
            const msg = dispatchToast.pick('metrics');
            if (msg) {
              window.dispatchEvent(
                new CustomEvent('personality:addToast', { detail: { message: msg } }),
              );
            }
          }
        }
      }

      // Meta (very rare - 2% chance per minute, adjusted)
      if (settings.metaMoments) {
        let probability = 0.02;
        probability = adjustMessageProbability(probability, currentAdaptive);
        probability *= currentTimeAdjustments.toneMultiplier;

        if (chance(probability)) {
          const msg = dispatchToast.pick('meta');
          if (msg) {
            window.dispatchEvent(
              new CustomEvent('personality:addToast', { detail: { message: msg } }),
            );
          }
        }
      }

      // Chaos report (once per shift ~ every 4h - 1% chance per minute, adjusted)
      if (settings.chaosReports) {
        let probability = 0.01;
        probability = adjustMessageProbability(probability, currentAdaptive);
        probability *= currentTimeAdjustments.toneMultiplier;

        if (chance(probability)) {
          const msg = dispatchToast.pick('chaos');
          if (msg) {
            window.dispatchEvent(
              new CustomEvent('personality:addToast', { detail: { message: msg } }),
            );
          }
        }
      }

      // Visual delight (very rare - 2% chance per minute, adjusted)
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
