'use client';

import { ApiErrorDisplay } from '@/components/ui/ApiErrorDisplay';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { cacheData, getCachedData } from '@/lib/cache/data-cache';
import { supabase } from '@/lib/supabase';
import { useTranslation } from '@/lib/useTranslation';
import { useCallback, useEffect, useState } from 'react';
import { Clock, RefreshCw, Package, BookOpen, UtensilsCrossed } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

import { logger } from '@/lib/logger';
interface RecentActivity {
  id: string;
  type: 'ingredient' | 'recipe' | 'menu_dish';
  name: string;
  action: 'created' | 'updated';
  created_at: string;
}

function RecentActivityContent() {
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
      logger.error('[RecentActivity.tsx] Error in catch block:', {
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

  // Show loading state only if we have no data and are loading
  if (loading && !activities) {
    return (
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lg">
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
        className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lg"
      />
    );
  }

  // Show empty state
  if (!activities || activities.length === 0) {
    return (
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]">
            <Icon
              icon={Clock}
              size="lg"
              className="text-[var(--button-active-text)]"
              aria-hidden={true}
            />
          </div>
        </div>

        <h2 className="text-fluid-xl mb-2 text-center font-semibold text-[var(--foreground)]">
          No Recent Activity
        </h2>

        <p className="text-fluid-sm text-center text-[var(--foreground)]/60">
          Start by adding some ingredients or recipes to see recent activity here.
        </p>
      </div>
    );
  }

  return (
    <div className="tablet:rounded-3xl tablet:p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-lg">
      <div className="tablet:mb-6 mb-4 flex items-center justify-between">
        <h2 className="text-fluid-lg tablet:text-fluid-xl font-semibold text-[var(--foreground)]">
          Recent Activity
        </h2>

        <button
          onClick={refetch}
          className="flex min-h-[44px] min-w-[44px] items-center justify-center text-[var(--primary)] transition-colors duration-200 hover:text-[var(--accent)]"
          title="Refresh activity"
          aria-label="Refresh activity"
        >
          <Icon icon={RefreshCw} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
        </button>
      </div>

      <div className="tablet:space-y-4 space-y-3">
        {activities.slice(0, 5).map(activity => (
          <div
            key={activity.id}
            className="tablet:space-x-4 tablet:rounded-2xl tablet:p-3 flex items-center space-x-3 rounded-xl bg-[var(--surface)]/30 p-4 transition-colors duration-200 hover:bg-[var(--surface)]/50"
          >
            <div className="flex-shrink-0">
              <div
                className={`tablet:h-10 tablet:w-10 flex h-8 w-8 items-center justify-center rounded-full ${
                  activity.type === 'ingredient'
                    ? 'bg-[var(--color-info)]/20'
                    : activity.type === 'recipe'
                      ? 'bg-[var(--color-success)]/20'
                      : 'bg-purple-500/20'
                }`}
              >
                {activity.type === 'ingredient' && (
                  <Icon
                    icon={Package}
                    size="sm"
                    className="text-[var(--color-info)]"
                    aria-hidden={true}
                  />
                )}
                {activity.type === 'recipe' && (
                  <Icon
                    icon={BookOpen}
                    size="sm"
                    className="text-[var(--color-success)]"
                    aria-hidden={true}
                  />
                )}
                {activity.type === 'menu_dish' && (
                  <Icon
                    icon={UtensilsCrossed}
                    size="sm"
                    className="text-purple-400"
                    aria-hidden={true}
                  />
                )}
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-fluid-sm tablet:text-fluid-base truncate font-medium text-[var(--foreground)]">
                {activity.name}
              </p>
              <p className="text-fluid-xs tablet:text-fluid-sm text-[var(--foreground)]/60">
                {activity.action === 'created' ? 'Created' : 'Updated'} •{' '}
                {new Date(activity.created_at).toLocaleDateString()}
              </p>
            </div>

            <div className="flex-shrink-0">
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  activity.type === 'ingredient'
                    ? 'bg-[var(--color-info)]/20 text-[var(--color-info)]'
                    : activity.type === 'recipe'
                      ? 'bg-[var(--color-success)]/20 text-[var(--color-success)]'
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

export default function RecentActivity() {
  return (
    <ErrorBoundary>
      <RecentActivityContent />
    </ErrorBoundary>
  );
}
