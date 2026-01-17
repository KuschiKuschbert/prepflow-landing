/**
 * Process a single sync operation from the queue.
 */
import { logger } from '@/lib/logger';
import type { QueuedSyncOperation } from '../types';
import { MAX_RETRIES } from './syncQueueConstants';

/**
 * Process a single sync operation
 */
export async function processSyncOperation(
  operation: QueuedSyncOperation,
  onRetry: (operation: QueuedSyncOperation) => void,
  onMaxRetriesReached: (operation: QueuedSyncOperation, error: Error) => Promise<void>,
): Promise<void> {
  try {
    // Import sync functions dynamically to avoid circular dependencies
    const { syncCatalogToSquare } = await import('../catalog');
    const { syncStaffToSquare } = await import('../staff');
    const { syncCostsToSquare } = await import('../costs');

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
          logger.warn('[Square Sync Queue] Delete operation not yet implemented for dishes');
          return;
        }
        syncResult = await syncCatalogToSquare(operation.user_id, [operation.entity_id]);
        break;

      case 'employee':
        if (operation.operation === 'delete') {
          logger.warn('[Square Sync Queue] Delete operation not yet implemented for employees');
          return;
        }
        syncResult = await syncStaffToSquare(operation.user_id, [operation.entity_id]);
        break;

      case 'recipe':
      case 'ingredient':
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
  } catch (error: unknown) {
    logger.error('[Square Sync Queue] Error processing operation:', {
      id: operation.id,
      error: error instanceof Error ? error.message : String(error),
      retryCount: operation.retry_count,
    });

    // Retry if under max retries
    if (operation.retry_count < MAX_RETRIES) {
      operation.retry_count++;
      onRetry(operation);
    } else {
      await onMaxRetriesReached(
        operation,
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  }
}
