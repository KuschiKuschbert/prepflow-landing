// PrepFlow Personality System - Scheduler Component (for mounting in layout)

'use client';

import { usePersonalityScheduler } from '@/lib/personality/scheduler';
import { useMiseEnPlaceEasterEgg } from '@/lib/personality/mise-en-place';
import { useFooterEasterEgg } from '@/lib/personality/footer-easter-egg';

export function PersonalityScheduler() {
  usePersonalityScheduler();
  useMiseEnPlaceEasterEgg();
  useFooterEasterEgg();
  return null;
}
