'use client';

import { useTranslation } from '@/lib/useTranslation';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { useEffect, useState } from 'react';
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
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(false); // Start with false to prevent skeleton flash

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        // Fetch recent ingredients
        const { data: ingredients, error: ingredientsError } = await supabase
          .from('ingredients')
          .select('id, ingredient_name, created_at, updated_at')
          .order('updated_at', { ascending: false })
          .limit(3);

        // Fetch recent recipes
        const { data: recipes, error: recipesError } = await supabase
          .from('recipes')
          .select('id, recipe_name, created_at, updated_at')
          .order('updated_at', { ascending: false })
          .limit(3);

        // Fetch recent menu dishes
        const { data: menuDishes, error: menuDishesError } = await supabase
          .from('menu_dishes')
          .select('id, dish_name, created_at, updated_at')
          .order('updated_at', { ascending: false })
          .limit(3);

        // Check for errors and handle gracefully
        if (ingredientsError || recipesError || menuDishesError) {
          console.error('Error fetching recent activity:', { ingredientsError, recipesError, menuDishesError });
          // If tables don't exist yet, just show empty state instead of error
          setActivities([]);
          return;
        }

        // Combine and format activities with proper type checking
        const allActivities: RecentActivity[] = [
          ...(ingredients || []).filter((item): item is any => item && typeof item === 'object' && 'id' in item).map(item => ({
            id: String(item.id),
            type: 'ingredient' as const,
            name: String(item.ingredient_name || 'Unknown'),
            action: 'updated' as const,
            created_at: item.updated_at || item.created_at || new Date().toISOString()
          })),
          ...(recipes || []).filter((item): item is any => item && typeof item === 'object' && 'id' in item).map(item => ({
            id: String(item.id),
            type: 'recipe' as const,
            name: String(item.recipe_name || 'Unknown'),
            action: 'updated' as const,
            created_at: item.updated_at || item.created_at || new Date().toISOString()
          })),
          ...(menuDishes || []).filter((item): item is any => item && typeof item === 'object' && 'id' in item).map(item => ({
            id: String(item.id),
            type: 'menu_dish' as const,
            name: String(item.dish_name || 'Unknown'),
            action: 'updated' as const,
            created_at: item.updated_at || item.created_at || new Date().toISOString()
          }))
        ];

        // Sort by date and take the 5 most recent
        const sortedActivities = allActivities
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5);

        setActivities(sortedActivities);
      } catch (error) {
        // Handle error gracefully
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivity();
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'ingredient': return '🥘';
      case 'recipe': return '📖';
      case 'menu_dish': return '🍽️';
      default: return '📝';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'ingredient': return 'text-[#29E7CD]';
      case 'recipe': return 'text-[#3B82F6]';
      case 'menu_dish': return 'text-[#D925C7]';
      default: return 'text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a]">
        <LoadingSkeleton variant="list" count={5} height="64px" />
      </div>
    );
  }

  return (
    <div className="bg-[#1f1f1f] p-6 rounded-3xl shadow-lg border border-[#2a2a2a]">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-white mb-2">📈 Recent Activity</h2>
        <p className="text-gray-400">Latest updates to your kitchen data</p>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-lg font-semibold text-white mb-2">No Recent Activity</h3>
          <p className="text-gray-400">Start by adding ingredients or creating recipes</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-xl hover:bg-[#2a2a2a]/30 transition-colors duration-200">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] flex items-center justify-center ${getActivityColor(activity.type)}`}>
                <span className="text-lg">{getActivityIcon(activity.type)}</span>
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">
                  {activity.name}
                </p>
                <p className="text-sm text-gray-400">
                  {activity.type.replace('_', ' ')} {activity.action}
                </p>
              </div>
              
              <div className="text-xs text-gray-500">
                {formatDate(activity.created_at)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
