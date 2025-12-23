/**
 * Helper functions for populating menu dishes (old menu_dishes table for Performance page compatibility)
 */

import { createSupabaseAdmin } from '@/lib/supabase';

import { logger } from '@/lib/logger';

interface PopulateResults {
  cleaned: number;
  populated: Array<{ table: string; count: number }>;
  errors: Array<{ table: string; error: string }>;
}

/**
 * Populate menu dishes (old system for Performance page compatibility)
 */
export async function populateMenuDishes(
  supabaseAdmin: ReturnType<typeof createSupabaseAdmin>,
  results: PopulateResults,
  recipesData: any[],
) {
  if (!recipesData || recipesData.length === 0) return;

  const recipeMap = new Map(recipesData.map(r => [r.recipe_name || r.name, r.id]));

  const menuDishes = [
    {
      name: 'Beef Burger',
      recipe_id: recipeMap.get('Beef Burger'),
      selling_price: 18.5,
      number_sold: 45,
    },
    {
      name: 'Caesar Salad',
      recipe_id: recipeMap.get('Caesar Salad'),
      selling_price: 16.5,
      number_sold: 32,
    },
    {
      name: 'Pasta Carbonara',
      recipe_id: recipeMap.get('Pasta Carbonara'),
      selling_price: 22.5,
      number_sold: 28,
    },
    {
      name: 'Chicken Stir Fry',
      recipe_id: recipeMap.get('Chicken Stir Fry'),
      selling_price: 19.5,
      number_sold: 38,
    },
    {
      name: 'Fish and Chips',
      recipe_id: recipeMap.get('Fish and Chips'),
      selling_price: 24.5,
      number_sold: 42,
    },
    {
      name: 'Roast Chicken',
      recipe_id: recipeMap.get('Roast Chicken'),
      selling_price: 28.5,
      number_sold: 25,
    },
    {
      name: 'Vegetable Soup',
      recipe_id: recipeMap.get('Vegetable Soup'),
      selling_price: 14.5,
      number_sold: 20,
    },
    {
      name: 'Grilled Lamb Chops',
      recipe_id: recipeMap.get('Grilled Lamb Chops'),
      selling_price: 32.5,
      number_sold: 18,
    },
  ].filter(dish => dish.recipe_id);

  if (menuDishes.length > 0) {
    const { data: menuDishesData, error: menuDishesError } = await supabaseAdmin
      .from('menu_dishes')
      .insert(menuDishes)
      .select();

    if (menuDishesError) {
      results.errors.push({ table: 'menu_dishes', error: menuDishesError.message });
    } else {
      results.populated.push({ table: 'menu_dishes', count: menuDishesData?.length || 0 });
    }
  }
}



