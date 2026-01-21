import { logger } from '@/lib/logger';
import { supabase } from '@/lib/supabase';

export interface RecentActivity {
  id: string;
  type: 'ingredient' | 'recipe' | 'menu_dish';
  name: string;
  action: 'created' | 'updated';
  created_at: string;
}

export async function fetchRecentActivityData(): Promise<RecentActivity[]> {
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
}
