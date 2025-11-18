/**
 * Helper functions for populating other data (compliance, menu dishes, kitchen sections)
 */

import { createSupabaseAdmin } from '@/lib/supabase';
import { cleanSampleComplianceTypes } from '@/lib/sample-compliance-clean';
import { cleanSampleKitchenSections } from '@/lib/sample-sections-clean';

interface PopulateResults {
  cleaned: number;
  populated: Array<{ table: string; count: number }>;
  errors: Array<{ table: string; error: string }>;
}

/**
 * Populate compliance types
 */
export async function populateComplianceData(
  supabaseAdmin: ReturnType<typeof createSupabaseAdmin>,
  results: PopulateResults,
) {
  const { data: complianceTypesData, error: complianceTypesError } = await supabaseAdmin
    .from('compliance_types')
    .insert(cleanSampleComplianceTypes)
    .select();

  if (complianceTypesError) {
    results.errors.push({ table: 'compliance_types', error: complianceTypesError.message });
  } else {
    results.populated.push({ table: 'compliance_types', count: complianceTypesData?.length || 0 });
  }
}

/**
 * Populate menu dishes
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

/**
 * Populate kitchen sections
 */
export async function populateKitchenSections(
  supabaseAdmin: ReturnType<typeof createSupabaseAdmin>,
  results: PopulateResults,
) {
  const { data: sectionsData, error: sectionsError } = await supabaseAdmin
    .from('kitchen_sections')
    .insert(cleanSampleKitchenSections)
    .select();

  if (sectionsError) {
    results.errors.push({ table: 'kitchen_sections', error: sectionsError.message });
  } else {
    results.populated.push({ table: 'kitchen_sections', count: sectionsData?.length || 0 });
  }
}
