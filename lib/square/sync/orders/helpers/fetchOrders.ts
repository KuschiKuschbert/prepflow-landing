/**
 * Fetch orders from Square.
 */
import { logger } from '@/lib/logger';

/**
 * Fetch orders from Square.
 */
export async function fetchOrdersFromSquare(
  client: any,
  locationId: string,
  startDate: string,
  endDate: string,
  userId: string,
): Promise<any[]> {
  const ordersApi = client.orders;

  // Convert dates to ISO format for Square API
  const startDateISO = new Date(startDate).toISOString();
  const endDateISO = new Date(endDate).toISOString();

  logger.dev('[Square Orders Sync] Fetching orders:', {
    userId,
    locationId,
    startDate: startDateISO,
    endDate: endDateISO,
  });

  // Search orders using SearchOrders endpoint
  const searchResponse = await ordersApi.searchOrders({
    locationIds: [locationId],
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
    return [];
  }

  const orders = searchResponse.result.orders;
  logger.dev('[Square Orders Sync] Found Square orders:', {
    count: orders.length,
    userId,
    locationId,
  });

  return orders;
}
