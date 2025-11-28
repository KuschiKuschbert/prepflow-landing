/**
 * Data fetching helper for allergen export
 * Orchestrates fetching recipes, dishes, allergens, and menu information
 */

import { AUSTRALIAN_ALLERGENS, consolidateAllergens } from '@/lib/allergens/australian-allergens';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { aggregateDishAllergensForExport } from './aggregateDishAllergens';
import { aggregateRecipeAllergens } from './aggregateRecipeAllergens';
import { fetchMenuItemsMap } from './fetchMenuItems';

export interface AllergenExportItem {
  id: string;
  name: string;
  description?: string;
  type: 'recipe' | 'dish';
  allergens: string[];
  allergenSources: Record<string, string[]>;
  menus: Array<{ menu_id: string; menu_name: string }>;
}

export interface AllergenExportData {
  items: AllergenExportItem[];
}

/**
 * Fetches all data needed for allergen export
 *
 * @param {string[] | null} menuIds - Optional menu IDs to filter by
 * @returns {Promise<AllergenExportData>} Export data with items and allergens
 */
export async function fetchAllergenExportData(
  menuIds: string[] | null = null,
): Promise<AllergenExportData> {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not initialized');
  }

  // Fetch all recipes
  let recipes: any[] = [];
  const { data: recipesData, error: recipesError } = await supabaseAdmin
    .from('recipes')
    .select('*');

  if (recipesError) {
    const errorCode = (recipesError as any).code;
    if (errorCode === '42P01') {
      logger.dev('[Allergen Export] Recipes table not found, returning empty data');
      recipes = [];
    } else {
      logger.error('[Allergen Export] Error fetching recipes:', {
        error: recipesError.message,
        code: errorCode,
      });
      throw new Error(`Failed to fetch recipes: ${recipesError.message}`);
    }
  } else {
    recipes = recipesData || [];
  }

  // Fetch all dishes
  let dishes: any[] = [];
  const { data: dishesData, error: dishesError } = await supabaseAdmin
    .from('dishes')
    .select('id, dish_name, description, allergens');

  if (dishesError && (dishesError as any).code !== '42P01') {
    logger.warn('[Allergen Export] Error fetching dishes:', dishesError);
  } else if (dishesData) {
    dishes = dishesData;
  }

  // Aggregate allergens for recipes
  const { allergensByRecipe, recipeIngredientSources } = await aggregateRecipeAllergens(recipes);

  // Aggregate allergens for dishes
  const dishesWithAllergens = await aggregateDishAllergensForExport(
    dishes,
    recipeIngredientSources,
  );

  // Fetch menu items mapping
  const menuItemsMap = await fetchMenuItemsMap();

  // Combine recipes and dishes with allergen sources
  const recipesWithNormalizedNames = recipes.map(r => ({
    ...r,
    recipe_name: (r as any).recipe_name || (r as any).name || '',
  }));

  const allItems: AllergenExportItem[] = [
    ...recipesWithNormalizedNames.map(r => ({
      id: r.id,
      name: r.recipe_name,
      description: r.description,
      type: 'recipe' as const,
      allergens: consolidateAllergens(allergensByRecipe[r.id] || r.allergens || []).filter(code =>
        AUSTRALIAN_ALLERGENS.map(a => a.code).includes(code),
      ),
      allergenSources: recipeIngredientSources[r.id] || {},
      menus: menuItemsMap[r.id] || [],
    })),
    ...dishesWithAllergens.map(d => ({
      id: d.id,
      name: d.dish_name,
      description: d.description,
      type: 'dish' as const,
      allergens: consolidateAllergens(d.allergens || []).filter(code =>
        AUSTRALIAN_ALLERGENS.map(a => a.code).includes(code),
      ),
      allergenSources: d.allergenSources || {},
      menus: menuItemsMap[d.id] || [],
    })),
  ];

  // Apply menu filter if provided
  let filteredItems = allItems;
  if (menuIds && menuIds.length > 0) {
    filteredItems = filteredItems.filter(item =>
      item.menus.some(menu => menuIds.includes(menu.menu_id)),
    );
  }

  return { items: filteredItems };
}
