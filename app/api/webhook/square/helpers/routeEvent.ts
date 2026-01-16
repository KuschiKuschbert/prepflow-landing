import { logger } from '@/lib/logger';
import { syncCatalogFromSquare } from '@/lib/square/sync/catalog';
import { syncOrdersFromSquare } from '@/lib/square/sync/orders';
import { syncStaffFromSquare } from '@/lib/square/sync/staff';

/**
 * Route webhook event to appropriate handler
 *
 * @param {any} event - Webhook event data
 * @param {string} userId - User ID
 */
export async function routeWebhookEvent(event: unknown, userId: string): Promise<void> {
  const eventType = event.type;

  logger.dev('[Square Webhook] Routing event:', {
    eventType,
    userId,
    eventId: event.event_id,
  });

  switch (eventType) {
    case 'catalog.version.updated': {
      // Catalog item changed - sync from Square to PrepFlow
      await syncCatalogFromSquare(userId);
      break;
    }

    case 'order.created':
    case 'order.updated': {
      // Order created or updated - sync sales data from Square to PrepFlow
      // Sync orders for today
      const today = new Date().toISOString().split('T')[0];
      await syncOrdersFromSquare(userId, today, today);
      break;
    }

    case 'team.member.created':
    case 'team.member.updated': {
      // Team member created or updated - sync from Square to PrepFlow
      await syncStaffFromSquare(userId);
      break;
    }

    default:
      logger.dev('[Square Webhook] Unhandled event type:', eventType);
  }
}
