import { logger } from '@/lib/logger';
import type { ABTestVariant, ABTestEvent } from './types';

export function getPersistentVariant(userId: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(`prepflow_variant_${userId}`);
    if (!stored) {
      logger.dev('🔍 No persistent variant found for user:', userId);
      return null;
    }
    const variantData = JSON.parse(stored);
    const assignmentDate = new Date(variantData.assignedAt);
    const currentDate = new Date();
    const daysSinceAssignment =
      (currentDate.getTime() - assignmentDate.getTime()) / (1000 * 60 * 60 * 24);
    logger.dev('🔍 Persistent variant check:', {
      userId,
      variantId: variantData.variantId,
      assignedAt: variantData.assignedAt,
      daysSinceAssignment: Math.round(daysSinceAssignment),
      isExpired: daysSinceAssignment >= 30,
    });
    if (daysSinceAssignment < 30) {
      logger.dev('✅ Returning persistent variant:', variantData.variantId);
      return variantData.variantId;
    }
    logger.dev('🔄 Variant expired, clearing for rotation');
    localStorage.removeItem(`prepflow_variant_${userId}`);
    return null;
  } catch (error) {
    logger.warn('Error reading persistent variant:', { error: error instanceof Error ? error.message : String(error) });
    return null;
  }
}

export function assignNewPersistentVariant(
  testId: string,
  userId: string,
  variants: ABTestVariant[],
): string {
  const random = Math.random() * 100;
  let cumulativeSplit = 0;
  for (const variant of variants) {
    cumulativeSplit += variant.trafficSplit;
    if (random <= cumulativeSplit) {
      const assignedVariant = variant.id;
      storePersistentVariant(userId, assignedVariant);
      return assignedVariant;
    }
  }
  const assignedVariant = 'control';
  storePersistentVariant(userId, assignedVariant);
  return assignedVariant;
}

function storePersistentVariant(userId: string, variantId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const variantData = {
      variantId,
      assignedAt: new Date().toISOString(),
      testId: 'landing_page_variants',
    };
    localStorage.setItem(`prepflow_variant_${userId}`, JSON.stringify(variantData));
    logger.dev('💾 Stored persistent variant:', {
      userId,
      variantId,
      assignedAt: variantData.assignedAt,
      storageKey: `prepflow_variant_${userId}`,
    });
  } catch (error) {
    logger.warn('Error storing persistent variant:', { error: error instanceof Error ? error.message : String(error) });
  }
}

export function assignVariant(
  testId: string,
  userId: string,
  variants: ABTestVariant[] | undefined,
  getSessionId: () => string,
  trackEvent: (event: ABTestEvent) => void,
): string {
  logger.dev('🎯 Assigning variant for:', { testId, userId });
  if (!variants) {
    logger.warn(`AB test ${testId} not found`);
    return 'control';
  }
  const persistentVariant = getPersistentVariant(userId);
  if (persistentVariant) {
    logger.dev('🎯 Returning existing persistent variant:', persistentVariant);
    return persistentVariant;
  }
  const assignedVariant = assignNewPersistentVariant(testId, userId, variants);
  logger.dev('🎯 Assigned new persistent variant:', assignedVariant);
  trackEvent({
    testId,
    variantId: assignedVariant,
    userId,
    sessionId: getSessionId(),
    eventType: 'variant_assigned',
    timestamp: Date.now(),
    metadata: {
      variant_name: variants.find(v => v.id === assignedVariant)?.name || assignedVariant,
      is_control: assignedVariant === 'control',
      assignment_type: 'persistent',
      rotation_period: '1_month',
    },
  });
  return assignedVariant;
}
