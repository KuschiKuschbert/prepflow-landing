import type { Recipe, RecipePriceData } from '@/lib/types/recipes';

export interface RecipeCardProps {
  recipe: Recipe;
  recipePrices: Record<string, RecipePriceData>;
  selectedRecipes: Set<string>;
  onSelectRecipe: (recipeId: string) => void;
  onPreviewRecipe: (recipe: Recipe) => void;
  onEditRecipe: (recipe: Recipe) => void;
  onDeleteRecipe: (recipe: Recipe) => void;
  capitalizeRecipeName: (name: string) => string;
}
