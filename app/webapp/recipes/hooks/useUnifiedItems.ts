'use client';

import { useCallback, useEffect, useState } from 'react';
import { Dish, Recipe, UnifiedItem } from '../types';
import { logger } from '@/lib/logger';

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
        id: recipe.id,
        type: 'recipe' as const,
        name: recipe.recipe_name,
        description: recipe.description,
        category: recipe.category || 'Uncategorized',
        created_at: recipe.created_at,
        updated_at: recipe.updated_at,
        yield: recipe.yield,
        yield_unit: recipe.yield_unit,
      }));

      // Convert dishes to unified items
      const dishItems: UnifiedItem[] = (dishesResult.dishes || []).map((dish: Dish) => ({
        id: dish.id,
        type: 'dish' as const,
        name: dish.dish_name,
        description: dish.description,
        category: dish.category || 'Uncategorized',
        created_at: dish.created_at,
        updated_at: dish.updated_at,
        selling_price: dish.selling_price,
      }));

      // Combine and sort by category, then by name
      const allItems = [...recipeItems, ...dishItems].sort((a, b) => {
        if (a.category !== b.category) {
          return a.category.localeCompare(b.category);
        }
        return a.name.localeCompare(b.name);
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
  const categories = Array.from(new Set(items.map(item => item.category))).sort();

  return {
    items,
    loading,
    error,
    categories,
    fetchItems,
  };
}
