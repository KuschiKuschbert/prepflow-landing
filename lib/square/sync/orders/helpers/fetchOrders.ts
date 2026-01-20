/**
 * Fetch orders from Square.
 */
import { logger } from '@/lib/logger';

/**
 * Fetch orders from Square.
 */
import { Order, SquareClient } from 'square';

/**
 * Fetch orders from Square.
 */
const SQUARE_API_LIMIT = 1000;

/**
 * Fetch orders from Square.
 */
export async function fetchOrdersFromSquare(
  client: SquareClient,
  locationId: string,
  startDate: string,
  endDate: string,
  userId: string,
): Promise<Order[]> {
  // Square SDK v30+ uses explicit API accessors, but let's try strict property access
  // If strict types fail, we might need a type assertion for the SDK method
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ordersApi = client.orders as any; // justified

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
    limit: SQUARE_API_LIMIT,
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
