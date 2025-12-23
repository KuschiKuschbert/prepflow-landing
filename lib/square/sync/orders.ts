/**
 * Orders/Sales Data Sync Service
 * Handles one-way synchronization from Square Orders to PrepFlow Sales Data
 *
 * 📚 Complete Reference: See `docs/SQUARE_API_REFERENCE.md` (Sync Operations section) for
 * detailed sync operation documentation and usage examples.
 */

import { SquareClient } from 'square';
import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { supabaseAdmin } from '@/lib/supabase';
import { getSquareClient } from '../client';
import { getSquareConfig } from '../config';
import { getMappingBySquareId } from '../mappings';
import { logSyncOperation, SyncOperation } from '../sync-log';

export interface SyncResult {
  success: boolean;
  synced: number;
  created: number;
  updated: number;
  errors: number;
  errorMessages?: string[];
  metadata?: Record<string, any>;
}

export interface SalesData {
  dish_id: string;
  number_sold: number;
  popularity_percentage: number;
  date: string;
}

/**
 * Sync orders from Square to PrepFlow
 * Creates or updates sales_data records based on Square orders
 */
export async function syncOrdersFromSquare(
  userId: string,
  startDate: string,
  endDate: string,
  locationId?: string,
): Promise<SyncResult> {
  const result: SyncResult = {
    success: false,
    synced: 0,
    created: 0,
    updated: 0,
    errors: 0,
    errorMessages: [],
  };

  try {
    const client = await getSquareClient(userId);
    if (!client) {
      logger.error('[Square Orders Sync] Square client not available for user:', { userId });
      result.errorMessages?.push('Square client not available');
      result.errors++;
      return result;
    }

    const config = await getSquareConfig(userId);
    if (!config) {
      logger.error('[Square Orders Sync] Square configuration not found for user:', { userId });
      result.errorMessages?.push('Square configuration not found');
      result.errors++;
      return result;
    }

    const targetLocationId = locationId || config.default_location_id;
    if (!targetLocationId) {
      logger.error('[Square Orders Sync] Location ID is required for orders sync:', { userId });
      result.errorMessages?.push('Location ID is required for orders sync');
      result.errors++;
      return result;
    }

    // Fetch Square orders for date range
    const ordersApi = client.ordersApi;

    // Convert dates to ISO format for Square API
    const startDateISO = new Date(startDate).toISOString();
    const endDateISO = new Date(endDate).toISOString();

    logger.dev('[Square Orders Sync] Fetching orders:', {
      userId,
      locationId: targetLocationId,
      startDate: startDateISO,
      endDate: endDateISO,
    });

    // Search orders using SearchOrders endpoint
    const searchResponse = await ordersApi.searchOrders({
      locationIds: [targetLocationId],
      query: {
        filter: {
          dateTimeFilter: {
            createdAtDate: {
              startAt: startDateISO,
              endAt: endDateISO,
            },
          },
          stateFilter: {
            states: ['COMPLETED'], // Only sync completed orders
          },
        },
      },
      limit: 1000, // Square API limit
    });

    if (!searchResponse.result?.orders) {
      logger.warn('[Square Orders Sync] No orders found in Square');
      result.success = true;
      return result;
    }

    const orders = searchResponse.result.orders;
    logger.dev('[Square Orders Sync] Found Square orders:', {
      count: orders.length,
      userId,
      locationId: targetLocationId,
    });

    // Aggregate sales data by dish and date
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
          const mapping = await getMappingBySquareId(squareItemId, 'dish', userId, targetLocationId);

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
      } catch (orderError: any) {
        logger.error('[Square Orders Sync] Error processing order:', {
          error: orderError.message,
          orderId: order.id,
        });
        result.errors++;
        result.errorMessages?.push(`Failed to process order ${order.id}: ${orderError.message}`);

        await logSyncOperation({
          user_id: userId,
          operation_type: 'sync_orders',
          direction: 'square_to_prepflow',
          entity_type: 'order',
          square_id: order.id,
          status: 'error',
          error_message: orderError.message,
          error_details: { stack: orderError.stack },
        });
      }
    }

    // Calculate popularity percentages
    const salesDataArray = Array.from(salesDataMap.values());
    calculatePopularityPercentages(salesDataArray);

    // Upsert sales data to database
    for (const salesData of salesDataArray) {
      try {
        const { data, error } = await supabaseAdmin
          .from('sales_data')
          .upsert(
            {
              dish_id: salesData.dish_id,
              number_sold: salesData.number_sold,
              popularity_percentage: salesData.popularity_percentage,
              date: salesData.date,
              updated_at: new Date().toISOString(),
            },
            {
              onConflict: 'dish_id,date',
            },
          )
          .select();

        if (error) {
          logger.error('[sync/orders] Database error:', {
            error: error.message,
          });
          throw ApiErrorHandler.fromSupabaseError(error, 500);
        }

        if (error) {
          logger.error('[Square Orders Sync] Error upserting sales data:', {
            error: error.message,
            dishId: salesData.dish_id,
            date: salesData.date,
          });
          result.errors++;
          result.errorMessages?.push(
            `Failed to upsert sales data for dish ${salesData.dish_id}: ${error.message}`,
          );
          continue;
        }

        // Check if record was created or updated
        if (data && data.length > 0) {
          // Check if created_at equals updated_at (new record)
          const isNew = data[0].created_at === data[0].updated_at;
          if (isNew) {
            result.created++;
          } else {
            result.updated++;
          }
          result.synced++;
        }
      } catch (upsertError: any) {
        logger.error('[Square Orders Sync] Error upserting sales data:', {
          error: upsertError.message,
          dishId: salesData.dish_id,
        });
        result.errors++;
        result.errorMessages?.push(
          `Failed to upsert sales data for dish ${salesData.dish_id}: ${upsertError.message}`,
        );
      }
    }

    // Update last sync timestamp
    const { error: updateTimestampError } = await supabaseAdmin
      .from('square_configurations')
      .update({
        last_sales_sync_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (updateTimestampError) {
      logger.warn('[Square Orders Sync] Failed to update last sync timestamp:', {
        error: updateTimestampError.message,
        userId,
      });
    }

    // Log successful sync operation
    await logSyncOperation({
      user_id: userId,
      operation_type: 'sync_orders',
      direction: 'square_to_prepflow',
      status: 'success',
      sync_metadata: {
        ordersProcessed: orders.length,
        salesRecordsCreated: result.created,
        salesRecordsUpdated: result.updated,
        dateRange: { startDate, endDate },
      },
    });

    result.success = result.errors === 0;
    result.metadata = {
      ordersProcessed: orders.length,
      salesRecordsCreated: result.created,
      salesRecordsUpdated: result.updated,
      dateRange: { startDate, endDate },
    };

    return result;
  } catch (error: any) {
    logger.error('[Square Orders Sync] Fatal error:', {
      error: error.message,
      userId,
      stack: error.stack,
    });

    result.errorMessages?.push(`Fatal error: ${error.message}`);

    await logSyncOperation({
      user_id: userId,
      operation_type: 'sync_orders',
      direction: 'square_to_prepflow',
      status: 'error',
      error_message: error.message,
      error_details: { stack: error.stack },
    });

    return result;
  }
}

/**
 * Calculate popularity percentages for sales data
 * Popularity is calculated as the percentage of total sales for each dish on each date
 */
function calculatePopularityPercentages(salesData: SalesData[]): void {
  // Group sales data by date
  const salesByDate = new Map<string, SalesData[]>();

  for (const data of salesData) {
    if (!salesByDate.has(data.date)) {
      salesByDate.set(data.date, []);
    }
    salesByDate.get(data.date)!.push(data);
  }

  // Calculate percentages for each date
  for (const [date, dateSalesData] of salesByDate.entries()) {
    const totalSold = dateSalesData.reduce((sum, data) => sum + data.number_sold, 0);

    if (totalSold === 0) {
      // If no sales, set all percentages to 0
      for (const data of dateSalesData) {
        data.popularity_percentage = 0;
      }
      continue;
    }

    // Calculate percentage for each dish
    for (const data of dateSalesData) {
      data.popularity_percentage = parseFloat(((data.number_sold / totalSold) * 100).toFixed(2));
    }
  }
}

/**
 * Sync recent orders (last 30 days) from Square
 * Convenience function for regular sync operations
 */
export async function syncRecentOrdersFromSquare(userId: string, locationId?: string): Promise<SyncResult> {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30); // Last 30 days

  return syncOrdersFromSquare(
    userId,
    startDate.toISOString().split('T')[0],
    endDate.toISOString().split('T')[0],
    locationId,
  );
}
