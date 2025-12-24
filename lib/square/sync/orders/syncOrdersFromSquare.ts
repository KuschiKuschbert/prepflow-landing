/**
 * Sync orders from Square to PrepFlow.
 */
import { logger } from '@/lib/logger';
import { logSyncOperation } from '../../sync-log';
import { validateAndSetup } from './helpers/validateAndSetup';
import { fetchOrdersFromSquare } from './helpers/fetchOrders';
import { processOrders } from './helpers/processOrders';
import { calculatePopularityPercentages } from './helpers/calculatePopularityPercentages';
import { upsertSalesData } from './helpers/upsertSalesData';
import { updateSyncTimestampAndLog } from './helpers/updateSyncTimestamp';
import type { SyncResult, SalesData } from './types';

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
    // Validate and setup
    const setup = await validateAndSetup(userId, locationId, result);
    if (!setup) {
      return result;
    }

    // Fetch orders from Square
    const orders = await fetchOrdersFromSquare(
      setup.client,
      setup.locationId,
      startDate,
      endDate,
      userId,
    );
    if (orders.length === 0) {
      result.success = true;
      return result;
    }

    // Process orders and aggregate sales data
    const salesDataMap = await processOrders(orders, userId, setup.locationId, result);

    // Calculate popularity percentages
    const salesDataArray = Array.from(salesDataMap.values());
    calculatePopularityPercentages(salesDataArray);

    // Upsert sales data to database
    await upsertSalesData(salesDataArray, result);

    // Update sync timestamp and log operation
    await updateSyncTimestampAndLog(userId, orders, result, startDate, endDate);

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
