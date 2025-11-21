/**
 * Helper functions for populating dishes without ingredients
 */

import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

export interface IngredientMatch {
  ingredient_id: string;
  ingredient_name: string;
  quantity: number;
  unit: string;
}

/**
 * Check if a dish has direct ingredients (not via recipes)
 * The UI only shows direct dish_ingredients, so we need to ensure all dishes have them
 */
export async function dishHasDirectIngredients(dishId: string): Promise<boolean> {
  if (!supabaseAdmin) {
    throw new Error('Database connection not available');
  }

  // Check direct ingredients only (UI requirement)
  const { data: dishIngredients, error: diError } = await supabaseAdmin
    .from('dish_ingredients')
    .select('id')
    .eq('dish_id', dishId)
    .limit(1);

  if (diError && diError.code !== 'PGRST116') {
    logger.warn('[dishHasDirectIngredients] Error checking dish_ingredients:', {
      dishId,
      error: diError.message,
    });
  }

  return (dishIngredients && dishIngredients.length > 0) || false;
}

/**
 * Check if a dish has any ingredients (direct or via recipes)
 * @deprecated Use dishHasDirectIngredients for UI population
 */
export async function dishHasIngredients(dishId: string): Promise<boolean> {
  return dishHasDirectIngredients(dishId);
}

/**
 * Get default ingredients for a dish based on name patterns
 */
export function getDefaultIngredientsForDish(
  dishName: string,
  availableIngredients: Array<{ id: string; ingredient_name: string; unit: string }>,
): IngredientMatch[] {
  const dishNameLower = dishName.toLowerCase();
  const ingredientMap = new Map<string, string>();
  availableIngredients.forEach(ing => {
    const nameLower = ing.ingredient_name.toLowerCase();
    ingredientMap.set(nameLower, ing.id);
    ingredientMap.set(ing.ingredient_name, ing.id);
  });

  const findIngredient = (name: string): string | null => {
    const nameLower = name.toLowerCase();
    return ingredientMap.get(nameLower) || ingredientMap.get(name) || null;
  };

  const matches: IngredientMatch[] = [];

  // Burger pattern
  if (dishNameLower.includes('burger')) {
    const bunId = findIngredient('bun') || findIngredient('bread') || findIngredient('brioche bun');
    const pattyId =
      findIngredient('beef mince') ||
      findIngredient('beef mince premium') ||
      findIngredient('burger patties');
    const lettuceId = findIngredient('lettuce');
    const tomatoId = findIngredient('tomato') || findIngredient('fresh tomatoes');
    const onionId = findIngredient('onion') || findIngredient('onions brown');
    const cheeseId =
      findIngredient('cheese') || findIngredient('cheddar') || findIngredient('cheese cheddar');

    if (bunId)
      matches.push({ ingredient_id: bunId, ingredient_name: 'Bun', quantity: 1, unit: 'PC' });
    if (pattyId)
      matches.push({
        ingredient_id: pattyId,
        ingredient_name: 'Beef Patty',
        quantity: 150,
        unit: 'GM',
      });
    if (lettuceId)
      matches.push({
        ingredient_id: lettuceId,
        ingredient_name: 'Lettuce',
        quantity: 20,
        unit: 'GM',
      });
    if (tomatoId)
      matches.push({
        ingredient_id: tomatoId,
        ingredient_name: 'Tomato',
        quantity: 30,
        unit: 'GM',
      });
    if (onionId)
      matches.push({ ingredient_id: onionId, ingredient_name: 'Onion', quantity: 15, unit: 'GM' });
    if (cheeseId)
      matches.push({
        ingredient_id: cheeseId,
        ingredient_name: 'Cheese',
        quantity: 30,
        unit: 'GM',
      });
  }
  // Salad pattern
  else if (dishNameLower.includes('salad')) {
    const lettuceId = findIngredient('lettuce');
    const tomatoId = findIngredient('tomato') || findIngredient('fresh tomatoes');
    const onionId = findIngredient('onion') || findIngredient('onions brown');
    const dressingId =
      findIngredient('dressing') ||
      findIngredient('caesar dressing') ||
      findIngredient('olive oil') ||
      findIngredient('olive oil extra virgin');

    if (lettuceId)
      matches.push({
        ingredient_id: lettuceId,
        ingredient_name: 'Lettuce',
        quantity: 100,
        unit: 'GM',
      });
    if (tomatoId)
      matches.push({
        ingredient_id: tomatoId,
        ingredient_name: 'Tomato',
        quantity: 50,
        unit: 'GM',
      });
    if (onionId)
      matches.push({ ingredient_id: onionId, ingredient_name: 'Onion', quantity: 20, unit: 'GM' });
    if (dressingId)
      matches.push({
        ingredient_id: dressingId,
        ingredient_name: 'Dressing',
        quantity: 15,
        unit: 'ML',
      });
  }
  // Pasta pattern
  else if (dishNameLower.includes('pasta')) {
    const pastaId = findIngredient('pasta') || findIngredient('spaghetti');
    const sauceId =
      findIngredient('tomato sauce') ||
      findIngredient('pasta sauce') ||
      findIngredient('fresh tomatoes');
    const cheeseId =
      findIngredient('cheese') || findIngredient('parmesan') || findIngredient('cheddar');
    const garlicId = findIngredient('garlic');
    const oilId = findIngredient('olive oil') || findIngredient('olive oil extra virgin');

    if (pastaId)
      matches.push({ ingredient_id: pastaId, ingredient_name: 'Pasta', quantity: 150, unit: 'GM' });
    if (sauceId)
      matches.push({ ingredient_id: sauceId, ingredient_name: 'Sauce', quantity: 100, unit: 'GM' });
    if (cheeseId)
      matches.push({
        ingredient_id: cheeseId,
        ingredient_name: 'Cheese',
        quantity: 30,
        unit: 'GM',
      });
    if (garlicId)
      matches.push({ ingredient_id: garlicId, ingredient_name: 'Garlic', quantity: 5, unit: 'GM' });
    if (oilId)
      matches.push({ ingredient_id: oilId, ingredient_name: 'Oil', quantity: 10, unit: 'ML' });
  }
  // Chicken pattern
  else if (dishNameLower.includes('chicken')) {
    const chickenId = findIngredient('chicken') || findIngredient('chicken breast');
    const oilId = findIngredient('olive oil') || findIngredient('olive oil extra virgin');
    const garlicId = findIngredient('garlic');
    const onionId = findIngredient('onion') || findIngredient('onions brown');

    if (chickenId)
      matches.push({
        ingredient_id: chickenId,
        ingredient_name: 'Chicken',
        quantity: 150,
        unit: 'GM',
      });
    if (oilId)
      matches.push({ ingredient_id: oilId, ingredient_name: 'Oil', quantity: 10, unit: 'ML' });
    if (garlicId)
      matches.push({ ingredient_id: garlicId, ingredient_name: 'Garlic', quantity: 5, unit: 'GM' });
    if (onionId)
      matches.push({ ingredient_id: onionId, ingredient_name: 'Onion', quantity: 30, unit: 'GM' });
  }
  // Fish pattern
  else if (dishNameLower.includes('fish')) {
    const fishId =
      findIngredient('fish') ||
      findIngredient('salmon') ||
      findIngredient('salmon fillet') ||
      findIngredient('white fish');
    const lemonId = findIngredient('lemon');
    const oilId = findIngredient('olive oil') || findIngredient('olive oil extra virgin');
    const chipsId =
      findIngredient('chips') || findIngredient('potato') || findIngredient('potatoes');

    if (fishId)
      matches.push({ ingredient_id: fishId, ingredient_name: 'Fish', quantity: 200, unit: 'GM' });
    if (lemonId)
      matches.push({ ingredient_id: lemonId, ingredient_name: 'Lemon', quantity: 1, unit: 'PC' });
    if (oilId)
      matches.push({ ingredient_id: oilId, ingredient_name: 'Oil', quantity: 10, unit: 'ML' });
    if (chipsId)
      matches.push({ ingredient_id: chipsId, ingredient_name: 'Chips', quantity: 150, unit: 'GM' });
  }
  // Soup pattern
  else if (dishNameLower.includes('soup')) {
    const onionId = findIngredient('onion') || findIngredient('onions brown');
    const carrotId = findIngredient('carrot') || findIngredient('carrots');
    const tomatoId = findIngredient('tomato') || findIngredient('fresh tomatoes');
    const garlicId = findIngredient('garlic');
    const stockId =
      findIngredient('stock') ||
      findIngredient('chicken stock') ||
      findIngredient('vegetable stock');

    if (onionId)
      matches.push({ ingredient_id: onionId, ingredient_name: 'Onion', quantity: 50, unit: 'GM' });
    if (carrotId)
      matches.push({
        ingredient_id: carrotId,
        ingredient_name: 'Carrot',
        quantity: 50,
        unit: 'GM',
      });
    if (tomatoId)
      matches.push({
        ingredient_id: tomatoId,
        ingredient_name: 'Tomato',
        quantity: 100,
        unit: 'GM',
      });
    if (garlicId)
      matches.push({ ingredient_id: garlicId, ingredient_name: 'Garlic', quantity: 5, unit: 'GM' });
    if (stockId)
      matches.push({ ingredient_id: stockId, ingredient_name: 'Stock', quantity: 250, unit: 'ML' });
  }
  // Pizza pattern
  else if (dishNameLower.includes('pizza')) {
    const doughId =
      findIngredient('dough') || findIngredient('flour') || findIngredient('flour plain');
    const cheeseId =
      findIngredient('cheese') || findIngredient('mozzarella') || findIngredient('cheddar');
    const tomatoId = findIngredient('tomato') || findIngredient('tomato sauce');
    const oilId = findIngredient('olive oil') || findIngredient('olive oil extra virgin');

    if (doughId)
      matches.push({ ingredient_id: doughId, ingredient_name: 'Dough', quantity: 200, unit: 'GM' });
    if (cheeseId)
      matches.push({
        ingredient_id: cheeseId,
        ingredient_name: 'Cheese',
        quantity: 100,
        unit: 'GM',
      });
    if (tomatoId)
      matches.push({
        ingredient_id: tomatoId,
        ingredient_name: 'Tomato',
        quantity: 80,
        unit: 'GM',
      });
    if (oilId)
      matches.push({ ingredient_id: oilId, ingredient_name: 'Oil', quantity: 10, unit: 'ML' });
  }
  // Default: generic ingredients
  else {
    const onionId = findIngredient('onion') || findIngredient('onions brown');
    const garlicId = findIngredient('garlic');
    const oilId = findIngredient('olive oil') || findIngredient('olive oil extra virgin');
    const saltId = findIngredient('salt');
    const pepperId = findIngredient('pepper') || findIngredient('black pepper');

    if (onionId)
      matches.push({ ingredient_id: onionId, ingredient_name: 'Onion', quantity: 50, unit: 'GM' });
    if (garlicId)
      matches.push({ ingredient_id: garlicId, ingredient_name: 'Garlic', quantity: 5, unit: 'GM' });
    if (oilId)
      matches.push({ ingredient_id: oilId, ingredient_name: 'Oil', quantity: 10, unit: 'ML' });
    if (saltId)
      matches.push({ ingredient_id: saltId, ingredient_name: 'Salt', quantity: 2, unit: 'GM' });
    if (pepperId)
      matches.push({ ingredient_id: pepperId, ingredient_name: 'Pepper', quantity: 1, unit: 'GM' });
  }

  // If no matches found, try to add at least 3 common ingredients
  if (matches.length === 0) {
    const commonIngredients = [
      { name: 'onion', variants: ['onion', 'onions brown'] },
      { name: 'garlic', variants: ['garlic'] },
      { name: 'oil', variants: ['olive oil', 'olive oil extra virgin', 'vegetable oil'] },
    ];

    for (const common of commonIngredients) {
      for (const variant of common.variants) {
        const id = findIngredient(variant);
        if (id) {
          matches.push({
            ingredient_id: id,
            ingredient_name: common.name.charAt(0).toUpperCase() + common.name.slice(1),
            quantity: common.name === 'oil' ? 10 : 50,
            unit: common.name === 'oil' ? 'ML' : 'GM',
          });
          break;
        }
      }
    }
  }

  return matches;
}

/**
 * Get ingredient name from ID
 */
export function getIngredientName(
  ingredientId: string,
  availableIngredients: Array<{ id: string; ingredient_name: string }>,
): string {
  const ingredient = availableIngredients.find(ing => ing.id === ingredientId);
  return ingredient?.ingredient_name || 'Unknown';
}

/**
 * Get default ingredients for a recipe based on name patterns
 * Similar to dishes but with recipe-specific quantities
 */
export function getDefaultIngredientsForRecipe(
  recipeName: string,
  availableIngredients: Array<{ id: string; ingredient_name: string; unit: string }>,
): IngredientMatch[] {
  // Reuse dish logic since recipes and dishes have similar patterns
  return getDefaultIngredientsForDish(recipeName, availableIngredients);
}

/**
 * Check if a recipe has ingredients
 */
export async function recipeHasIngredients(recipeId: string): Promise<boolean> {
  if (!supabaseAdmin) {
    throw new Error('Database connection not available');
  }

  const { data: recipeIngredients, error: riError } = await supabaseAdmin
    .from('recipe_ingredients')
    .select('id')
    .eq('recipe_id', recipeId)
    .limit(1);

  if (riError && riError.code !== 'PGRST116') {
    logger.warn('[recipeHasIngredients] Error checking recipe_ingredients:', {
      recipeId,
      error: riError.message,
    });
  }

  return (recipeIngredients && recipeIngredients.length > 0) || false;
}

/**
 * Get ingredients from recipes for a dish
 * Returns ingredients that can be added as direct dish_ingredients
 */
export async function getIngredientsFromRecipes(
  dishId: string,
  availableIngredients: Array<{ id: string; ingredient_name: string; unit: string }>,
): Promise<IngredientMatch[]> {
  if (!supabaseAdmin) {
    throw new Error('Database connection not available');
  }

  // Get dish recipes
  const { data: dishRecipes, error: drError } = await supabaseAdmin
    .from('dish_recipes')
    .select('recipe_id, quantity as recipe_quantity')
    .eq('dish_id', dishId);

  if (drError || !dishRecipes || dishRecipes.length === 0) {
    return [];
  }

  const recipeIds = dishRecipes
    .map((dr: any) => dr.recipe_id)
    .filter((id: any): id is string => Boolean(id));
  if (recipeIds.length === 0) {
    return [];
  }

  // Get recipe ingredients
  const { data: recipeIngredients, error: riError } = await supabaseAdmin
    .from('recipe_ingredients')
    .select('recipe_id, ingredient_id, quantity, unit')
    .in('recipe_id', recipeIds);

  if (riError || !recipeIngredients || recipeIngredients.length === 0) {
    return [];
  }

  // Create ingredient map for lookup
  const ingredientMap = new Map<string, { id: string; unit: string }>();
  availableIngredients.forEach(ing => {
    ingredientMap.set(ing.id, { id: ing.id, unit: ing.unit });
  });

  // Aggregate ingredients from all recipes
  const aggregatedIngredients = new Map<string, { quantity: number; unit: string }>();

  for (const ri of recipeIngredients) {
    if (!ri.ingredient_id || !ingredientMap.has(ri.ingredient_id)) {
      continue;
    }

    const recipeQuantity =
      (dishRecipes.find((dr: any) => dr.recipe_id === ri.recipe_id) as any)?.recipe_quantity || 1;
    const totalQuantity = (ri.quantity || 0) * recipeQuantity;

    if (aggregatedIngredients.has(ri.ingredient_id)) {
      const existing = aggregatedIngredients.get(ri.ingredient_id)!;
      aggregatedIngredients.set(ri.ingredient_id, {
        quantity: existing.quantity + totalQuantity,
        unit: ri.unit || existing.unit,
      });
    } else {
      aggregatedIngredients.set(ri.ingredient_id, {
        quantity: totalQuantity,
        unit: ri.unit || ingredientMap.get(ri.ingredient_id)?.unit || 'GM',
      });
    }
  }

  // Convert to IngredientMatch array
  const matches: IngredientMatch[] = [];
  for (const [ingredientId, data] of aggregatedIngredients.entries()) {
    const ingredient = availableIngredients.find(ing => ing.id === ingredientId);
    if (ingredient) {
      matches.push({
        ingredient_id: ingredientId,
        ingredient_name: ingredient.ingredient_name,
        quantity: data.quantity,
        unit: data.unit,
      });
    }
  }

  return matches;
}
