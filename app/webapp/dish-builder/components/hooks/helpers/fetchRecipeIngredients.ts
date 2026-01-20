import { logger } from "@/lib/logger";

interface RecipeIngredient {
  ingredient_id: string;
  quantity: number;
  unit: string;
}

export async function fetchRecipeIngredients(recipeId: string): Promise<RecipeIngredient[]> {
  try {
    const response = await fetch(`/api/recipes/${recipeId}/ingredients`, {
      cache: 'no-store',
    });

    if (!response.ok) {
       throw new Error(`Failed to fetch ingredients: ${response.statusText}`);
    }

    const data = await response.json();
    return data.items || [];
  } catch (err) {
    logger.error('Failed to load recipe ingredients:', err);
    throw err;
  }
}
