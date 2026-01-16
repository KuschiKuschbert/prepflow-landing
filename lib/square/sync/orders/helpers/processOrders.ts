/**
 * Process orders and aggregate sales data.
 */
import { logger } from '@/lib/logger';
import { getMappingBySquareId } from '../../../mappings';
import { logSyncOperation } from '../../../sync-log';
import type { SalesData, SyncResult } from '../types';

/**
 * Process orders and aggregate sales data.
 */
export async function processOrders(
  orders: {
    id: string;
    createdAt?: string;
    lineItems?: {
      catalogObjectId?: string;
      quantity?: string;
    }[];
  }[],
  userId: string,
  locationId: string,
  result: SyncResult,
): Promise<Map<string, SalesData>> {
  const salesDataMap = new Map<string, SalesData>();

  // Process each order
  for (const order of orders) {
    try {
      if (!order.lineItems || order.lineItems.length === 0) {
        continue;
      }

      // Extract order date
      const orderDate = order.createdAt
        ? new Date(order.createdAt).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

      // Process each line item
      for (const lineItem of order.lineItems) {
        if (!lineItem.catalogObjectId || !lineItem.quantity) {
          continue;
        }

        const squareItemId = lineItem.catalogObjectId;
        const quantity = parseInt(lineItem.quantity) || 0;

        if (quantity === 0) {
          continue;
        }

        // Find PrepFlow dish mapping
        const mapping = await getMappingBySquareId(squareItemId, 'dish', userId, locationId);

        if (!mapping) {
          logger.warn('[Square Orders Sync] No mapping found for Square item:', {
            squareItemId,
            orderId: order.id,
          });
          // Skip items without mappings
          continue;
        }

        const dishId = mapping.prepflow_id;
        const key = `${dishId}-${orderDate}`;

        // Aggregate sales data
        if (salesDataMap.has(key)) {
          const existing = salesDataMap.get(key)!;
          existing.number_sold += quantity;
        } else {
          salesDataMap.set(key, {
            dish_id: dishId,
            number_sold: quantity,
            popularity_percentage: 0, // Will be calculated later
            date: orderDate,
          });
        }
      }
    } catch (orderError: unknown) {
      logger.error('[Square Orders Sync] Error processing order:', {
        error: orderError instanceof Error ? orderError.message : String(orderError),
        orderId: order.id,
      });
      result.errors++;
      result.errorMessages?.push(`Failed to process order ${order.id}: ${orderError instanceof Error ? orderError.message : String(orderError)}`);

      await logSyncOperation({
        user_id: userId,
        operation_type: 'sync_orders',
        direction: 'square_to_prepflow',
        entity_type: 'order',
        square_id: order.id,
        status: 'error',
        error_message: orderError instanceof Error ? orderError.message : String(orderError),
        error_details: { stack: orderError instanceof Error ? orderError.stack : undefined },
      });
    }
  }

  return salesDataMap;
}
