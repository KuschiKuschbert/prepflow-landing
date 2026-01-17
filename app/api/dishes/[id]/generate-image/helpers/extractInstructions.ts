import { DishRecipe } from '@/types/dish';

export function extractInstructions(dishRecipes: DishRecipe[]): string[] {
  const instructions: string[] = [];

  dishRecipes.forEach(dr => {
    const recipe = dr.recipe;
    if (recipe?.instructions && recipe.instructions.trim().length > 0) {
      instructions.push(recipe.instructions.trim());
    }
  });

  return instructions;
}
