/**
 * Orders sync types.
 */

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
