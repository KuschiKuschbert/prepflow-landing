import { Recipe } from '@/lib/types/recipes';

export interface RecipeTypeInfo {
  recipeType: 'burger' | 'soup' | 'salad' | 'pasta' | 'general';
  cookingMethod: string;
  primaryTechnique: string;
}

export function determineRecipeType(recipe: Recipe): RecipeTypeInfo {
  const nameLower = recipe.recipe_name.toLowerCase();
  if (nameLower.includes('burger') || nameLower.includes('patty'))
    return {
      recipeType: 'burger',
      cookingMethod: 'grill/pan',
      primaryTechnique: 'grilling/pan-frying',
    };
  if (nameLower.includes('soup') || nameLower.includes('stew'))
    return { recipeType: 'soup', cookingMethod: 'stovetop', primaryTechnique: 'simmering' };
  if (nameLower.includes('salad'))
    return { recipeType: 'salad', cookingMethod: 'cold prep', primaryTechnique: 'mixing' };
  if (nameLower.includes('pasta') || nameLower.includes('noodle'))
    return { recipeType: 'pasta', cookingMethod: 'stovetop', primaryTechnique: 'boiling/sautéing' };
  return { recipeType: 'general', cookingMethod: 'stovetop', primaryTechnique: 'sautéing' };
}
