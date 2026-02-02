'use client';

import { logger } from '@/lib/logger';
import { Dish, Recipe, UnifiedItem } from '@/lib/types/recipes';
import { useCallback, useEffect, useState } from 'react';

interface UseUnifiedItemsReturn {
  items: UnifiedItem[];
  loading: boolean;
  error: string | null;
  categories: string[];
  fetchItems: () => Promise<void>;
}

export function useUnifiedItems(): UseUnifiedItemsReturn {
  const [items, setItems] = useState<UnifiedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch recipes and dishes in parallel
      const [recipesResponse, dishesResponse] = await Promise.all([
        fetch('/api/recipes?pageSize=1000', { cache: 'no-store' }),
        fetch('/api/dishes?pageSize=1000', { cache: 'no-store' }),
      ]);

      const recipesResult = await recipesResponse.json();
      const dishesResult = await dishesResponse.json();

      if (!recipesResponse.ok || !dishesResponse.ok) {
        setError(recipesResult.error || dishesResult.error || 'Failed to fetch items');
        setLoading(false);
        return;
      }

      // Convert recipes to unified items
      const recipeItems: UnifiedItem[] = (recipesResult.recipes || []).map((recipe: Recipe) => ({
        ...recipe,
        itemType: 'recipe' as const,
      }));

      // Convert dishes to unified items
      const dishItems: UnifiedItem[] = (dishesResult.dishes || []).map((dish: Dish) => ({
        ...dish,
        itemType: 'dish' as const,
      }));

      // Combine and sort by category, then by name
      const allItems = [...recipeItems, ...dishItems].sort((a, b) => {
        const catA = a.category || 'Uncategorized';
        const catB = b.category || 'Uncategorized';
        if (catA !== catB) {
          return catA.localeCompare(catB);
        }
        const nameA = a.itemType === 'recipe' ? a.recipe_name : a.dish_name;
        const nameB = b.itemType === 'recipe' ? b.recipe_name : b.dish_name;
        return nameA.localeCompare(nameB);
      });

      setItems(allItems);
      setLoading(false);
    } catch (err) {
      logger.error('[useUnifiedItems.ts] Error in catch block:', {
        error: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
      });

      setError('Failed to fetch items');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Extract unique categories
  const categories = Array.from(
    new Set(items.map(item => item.category || 'Uncategorized')),
  ).sort();

  return {
    items,
    loading,
    error,
    categories,
    fetchItems,
  };
}
