import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

interface SearchResult {
  table: string;
  id: string | number;
  data: Record<string, unknown>;
  created_at: string;
}

export async function performTableSearch(
  tableName: string,
  query: string,
): Promise<SearchResult[]> {
  if (!supabaseAdmin) return [];

  try {
    // Build search query based on table structure
    let searchQuery = supabaseAdmin.from(tableName).select('*').limit(100);

    // Apply search filter based on table
    if (tableName === 'ingredients') {
      searchQuery = searchQuery.or(`ingredient_name.ilike.%${query}%,supplier.ilike.%${query}%`);
    } else if (tableName === 'recipes') {
      searchQuery = searchQuery.or(`recipe_name.ilike.%${query}%,name.ilike.%${query}%`);
    } else if (tableName === 'dishes') {
      searchQuery = searchQuery.or(`dish_name.ilike.%${query}%,name.ilike.%${query}%`);
    } else if (tableName === 'users') {
      searchQuery = searchQuery.or(
        `email.ilike.%${query}%,first_name.ilike.%${query}%,last_name.ilike.%${query}%`,
      );
    } else {
      // Generic search for other tables
      searchQuery = searchQuery.or(`name.ilike.%${query}%`);
    }

    const { data, error } = await searchQuery;

    if (error) {
      logger.warn(`[Admin Data Search] Error searching ${tableName}:`, error);
      return [];
    }

    if (!data) return [];

    return data.map((itemUnknown: unknown) => {
      const item = itemUnknown as Record<string, unknown>;
      return {
        table: tableName,
        id: (item.id as string | number) || 'unknown',
        data: item,
        created_at: (item.created_at as string) || new Date().toISOString(),
      };
    });
  } catch (error) {
    logger.warn(`[Admin Data Search] Error searching ${tableName}:`, error);
    return [];
  }
}
