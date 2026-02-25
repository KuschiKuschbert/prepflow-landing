/**
 * Shared performance service used by /api/performance and /api/dashboard/performance-summary.
 * Consolidates dish fetching and menu filtering logic.
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import type { PerformanceDish } from '@/lib/api/performance/types';
import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';
import { getDishIdsForMenu, getFilterMenuId } from './helpers/filter-utils';

export interface PerformanceDishRow {
  id: string;
  name: string;
  selling_price: number;
  profit_margin: number | null | undefined;
  sales_data?: Array<{
    id: string;
    number_sold: number;
    popularity_percentage: number;
    date: string;
  }> | null;
  [key: string]: unknown;
}

/**
 * Resolve target menu ID from query params (menuId, lockedMenuOnly).
 * Shared by both performance and performance-summary endpoints.
 */
export { getFilterMenuId };

/**
 * Fetch dishes for performance analysis with optional menu filtering.
 * Returns raw dishes compatible with processPerformanceData.
 */
export async function fetchDishesForPerformance(
  supabase: SupabaseClient,
  targetMenuId: string | null,
): Promise<PerformanceDish[]> {
  let query = supabase.from('menu_dishes').select(
    `
      id,
      name,
      selling_price,
      profit_margin,
      sales_data (
        id,
        number_sold,
        popularity_percentage,
        date
      )
    `,
  );

  if (targetMenuId) {
    const dishIds = await getDishIdsForMenu(supabase, targetMenuId);
    if (dishIds.length === 0) {
      logger.dev('[Performance Service] No dishes in menu:', { menuId: targetMenuId });
      return [];
    }
    query = query.in('id', dishIds);
    logger.dev('[Performance Service] Filtering by menu:', {
      menuId: targetMenuId,
      dishCount: dishIds.length,
    });
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    logger.error('[Performance Service] Error fetching dishes:', {
      error: error.message,
      code: error.code,
    });
    throw ApiErrorHandler.fromSupabaseError(error, 500);
  }

  // Normalize to include dish_name for processPerformanceData compatibility (lib expects dish_name)
  const rows = (data as PerformanceDishRow[]) || [];
  return rows.map(row => ({ ...row, dish_name: row.name }) as PerformanceDish) as PerformanceDish[];
}
