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
  type: 'ITEM';
  itemData?: {
    name?: string | null;
    description?: string | null;
    variations?: Array<{
      type: 'ITEM_VARIATION';
      id: string;
      itemVariationData?: {
        name?: string;
        pricingType?: 'FIXED_PRICING' | 'VARIABLE_PRICING';
        priceMoney?: {
          amount: bigint;
          currency: 'AUD';
        };
      };
    }>;
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
