// PrepFlow Personality System - Event Scheduler

'use client';

import { useEffect } from 'react';
import { usePersonality } from './store';
import { dispatchToast, dispatchVisual, dispatchSeasonal } from './ui';
import { isSilenced } from './utils';

const chance = (p: number): boolean => Math.random() < p;

export function usePersonalityScheduler() {
  const { settings } = usePersonality();

  useEffect(() => {
    if (!settings.enabled || isSilenced(settings)) return;

    // Set seasonal logo on mount
    dispatchSeasonal.maybeShow();

    const timers: number[] = [];

    // Idle / periodic triggers
    const idleTick = () => {
      if (!settings.enabled || isSilenced(settings)) return;

      // Mindful (rare - 3% chance per minute)
      if (settings.mindfulMoments && chance(0.03)) {
        const msg = dispatchToast.pick('mindful');
        if (msg) {
          window.dispatchEvent(
            new CustomEvent('personality:addToast', { detail: { message: msg } }),
          );
        }
      }

      // Metrics (occasional - 6% chance per minute)
      if (settings.imaginaryMetrics && chance(0.06)) {
        const msg = dispatchToast.pick('metrics');
        if (msg) {
          window.dispatchEvent(
            new CustomEvent('personality:addToast', { detail: { message: msg } }),
          );
        }
      }

      // Meta (very rare - 2% chance per minute)
      if (settings.metaMoments && chance(0.02)) {
        const msg = dispatchToast.pick('meta');
        if (msg) {
          window.dispatchEvent(
            new CustomEvent('personality:addToast', { detail: { message: msg } }),
          );
        }
      }

      // Chaos report (once per shift ~ every 4h - 1% chance per minute)
      if (settings.chaosReports && chance(0.01)) {
        const msg = dispatchToast.pick('chaos');
        if (msg) {
          window.dispatchEvent(
            new CustomEvent('personality:addToast', { detail: { message: msg } }),
          );
        }
      }

      // Visual delight (very rare - 2% chance per minute)
      if (settings.visualDelights && chance(0.02)) {
        dispatchVisual.random();
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
