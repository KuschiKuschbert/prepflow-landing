'use client';

import { useTranslation } from '@/lib/useTranslation';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { useApiCall } from '@/hooks/useApiCall';
import { ApiErrorDisplay } from '@/components/ui/ApiErrorDisplay';
import { supabase } from '@/lib/supabase';

interface RecentActivity {
  id: string;
  type: 'ingredient' | 'recipe' | 'menu_dish';
  name: string;
  action: 'created' | 'updated';
  created_at: string;
}

export default function RecentActivity() {
  const { t } = useTranslation();

  const fetchRecentActivity = async (): Promise<RecentActivity[]> => {
    const activities: RecentActivity[] = [];

    try {
      // Fetch recent ingredients
      const { data: ingredients, error: ingredientsError } = await supabase
        .from('ingredients')
        .select('id, ingredient_name, created_at, updated_at')
        .order('updated_at', { ascending: false })
        .limit(3);

      if (!ingredientsError && ingredients) {
        ingredients.forEach(ingredient => {
          activities.push({
            id: ingredient.id,
            type: 'ingredient',
            name: ingredient.ingredient_name,
            action: ingredient.created_at === ingredient.updated_at ? 'created' : 'updated',
            created_at: ingredient.updated_at,
          });
        });
      }

      // Fetch recent recipes
      const { data: recipes, error: recipesError } = await supabase
        .from('recipes')
        .select('id, name, created_at, updated_at')
        .order('updated_at', { ascending: false })
        .limit(3);

      if (!recipesError && recipes) {
        recipes.forEach(recipe => {
          activities.push({
            id: recipe.id,
            type: 'recipe',
            name: recipe.name,
            action: recipe.created_at === recipe.updated_at ? 'created' : 'updated',
            created_at: recipe.updated_at,
          });
        });
      }

      // Fetch recent menu dishes
      const { data: menuDishes, error: menuDishesError } = await supabase
        .from('menu_dishes')
        .select('id, name, created_at, updated_at')
        .order('updated_at', { ascending: false })
        .limit(3);

      if (!menuDishesError && menuDishes) {
        menuDishes.forEach(dish => {
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
      return activities.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      throw error;
    }
  };

  const {
    data: activities,
    loading,
    error,
    execute: refetch,
  } = useApiCall(fetchRecentActivity, {
    immediate: true,
  });

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
        error={error}
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
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
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
    <div className="rounded-3xl border border-[#2a2a2a] bg-[#1f1f1f] p-6 shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Recent Activity</h2>

        <button
          onClick={refetch}
          className="text-[#29E7CD] transition-colors duration-200 hover:text-[#D925C7]"
          title="Refresh activity"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        {activities.slice(0, 5).map(activity => (
          <div
            key={activity.id}
            className="flex items-center space-x-4 rounded-2xl bg-[#2a2a2a]/30 p-3 transition-colors duration-200 hover:bg-[#2a2a2a]/50"
          >
            <div className="flex-shrink-0">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  activity.type === 'ingredient'
                    ? 'bg-blue-500/20'
                    : activity.type === 'recipe'
                      ? 'bg-green-500/20'
                      : 'bg-purple-500/20'
                }`}
              >
                <svg
                  className={`h-5 w-5 ${
                    activity.type === 'ingredient'
                      ? 'text-blue-400'
                      : activity.type === 'recipe'
                        ? 'text-green-400'
                        : 'text-purple-400'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {activity.type === 'ingredient' && (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  )}
                  {activity.type === 'recipe' && (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  )}
                  {activity.type === 'menu_dish' && (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  )}
                </svg>
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-white">{activity.name}</p>
              <p className="text-sm text-gray-400">
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
