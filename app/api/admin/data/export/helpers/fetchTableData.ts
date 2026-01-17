import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

interface ExportItem {
  [key: string]: unknown;
  _table: string;
}

export async function fetchTableData(tableName: string, query: string): Promise<ExportItem[]> {
  if (!supabaseAdmin) return [];

  try {
    let searchQuery = supabaseAdmin.from(tableName).select('*').limit(1000);

    if (query) {
      if (tableName === 'ingredients') {
        searchQuery = searchQuery.or(`ingredient_name.ilike.%${query}%,supplier.ilike.%${query}%`);
      } else if (tableName === 'recipes') {
        searchQuery = searchQuery.or(`recipe_name.ilike.%${query}%,name.ilike.%${query}%`);
      } else if (tableName === 'dishes') {
        searchQuery = searchQuery.or(`dish_name.ilike.%${query}%,name.ilike.%${query}%`);
      } else if (tableName === 'users') {
        searchQuery = searchQuery.or(`email.ilike.%${query}%`);
      }
    }

    const { data } = await searchQuery;
    if (!data) return [];

    return data.map((item: unknown) => ({
      ...(item as Record<string, unknown>),
      _table: tableName,
    }));
  } catch (error) {
    logger.warn(`[Admin Data Export] Error exporting ${tableName}:`, error);
    return [];
  }
}
