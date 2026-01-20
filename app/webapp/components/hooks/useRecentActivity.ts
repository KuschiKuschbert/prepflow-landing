import { cacheData, getCachedData } from '@/lib/cache/data-cache';
import { logger } from '@/lib/logger';
import { supabase } from '@/lib/supabase';
import { useCallback, useEffect, useState } from 'react';

export interface RecentActivity {
  id: string;
  type: 'ingredient' | 'recipe' | 'menu_dish';
  name: string;
  action: 'created' | 'updated';
  created_at: string;
}

export function useRecentActivity() {
  // Initialize with cached data for instant display
  const [activities, setActivities] = useState<RecentActivity[]>(
    () => getCachedData<RecentActivity[]>('dashboard_recent_activity') || [],
  );
  const [loading, setLoading] = useState(false); // Start false since we have cached data
  const [error, setError] = useState<string | null>(null);

  const fetchRecentActivity = useCallback(async (): Promise<RecentActivity[]> => {
    const activities: RecentActivity[] = [];

    try {
      // Fetch all data in parallel for better performance
      const [ingredientsResult, recipesResult, menuDishesResult] = await Promise.all([
        supabase
          .from('ingredients')
          .select('id, ingredient_name, created_at, updated_at')
          .order('updated_at', { ascending: false })
          .limit(3),
        supabase
          .from('recipes')
          .select('id, name, created_at, updated_at')
          .order('updated_at', { ascending: false })
          .limit(3),
        supabase
          .from('menu_dishes')
          .select('id, name, created_at, updated_at')
          .order('updated_at', { ascending: false })
          .limit(3),
      ]);

      // Process ingredients
      if (!ingredientsResult.error && ingredientsResult.data) {
        ingredientsResult.data.forEach(ingredient => {
          activities.push({
            id: ingredient.id,
            type: 'ingredient',
            name: ingredient.ingredient_name,
            action: ingredient.created_at === ingredient.updated_at ? 'created' : 'updated',
            created_at: ingredient.updated_at,
          });
        });
      }

      // Process recipes
      if (!recipesResult.error && recipesResult.data) {
        recipesResult.data.forEach(recipe => {
          activities.push({
            id: recipe.id,
            type: 'recipe',
            name: recipe.name,
            action: recipe.created_at === recipe.updated_at ? 'created' : 'updated',
            created_at: recipe.updated_at,
          });
        });
      }

      // Process menu dishes
      if (!menuDishesResult.error && menuDishesResult.data) {
        menuDishesResult.data.forEach(dish => {
          activities.push({
            id: dish.id,
            type: 'menu_dish',
            name: dish.name,
            action: dish.created_at === dish.updated_at ? 'created' : 'updated',
            created_at: dish.updated_at,
          });
        });
      }

      // Sort all activities by date
      const sorted = activities.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
      return sorted;
    } catch (error) {
      logger.error('Error fetching recent activity:', error);
      throw error;
    }
  }, []);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRecentActivity();
      setActivities(data);
      // Cache the activity data
      cacheData('dashboard_recent_activity', data);
    } catch (err) {
      logger.error('[useRecentActivity] Error in catch block:', {
        error: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
      });

      setError(err instanceof Error ? err.message : 'Failed to fetch recent activity');
    } finally {
      setLoading(false);
    }
  }, [fetchRecentActivity]);

  useEffect(() => {
    // If we have cached data, fetch in background without showing loading state
    // Otherwise, show loading while fetching
    const hasCachedData = activities.length > 0;
    if (hasCachedData) {
      // Non-blocking: fetch fresh data in background without loading state
      fetchRecentActivity()
        .then(data => {
          setActivities(data);
          cacheData('dashboard_recent_activity', data);
        })
        .catch(() => {
          // Silently fail - we already have cached data displayed
        });
    } else {
      // No cached data, fetch with loading state
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  return { activities, loading, error, refetch };
}
