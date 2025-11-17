import { logger } from '@/lib/logger';
import type { ABTestVariant } from './types';

export function getVariantInfo(
  variants: ABTestVariant[] | undefined,
  variantId: string,
): ABTestVariant | undefined {
  return variants?.find(v => v.id === variantId);
}

export function getVariantAssignmentInfo(userId: string): {
  variantId: string;
  assignedAt: string;
  daysRemaining: number;
  isPersistent: boolean;
} | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(`prepflow_variant_${userId}`);
    if (!stored) return null;
    const variantData = JSON.parse(stored);
    const assignmentDate = new Date(variantData.assignedAt);
    const currentDate = new Date();
    const daysSinceAssignment =
      (currentDate.getTime() - assignmentDate.getTime()) / (1000 * 60 * 60 * 24);
    const daysRemaining = Math.max(0, 30 - daysSinceAssignment);
    return {
      variantId: variantData.variantId,
      assignedAt: variantData.assignedAt,
      daysRemaining: Math.round(daysRemaining),
      isPersistent: daysRemaining > 0,
    };
  } catch (error) {
    logger.warn('Error reading variant assignment info:', error);
    return null;
  }
}
