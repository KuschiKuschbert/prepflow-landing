/**
 * Helper functions for generating realistic sales data for performance analysis
 */

import { createSupabaseAdmin } from '@/lib/supabase';

import { logger } from '@/lib/logger';

interface Recipe {
  id: string;
  recipe_name: string;
  name?: string; // For backward compatibility
}

interface MenuDish {
  id: string;
  name: string;
  recipe_id: string;
  selling_price: number;
  profit_margin: number;
}

interface SalesDataEntry {
  dish_id: string;
  number_sold: number;
  popularity_percentage: number;
  date: string;
}

/**
 * Get popularity tier and percentage for a recipe based on its name
 */
function getRecipePopularity(recipeName: string): {
  tier: 'high' | 'medium' | 'low';
  percentage: number;
} {
  const name = recipeName.toLowerCase();

  // High popularity dishes
  if (name.includes('fish') && name.includes('chip')) {
    return { tier: 'high', percentage: 0.2 };
  }
  if (name.includes('beef') && name.includes('burger')) {
    return { tier: 'high', percentage: 0.18 };
  }

  // Medium popularity dishes
  if (name.includes('chicken') && (name.includes('stir') || name.includes('fry'))) {
    return { tier: 'medium', percentage: 0.12 };
  }
  if (name.includes('caesar') && name.includes('salad')) {
    return { tier: 'medium', percentage: 0.1 };
  }
  if (name.includes('pasta') && name.includes('carbonara')) {
    return { tier: 'medium', percentage: 0.1 };
  }

  // Lower popularity dishes
  if (name.includes('roast') && name.includes('chicken')) {
    return { tier: 'low', percentage: 0.08 };
  }
  if (name.includes('vegetable') && name.includes('soup')) {
    return { tier: 'low', percentage: 0.06 };
  }
  if (name.includes('lamb') && name.includes('chop')) {
    return { tier: 'low', percentage: 0.05 };
  }

  // Default for other recipes - distribute remaining percentage evenly
  return { tier: 'low', percentage: 0.0 };
}

/**
 * Get default pricing and profit margin for a recipe based on its name
 */
function getDefaultPricing(recipeName: string): { selling_price: number; profit_margin: number } {
  const name = recipeName.toLowerCase();

  // Simple dishes (Soup, Salad)
  if (name.includes('soup') || name.includes('salad')) {
    return { selling_price: 16.0, profit_margin: 70.0 };
  }

  // Standard mains (Burger, Stir Fry)
  if (name.includes('burger') || (name.includes('stir') && name.includes('fry'))) {
    return { selling_price: 19.5, profit_margin: 68.0 };
  }

  // Premium mains (Fish, Pasta, Roast)
  if (name.includes('fish') || name.includes('pasta') || name.includes('roast')) {
    return { selling_price: 24.5, profit_margin: 65.0 };
  }

  // Premium items (Lamb Chops)
  if (name.includes('lamb')) {
    return { selling_price: 32.5, profit_margin: 65.0 };
  }

  // Default pricing
  return { selling_price: 20.0, profit_margin: 68.0 };
}

/**
 * Ensure a menu_dish exists for a recipe, creating it if needed
 */
export async function ensureMenuDishExists(
  recipe: Recipe,
  supabaseAdmin: ReturnType<typeof createSupabaseAdmin>,
): Promise<string | null> {
  // Check if menu_dish already exists for this recipe
  const { data: existingDish, error: checkError } = await supabaseAdmin
    .from('menu_dishes')
    .select('id')
    .eq('recipe_id', recipe.id)
    .maybeSingle();

  if (checkError && checkError.code !== 'PGRST116') {
    // PGRST116 is "not found" which is fine
    logger.error(`Error checking menu_dish for recipe ${recipe.recipe_name || recipe.name}:`, checkError);
    return null;
  }

  if (existingDish) {
    return existingDish.id;
  }

  // Create menu_dish with default pricing
  const recipeName = recipe.recipe_name || recipe.name || '';
  const { selling_price, profit_margin } = getDefaultPricing(recipeName);

  const { data: newDish, error: createError } = await supabaseAdmin
    .from('menu_dishes')
    .insert({
      name: recipeName,
      recipe_id: recipe.id,
      selling_price: selling_price,
      profit_margin: profit_margin,
    })
    .select('id')
    .single();

  if (createError) {
    logger.error(`Error creating menu_dish for recipe ${recipe.recipe_name || recipe.name}:`, createError);
    return null;
  }

  return newDish.id;
}

/**
 * Generate sales data for a month based on recipes
 */
export async function generateSalesDataForMonth(
  recipes: Recipe[],
  startDate: Date,
  endDate: Date,
  supabaseAdmin: ReturnType<typeof createSupabaseAdmin>,
): Promise<{ salesData: SalesDataEntry[]; dishesCreated: number; dishesUsed: number }> {
  const salesData: SalesDataEntry[] = [];
  const dishMap = new Map<string, string>(); // recipe_id -> dish_id
  let dishesCreated = 0;
  let dishesUsed = 0;

  // First, check which dishes already exist
  for (const recipe of recipes) {
    const { data: existingDish } = await supabaseAdmin
      .from('menu_dishes')
      .select('id')
      .eq('recipe_id', recipe.id)
      .maybeSingle();

    if (existingDish) {
      dishMap.set(recipe.id, existingDish.id);
      dishesUsed++;
    }
  }

  // Now ensure menu_dishes exist for all recipes (create missing ones)
  for (const recipe of recipes) {
    if (!dishMap.has(recipe.id)) {
      const dishId = await ensureMenuDishExists(recipe, supabaseAdmin);
      if (dishId) {
        dishMap.set(recipe.id, dishId);
        dishesUsed++;
        dishesCreated++;
      }
    }
  }

  // Calculate popularity percentages for all recipes
  const recipePopularities = recipes.map(recipe => ({
    recipe,
    popularity: getRecipePopularity(recipe.recipe_name || recipe.name || ''),
  }));

  // Calculate total popularity percentage for known recipes
  const totalKnownPopularity = recipePopularities.reduce(
    (sum, rp) => sum + (rp.popularity.percentage > 0 ? rp.popularity.percentage : 0),
    0,
  );

  // Distribute remaining percentage evenly among recipes without specific popularity
  const remainingPercentage = Math.max(0, 1.0 - totalKnownPopularity);
  const recipesWithoutPopularity = recipePopularities.filter(rp => rp.popularity.percentage === 0);
  const evenDistribution =
    recipesWithoutPopularity.length > 0 ? remainingPercentage / recipesWithoutPopularity.length : 0;

  // Update popularity percentages
  recipePopularities.forEach(rp => {
    if (rp.popularity.percentage === 0) {
      rp.popularity.percentage = evenDistribution;
    }
  });

  // Normalize percentages to sum to 1.0
  const totalPopularity = recipePopularities.reduce((sum, rp) => sum + rp.popularity.percentage, 0);
  if (totalPopularity > 0) {
    recipePopularities.forEach(rp => {
      rp.popularity.percentage = rp.popularity.percentage / totalPopularity;
    });
  }

  // Generate sales data for each day
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6; // Fri, Sat, Sun

    // Calculate total guests for the day
    let lunchGuests: number;
    let dinnerGuests: number;

    if (isWeekend) {
      // Weekend: 200-300 lunch, 250-350 dinner
      lunchGuests = 200 + Math.floor(Math.random() * 101); // 200-300
      dinnerGuests = 250 + Math.floor(Math.random() * 101); // 250-350
    } else {
      // Weekday: 100-150 lunch, 120-180 dinner
      lunchGuests = 100 + Math.floor(Math.random() * 51); // 100-150
      dinnerGuests = 120 + Math.floor(Math.random() * 61); // 120-180
    }

    // Total dishes sold = total guests × 1.2 (some guests order multiple items)
    const totalDishesSold = Math.round((lunchGuests + dinnerGuests) * 1.2);

    // Calculate sales for each dish
    const dailySales: Array<{ dishId: string; sold: number }> = [];

    for (const rp of recipePopularities) {
      const dishId = dishMap.get(rp.recipe.id);
      if (!dishId) continue;

      // Base sales = total dishes × popularity percentage
      let baseSold = Math.round(totalDishesSold * rp.popularity.percentage);

      // Add random variation (±10-20%)
      const variation = 0.1 + Math.random() * 0.1; // 0.1 to 0.2
      const variationAmount = Math.random() < 0.5 ? -variation : variation;
      let sold = Math.round(baseSold * (1 + variationAmount));

      // Ensure minimum of 1 sale for dishes that should have sales
      if (rp.popularity.percentage > 0 && sold < 1) {
        sold = 1;
      }

      dailySales.push({ dishId, sold });
    }

    // Calculate actual total (after variations)
    const actualTotal = dailySales.reduce((sum, ds) => sum + ds.sold, 0);

    // Calculate popularity percentages based on actual sales
    for (const ds of dailySales) {
      const popularityPercentage = actualTotal > 0 ? (ds.sold / actualTotal) * 100 : 0;

      salesData.push({
        dish_id: ds.dishId,
        number_sold: ds.sold,
        popularity_percentage: Math.round(popularityPercentage * 100) / 100, // Round to 2 decimals
        date: currentDate.toISOString().split('T')[0], // YYYY-MM-DD format
      });
    }

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return {
    salesData,
    dishesCreated,
    dishesUsed,
  };
}
