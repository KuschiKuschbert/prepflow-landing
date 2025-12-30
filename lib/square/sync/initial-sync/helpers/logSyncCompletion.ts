/**
 * Log initial sync completion.
 */
import { logSyncOperation } from '../../../sync-log';
import type { InitialSyncResult } from '../types';

/**
 * Log initial sync completion.
 */
export async function logInitialSyncCompletion(
  result: InitialSyncResult,
  userId: string,
): Promise<void> {
  await logSyncOperation({
    user_id: userId,
    operation_type: 'initial_sync',
    direction: 'bidirectional',
    status: result.success ? 'success' : 'error',
    error_message: result.errors > 0 ? result.errorMessages?.join('; ') : undefined,
    sync_metadata: {
      staffSynced: result.staffSynced,
      dishesSynced: result.dishesSynced,
      ordersSynced: result.ordersSynced,
      costsSynced: result.costsSynced,
      totalErrors: result.errors,
      startedAt: result.startedAt,
      completedAt: result.completedAt,
    },
  });
}




