/**
 * Catalog/Menu Items Sync Service
 * Handles bidirectional synchronization between Square Catalog and PrepFlow Dishes
 *
 * 📚 Complete Reference: See `docs/SQUARE_API_REFERENCE.md` (Sync Operations section) for
 * detailed sync operation documentation and usage examples.
 */

// Export types
export interface SyncResult {
  success: boolean;
  synced: number;
  created: number;
  updated: number;
  errors: number;
  errorMessages?: string[];
  metadata?: Record<string, any>;
}

export interface Dish {
  id: string;
  dish_name: string;
  description?: string;
  selling_price: number;
  category?: string;
  created_at?: string;
  updated_at?: string;
}

// Re-export sync functions
export { syncCatalogFromSquare } from './catalog/syncFromSquare';
export { syncCatalogToSquare } from './catalog/syncToSquare';
export { syncCatalogBidirectional } from './catalog/syncBidirectional';
