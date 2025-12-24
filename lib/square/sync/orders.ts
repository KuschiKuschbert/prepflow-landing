/**
 * Orders/Sales Data Sync Service
 * Handles one-way synchronization from Square Orders to PrepFlow Sales Data
 *
 * 📚 Complete Reference: See `docs/SQUARE_API_REFERENCE.md` (Sync Operations section) for
 * detailed sync operation documentation and usage examples.
 */

// Export types
export type { SyncResult, SalesData } from './orders/types';

// Re-export functions
export { syncOrdersFromSquare } from './orders/syncOrdersFromSquare';
export { syncRecentOrdersFromSquare } from './orders/syncRecentOrders';
