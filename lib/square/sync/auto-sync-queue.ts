/**
 * Sync Queue System
 * Manages batching and rate limiting for Square sync operations
 *
 * 📚 Complete Reference: See `docs/SQUARE_API_REFERENCE.md` (Sync Operations, Rate Limiting sections) for
 * detailed sync queue documentation and rate limit management.
 */

import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

export interface QueuedSyncOperation {
  id: string;
  user_id: string;
  entity_type: 'dish' | 'employee' | 'recipe' | 'ingredient';
  entity_id: string;
  operation: 'create' | 'update' | 'delete';
  direction: 'prepflow_to_square' | 'square_to_prepflow' | 'bidirectional';
  priority: 'high' | 'normal' | 'low';
  retry_count: number;
  created_at: string;
  metadata?: Record<string, any>;
}

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000; // 5 seconds
const BATCH_SIZE = 10;
const RATE_LIMIT_DELAY_MS = 1000; // 1 second between batches

// In-memory queue (could be moved to database for persistence)
const syncQueue: QueuedSyncOperation[] = [];
let isProcessing = false;
let lastBatchProcessedAt = 0;

/**
 * Add sync operation to queue
 */
export async function queueSyncOperation(operation: Omit<QueuedSyncOperation, 'id' | 'created_at' | 'retry_count'>): Promise<void> {
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

  isProcessing = true;

  try {
    while (syncQueue.length > 0) {
      // Rate limiting: wait if we processed a batch recently
      const timeSinceLastBatch = Date.now() - lastBatchProcessedAt;
      if (timeSinceLastBatch < RATE_LIMIT_DELAY_MS) {
        await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY_MS - timeSinceLastBatch));
      }

      // Get batch of operations
      const batch = syncQueue.splice(0, BATCH_SIZE);
      lastBatchProcessedAt = Date.now();

      logger.dev('[Square Sync Queue] Processing batch:', {
        batchSize: batch.length,
        remainingInQueue: syncQueue.length,
      });

      // Process batch in parallel
      const batchPromises = batch.map(operation => processSyncOperation(operation));
      await Promise.allSettled(batchPromises);
    }
  } catch (error: any) {
    logger.error('[Square Sync Queue] Error processing queue:', {
      error: error.message,
      stack: error.stack,
    });
  } finally {
    isProcessing = false;
  }
}

/**
 * Process a single sync operation
 */
async function processSyncOperation(operation: QueuedSyncOperation): Promise<void> {
  try {
    // Import sync functions dynamically to avoid circular dependencies
    const { syncCatalogToSquare } = await import('./catalog');
    const { syncStaffToSquare } = await import('./staff');
    const { syncCostsToSquare } = await import('./costs');

    logger.dev('[Square Sync Queue] Processing operation:', {
      id: operation.id,
      entityType: operation.entity_type,
      entityId: operation.entity_id,
      operation: operation.operation,
    });

    let syncResult;

    switch (operation.entity_type) {
      case 'dish':
        if (operation.operation === 'delete') {
          // Handle delete separately (not implemented in sync services yet)
          logger.warn('[Square Sync Queue] Delete operation not yet implemented for dishes');
          return;
        }
        syncResult = await syncCatalogToSquare(operation.user_id, [operation.entity_id]);
        break;

      case 'employee':
        if (operation.operation === 'delete') {
          // Handle delete separately (not implemented in sync services yet)
          logger.warn('[Square Sync Queue] Delete operation not yet implemented for employees');
          return;
        }
        syncResult = await syncStaffToSquare(operation.user_id, [operation.entity_id]);
        break;

      case 'recipe':
      case 'ingredient':
        // Cost changes - sync costs for all affected dishes
        syncResult = await syncCostsToSquare(operation.user_id);
        break;

      default:
        logger.warn('[Square Sync Queue] Unknown entity type:', operation.entity_type);
        return;
    }

    if (!syncResult.success && syncResult.errors > 0) {
      throw new Error(`Sync failed: ${syncResult.errorMessages?.join('; ')}`);
    }

    logger.dev('[Square Sync Queue] Operation completed successfully:', {
      id: operation.id,
      entityType: operation.entity_type,
      entityId: operation.entity_id,
    });
  } catch (error: any) {
    logger.error('[Square Sync Queue] Error processing operation:', {
      id: operation.id,
      error: error.message,
      retryCount: operation.retry_count,
    });

    // Retry if under max retries
    if (operation.retry_count < MAX_RETRIES) {
      operation.retry_count++;
      // Add back to queue with delay
      setTimeout(() => {
        syncQueue.push(operation);
        if (!isProcessing) {
          (async () => {
            try {
              await processSyncQueue();
            } catch (err) {
              logger.error('[Square Sync Queue] Error retrying queue:', {
                error: err instanceof Error ? err.message : String(err),
              });
            }
          })();
        }
      }, RETRY_DELAY_MS * operation.retry_count); // Exponential backoff
    } else {
      logger.error('[Square Sync Queue] Operation failed after max retries:', {
        id: operation.id,
        entityType: operation.entity_type,
        entityId: operation.entity_id,
      });

      // Log failed operation
      const { logSyncOperation } = await import('../sync-log');
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
  syncQueue.length = 0;
  isProcessing = false;
  lastBatchProcessedAt = 0;
}
