import { RecipeAnalysisData } from '@/app/webapp/prep-lists/types';
import { RecipeIngredientWithDetails } from '@/app/webapp/recipes/types';

interface RawRecipe {
  id: string;
  recipe_name: string;
  description?: string;
  yield?: number;
  yield_unit?: string;
  instructions?: string;
}

export function buildRecipesToAnalyze(
  recipes: RawRecipe[],
  recipeIngredientsMap: Map<string, RecipeIngredientWithDetails[]>,
): RecipeAnalysisData[] {
  return recipes
    .filter(recipe => {
      const ingredients = recipeIngredientsMap.get(recipe.id) || [];
      return ingredients.length > 0 && recipe.instructions && recipe.instructions.trim().length > 0;
    })
    .map(recipe => ({
      recipe: {
        id: recipe.id,
        recipe_name: recipe.recipe_name,
        description: recipe.description || '',
        yield: recipe.yield || 1,
        yield_unit: recipe.yield_unit || 'servings',
        instructions: recipe.instructions || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      ingredients: recipeIngredientsMap.get(recipe.id) || [],
      instructions: recipe.instructions || null,
    }));
}
