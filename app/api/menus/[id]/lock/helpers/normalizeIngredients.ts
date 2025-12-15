/**
 * Normalize Ingredients to Single Serving
 * Consolidates nested recipes and normalizes all quantities to 1 serving
 */

import { MenuItemData, MenuItemIngredient, MenuItemSubRecipe } from './fetchMenuItemData';

export interface NormalizedIngredient {
  name: string;
  quantity: number; // Per single serving
  unit: string;
  sources: string[]; // Where this ingredient comes from
}

/**
 * Normalize ingredients from a sub-recipe to single serving
 * If recipe yields 4 servings and we need 2 servings of it, we need 0.5 recipe servings per menu item serving
 */
function normalizeSubRecipeIngredients(
  subRecipe: MenuItemSubRecipe,
  recipeServingsNeeded: number, // How many servings of this recipe per menu item serving
): NormalizedIngredient[] {
  const normalized: NormalizedIngredient[] = [];

  // Calculate scaling factor: recipeServingsNeeded / subRecipe.yield
  // Example: Need 2 servings of a recipe that yields 4 = 0.5 recipe batches per menu serving
  const recipeBatchFactor = recipeServingsNeeded / subRecipe.yield;

  for (const ingredient of subRecipe.ingredients) {
    // Scale ingredient quantity: (ingredient per recipe batch) * (recipe batches per menu serving)
    const normalizedQuantity = ingredient.quantity * recipeBatchFactor;

    normalized.push({
      name: ingredient.name,
      quantity: normalizedQuantity,
      unit: ingredient.unit,
      sources: [`recipe:${subRecipe.name}`],
    });
  }

  return normalized;
}

/**
 * Consolidate and normalize all ingredients to single serving
 */
export function normalizeToSingleServing(menuItemData: MenuItemData): NormalizedIngredient[] {
  const ingredientMap = new Map<string, NormalizedIngredient>();

  // Add direct ingredients (already per serving for dishes, need to normalize for recipes)
  for (const ingredient of menuItemData.directIngredients) {
    let normalizedQuantity = ingredient.quantity;

    // If this is a recipe, divide by its yield to get per-serving amount
    if (menuItemData.type === 'recipe' && menuItemData.baseYield > 1) {
      normalizedQuantity = ingredient.quantity / menuItemData.baseYield;
    }

    const key = `${ingredient.name.toLowerCase()}_${ingredient.unit.toLowerCase()}`;
    const existing = ingredientMap.get(key);

    if (existing) {
      // Combine quantities from same ingredient+unit
      existing.quantity += normalizedQuantity;
      existing.sources.push(ingredient.source || 'direct');
    } else {
      ingredientMap.set(key, {
        name: ingredient.name,
        quantity: normalizedQuantity,
        unit: ingredient.unit,
        sources: [ingredient.source || 'direct'],
      });
    }
  }

  // Add ingredients from sub-recipes
  for (const subRecipe of menuItemData.subRecipes) {
    // Calculate how many servings of this recipe we need per menu item serving
    // For dishes: subRecipe.quantity is already per serving
    // Example: dish needs 0.5 servings of a sauce recipe per dish serving
    const recipeServingsPerMenuServing = subRecipe.quantity;

    const normalizedSubIngredients = normalizeSubRecipeIngredients(
      subRecipe,
      recipeServingsPerMenuServing,
    );

    for (const ingredient of normalizedSubIngredients) {
      const key = `${ingredient.name.toLowerCase()}_${ingredient.unit.toLowerCase()}`;
      const existing = ingredientMap.get(key);

      if (existing) {
        existing.quantity += ingredient.quantity;
        existing.sources.push(...ingredient.sources);
      } else {
        ingredientMap.set(key, ingredient);
      }
    }
  }

  // Convert map to array and sort by name
  return Array.from(ingredientMap.values()).sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Consolidate all instructions from menu item and sub-recipes
 */
export function consolidateInstructions(menuItemData: MenuItemData): string {
  const instructions: string[] = [];

  // Add main item instructions if available
  if (menuItemData.instructions) {
    instructions.push(`**${menuItemData.name}:**\n${menuItemData.instructions}`);
  }

  // Add sub-recipe instructions
  for (const subRecipe of menuItemData.subRecipes) {
    if (subRecipe.instructions) {
      instructions.push(`**${subRecipe.name}:**\n${subRecipe.instructions}`);
    }
  }

  return instructions.join('\n\n');
}

