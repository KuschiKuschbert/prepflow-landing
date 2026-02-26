import { adjustMessageProbability, getAdaptiveSettings } from '../adaptive-personality';
import { generateRealMetricsMessage } from '../real-metrics';
import type { PersonalitySettings } from '../schema';
import { dispatchToast, dispatchVisual } from '../ui';
import { getTimeBasedAdjustments } from '../utils';

const chance = (p: number): boolean => Math.random() < p;

type MomentType = 'mindful' | 'metrics' | 'meta' | 'chaos';

export interface SchedulerContext {
  settings: PersonalitySettings;
}

export function triggerMoment(type: MomentType, baseProb: number, context: SchedulerContext) {
  const { settings } = context;
  const currentAdaptive = getAdaptiveSettings(settings);
  const currentTimeAdjustments = getTimeBasedAdjustments();

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
      window.dispatchEvent(new CustomEvent('personality:addToast', { detail: { message: msg } }));
    }
  }
}

export function triggerVisualDelight(context: SchedulerContext) {
  const { settings } = context;
  if (!settings.visualDelights) return;

  const currentAdaptive = getAdaptiveSettings(settings);
  const currentTimeAdjustments = getTimeBasedAdjustments();

  let probability = 0.02;
  probability = adjustMessageProbability(probability, currentAdaptive);
  probability *= currentTimeAdjustments.toneMultiplier;

  if (chance(probability)) {
    dispatchVisual.random();
  }
}
