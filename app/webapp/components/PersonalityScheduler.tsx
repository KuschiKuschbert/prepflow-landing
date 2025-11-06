// PrepFlow Personality System - Scheduler Component (for mounting in layout)

'use client';

import { usePersonalityScheduler } from '@/lib/personality/scheduler';

export function PersonalityScheduler() {
  usePersonalityScheduler();
  return null;
}
