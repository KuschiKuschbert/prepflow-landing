/**
 * Sync Queue System
 * Manages batching and rate limiting for Square sync operations
 *
 * 📚 Complete Reference: See `docs/SQUARE_API_REFERENCE.md` (Sync Operations, Rate Limiting sections) for
 * detailed sync queue documentation and rate limit management.
 */

import { logger } from '@/lib/logger';
import { processSyncOperation as processSyncOperationHelper } from './helpers/processSyncOperation';
import {
  syncQueue,
  isProcessing,
  lastBatchProcessedAt,
  setIsProcessing,
  setLastBatchProcessedAt,
} from './helpers/syncQueueState';
import { BATCH_SIZE, RATE_LIMIT_DELAY_MS } from './helpers/syncQueueConstants';
import { handleRetry, handleMaxRetriesReached } from './helpers/syncQueueHandlers';
import type { QueuedSyncOperation } from './types';

export type { QueuedSyncOperation } from './types';

/**
 * Add sync operation to queue
 */
export async function queueSyncOperation(
  operation: Omit<QueuedSyncOperation, 'id' | 'created_at' | 'retry_count'>,
): Promise<void> {
  const queuedOperation: QueuedSyncOperation = {
    ...operation,
    id: `sync-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    created_at: new Date().toISOString(),
    retry_count: 0,
  };

  syncQueue.push(queuedOperation);
  logger.dev('[Square Sync Queue] Operation queued:', {
    id: queuedOperation.id,
    entityType: queuedOperation.entity_type,
    entityId: queuedOperation.entity_id,
    operation: queuedOperation.operation,
  });

  // Trigger queue processing if not already processing
  if (!isProcessing) {
    (async () => {
      try {
        await processSyncQueue();
      } catch (err) {
        logger.error('[Square Sync Queue] Error processing queue:', {
          error: err instanceof Error ? err.message : String(err),
        });
      }
    })();
  }
}

/**
 * Process sync queue in batches
 */
export async function processSyncQueue(): Promise<void> {
  if (isProcessing) {
    return;
  }

  setIsProcessing(true);

  try {
    while (syncQueue.length > 0) {
      // Rate limiting: wait if we processed a batch recently
      const timeSinceLastBatch = Date.now() - lastBatchProcessedAt;
      if (timeSinceLastBatch < RATE_LIMIT_DELAY_MS) {
        await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY_MS - timeSinceLastBatch));
      }

      // Get batch of operations
      const batch = syncQueue.splice(0, BATCH_SIZE);
      setLastBatchProcessedAt(Date.now());

      logger.dev('[Square Sync Queue] Processing batch:', {
        batchSize: batch.length,
        remainingInQueue: syncQueue.length,
      });

      // Process batch in parallel
      const batchPromises = batch.map(operation =>
        processSyncOperationHelper(
          operation,
          (op: QueuedSyncOperation) => handleRetry(op),
          (op: QueuedSyncOperation, err: Error) => handleMaxRetriesReached(op, err),
        ),
      );
      await Promise.allSettled(batchPromises);
    }
  } catch (error: any) {
    logger.error('[Square Sync Queue] Error processing queue:', {
      error: error.message,
      stack: error.stack,
    });
  } finally {
    setIsProcessing(false);
  }
}

/**
 * Get queue status
 */
export function getQueueStatus(): {
  queueLength: number;
  isProcessing: boolean;
  nextBatchTime: number;
} {
  return {
    queueLength: syncQueue.length,
    isProcessing,
    nextBatchTime: lastBatchProcessedAt + RATE_LIMIT_DELAY_MS,
  };
}

/**
 * Clear queue (useful for testing or reset)
 */
export function clearQueue(): void {
  const { clearQueueState } = require('./helpers/syncQueueState');
  clearQueueState();
}


