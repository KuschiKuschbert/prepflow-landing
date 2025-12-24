/**
 * Handler functions for sync queue operations.
 */
import { logger } from '@/lib/logger';
import type { QueuedSyncOperation } from '../types';
import { syncQueue, isProcessing } from './syncQueueState';
import { RETRY_DELAY_MS, MAX_RETRIES } from './syncQueueConstants';

/**
 * Handle retry for failed sync operation
 */
export function handleRetry(operation: QueuedSyncOperation): void {
  setTimeout(() => {
    syncQueue.push(operation);
    if (!isProcessing) {
      // Import dynamically to avoid circular dependency
      import('../auto-sync-queue')
        .then(module => module.processSyncQueue())
        .catch((err: unknown) => {
          logger.error('[Square Sync Queue] Error retrying queue:', {
            error: err instanceof Error ? err.message : String(err),
          });
        });
    }
  }, RETRY_DELAY_MS * operation.retry_count);
}

/**
 * Handle max retries reached for failed sync operation
 */
export async function handleMaxRetriesReached(
  operation: QueuedSyncOperation,
  error: Error,
): Promise<void> {
  logger.error('[Square Sync Queue] Operation failed after max retries:', {
    id: operation.id,
    entityType: operation.entity_type,
    entityId: operation.entity_id,
  });

  const { logSyncOperation } = await import('../../sync-log');
  await logSyncOperation({
    user_id: operation.user_id,
    operation_type: 'auto_sync',
    direction: operation.direction,
    entity_type: operation.entity_type,
    entity_id: operation.entity_id,
    status: 'error',
    error_message: `Failed after ${MAX_RETRIES} retries: ${error.message}`,
    error_details: { retryCount: operation.retry_count },
  });
}
