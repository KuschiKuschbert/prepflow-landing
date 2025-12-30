/**
 * Common helpers for cost sync operations.
 */
import { logger } from '@/lib/logger';
import { logSyncOperation } from '../../../sync-log';

/**
 * Log sync operation for costs
 */
export async function logCostSyncOperation(params: {
  userId: string;
  entityId: string;
  squareId?: string;
  status: 'success' | 'error';
  costData?: { total_cost: number; food_cost_percent: number };
  errorMessage?: string;
  errorDetails?: Record<string, any>;
}): Promise<void> {
  await logSyncOperation({
    user_id: params.userId,
    operation_type: 'sync_costs',
    direction: 'prepflow_to_square',
    entity_type: 'dish',
    entity_id: params.entityId,
    square_id: params.squareId,
    status: params.status,
    error_message: params.errorMessage,
    error_details: params.errorDetails,
    sync_metadata: params.costData
      ? {
          total_cost: params.costData.total_cost,
          food_cost_percent: params.costData.food_cost_percent,
        }
      : undefined,
  });
}


