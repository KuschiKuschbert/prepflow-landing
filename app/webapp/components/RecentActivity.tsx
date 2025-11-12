'use client';

import { ApiErrorDisplay } from '@/components/ui/ApiErrorDisplay';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { cacheData, getCachedData } from '@/lib/cache/data-cache';
import { supabase } from '@/lib/supabase';
import { useTranslation } from '@/lib/useTranslation';
import { useCallback, useEffect, useState } from 'react';
import { Clock, RefreshCw, Package, BookOpen, UtensilsCrossed } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

interface RecentActivity {
  id: string;
  type: 'ingredient' | 'recipe' | 'menu_dish';
  name: string;
  action: 'created' | 'updated';
  created_at: string;
}

export default function RecentActivity() {
  const { t } = useTranslation();
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
      console.error('Error fetching recent activity:', error);
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

  // Show loading state only if we have no data and are loading
  if (loading && !activities) {
    return (
      <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg">
        <LoadingSkeleton variant="list" count={5} height="64px" />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <ApiErrorDisplay
        error={ApiErrorHandler.createError(error)}
        context="Recent Activity"
        onRetry={refetch}
        className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg"
      />
    );
  }

  // Show empty state
  if (!activities || activities.length === 0) {
    return (
      <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#29E7CD] to-[#D925C7]">
            <Icon icon={Clock} size="lg" className="text-white" aria-hidden={true} />
          </div>
        </div>

        <h2 className="mb-2 text-center text-xl font-semibold text-white">No Recent Activity</h2>

        <p className="text-center text-gray-400">
          Start by adding some ingredients or recipes to see recent activity here.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4 shadow-lg md:rounded-3xl md:p-6">
      <div className="mb-4 flex items-center justify-between md:mb-6">
        <h2 className="text-lg font-semibold text-white md:text-xl">Recent Activity</h2>

        <button
          onClick={refetch}
          className="flex min-h-[44px] min-w-[44px] items-center justify-center text-[#29E7CD] transition-colors duration-200 hover:text-[#D925C7]"
          title="Refresh activity"
          aria-label="Refresh activity"
        >
          <Icon icon={RefreshCw} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
        </button>
      </div>

      <div className="space-y-3 md:space-y-4">
        {activities.slice(0, 5).map(activity => (
          <div
            key={activity.id}
            className="flex items-center space-x-3 rounded-xl bg-[#2a2a2a]/30 p-3 transition-colors duration-200 hover:bg-[#2a2a2a]/50 md:space-x-4 md:rounded-2xl md:p-3"
          >
            <div className="flex-shrink-0">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full md:h-10 md:w-10 ${
                  activity.type === 'ingredient'
                    ? 'bg-blue-500/20'
                    : activity.type === 'recipe'
                      ? 'bg-green-500/20'
                      : 'bg-purple-500/20'
                }`}
              >
                {activity.type === 'ingredient' && (
                  <Icon icon={Package} size="sm" className="text-blue-400" aria-hidden={true} />
                )}
                {activity.type === 'recipe' && (
                  <Icon icon={BookOpen} size="sm" className="text-green-400" aria-hidden={true} />
                )}
                {activity.type === 'menu_dish' && (
                  <Icon icon={UtensilsCrossed} size="sm" className="text-purple-400" aria-hidden={true} />
                )}
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white md:text-base">
                {activity.name}
              </p>
              <p className="text-xs text-gray-400 md:text-sm">
                {activity.action === 'created' ? 'Created' : 'Updated'} •{' '}
                {new Date(activity.created_at).toLocaleDateString()}
              </p>
            </div>

            <div className="flex-shrink-0">
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  activity.type === 'ingredient'
                    ? 'bg-blue-500/20 text-blue-400'
                    : activity.type === 'recipe'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-purple-500/20 text-purple-400'
                }`}
              >
                {activity.type.replace('_', ' ')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
