import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { upsertSalesData } from './upsertSalesData';

export interface BulkSalesRecord {
  dish_name: string;
  number_sold: number;
  popularity_percentage: number;
  date?: string;
}

/**
 * Resolve dish names to IDs and upsert sales data in bulk.
 * Uses case-insensitive, trimmed dish_name matching.
 */
export async function bulkImportSalesData(
  salesData: BulkSalesRecord[],
): Promise<{ imported: number; errors: string[] }> {
  if (!supabaseAdmin) {
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  if (!Array.isArray(salesData) || salesData.length === 0) {
    return { imported: 0, errors: [] };
  }

  const { data: dishes, error: dishesError } = await supabaseAdmin
    .from('dishes')
    .select('id, dish_name');

  if (dishesError) {
    logger.error('[Performance API] Failed to fetch dishes for bulk import:', {
      error: dishesError.message,
    });
    throw ApiErrorHandler.fromSupabaseError(dishesError, 500);
  }

  const nameToId = new Map<string, string>();
  for (const d of dishes || []) {
    const key = (d.dish_name || '').trim().toLowerCase();
    if (key && !nameToId.has(key)) {
      nameToId.set(key, d.id);
    }
  }

  const today = new Date().toISOString().split('T')[0];
  let imported = 0;
  const errors: string[] = [];

  for (const record of salesData) {
    const dishName = (record.dish_name || '').trim();
    if (!dishName) {
      errors.push(`Skipped: empty dish name`);
      continue;
    }

    const dishId = nameToId.get(dishName.toLowerCase());
    if (!dishId) {
      errors.push(`No dish found for "${dishName}"`);
      continue;
    }

    try {
      await upsertSalesData({
        dish_id: dishId,
        number_sold: Number(record.number_sold) || 0,
        popularity_percentage: Number(record.popularity_percentage) || 0,
        date: record.date || today,
      });
      imported++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`Failed to import "${dishName}": ${msg}`);
    }
  }

  return { imported, errors };
}
