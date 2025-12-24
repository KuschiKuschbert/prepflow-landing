/**
 * Food Cost Sync Service
 * Handles one-way synchronization of food costs from PrepFlow to Square Catalog Items
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

export interface CostData {
  total_cost: number;
  food_cost_percent: number;
  gross_profit: number;
  gross_profit_margin: number;
  contributing_margin: number;
  contributing_margin_percent: number;
  last_updated: string;
}

// Re-export sync function
export { syncCostsToSquare } from './costs/syncCosts';
