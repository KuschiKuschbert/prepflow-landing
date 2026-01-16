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
  metadata?: Record<string, unknown>;
}

export interface SquareCatalogObject {
  id: string;
  type: string;
  itemData?: {
    name?: string;
    description?: string;
    variations?: Array<{
      itemVariationData?: {
        name?: string;
        pricingType?: string;
        priceMoney?: {
          amount: bigint | number;
          currency: string;
        };
      };
    }>;
    categories?: string[];
  };
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
export { syncCatalogBidirectional } from './catalog/syncBidirectional';
export { syncCatalogFromSquare } from './catalog/syncFromSquare';
export { syncCatalogToSquare } from './catalog/syncToSquare';
