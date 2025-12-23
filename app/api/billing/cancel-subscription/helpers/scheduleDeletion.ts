import { logger } from '@/lib/logger';
import { NextRequest } from 'next/server';

interface ScheduleDeletionParams {
  userEmail: string;
  subscriptionId: string;
  immediate: boolean;
  request: NextRequest;
}

/**
 * Schedule account deletion if immediate cancellation
 *
 * @param {ScheduleDeletionParams} params - Deletion scheduling parameters
 */
export async function scheduleAccountDeletionIfNeeded(
  params: ScheduleDeletionParams,
): Promise<void> {
  const { userEmail, subscriptionId, immediate, request } = params;

  if (!immediate) {
    return; // For scheduled cancellations, deletion will be scheduled when subscription actually ends
  }

  // Check if user is EU customer for enhanced cancellation rights
  let isEU = false;
  try {
    const { getUserEUStatus } = await import('@/lib/geo/eu-detection');
    isEU = await getUserEUStatus(userEmail, request);
  } catch (err) {
    // Don't fail cancellation if EU detection fails
    logger.warn('[Billing API] Failed to detect EU status:', {
      error: err instanceof Error ? err.message : String(err),
      userEmail,
    });
  }

  try {
    const { scheduleAccountDeletion } = await import('@/lib/data-retention/schedule-deletion');
    await scheduleAccountDeletion({
      userEmail,
      metadata: {
        reason: 'subscription_cancelled_immediate',
        subscriptionId: subscriptionId,
        isEU,
      },
    });
    logger.dev('[Billing API] Account deletion scheduled for cancelled subscription:', {
      userEmail,
      isEU,
    });
  } catch (err) {
    // Don't fail the cancellation if deletion scheduling fails
    logger.error('[Billing API] Failed to schedule account deletion:', {
      error: err instanceof Error ? err.message : String(err),
      userEmail,
    });
  }
}

