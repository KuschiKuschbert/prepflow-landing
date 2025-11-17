'use client';

import { Recipe, RecipeIngredientWithDetails } from '../types';
import { RecipeIngredientsList } from './RecipeIngredientsList';

interface UnifiedRecipeModalIngredientsTabProps {
  recipe: Recipe;
  recipeIngredients: RecipeIngredientWithDetails[];
  previewYield: number;
  formatQuantity: (
    quantity: number,
    unit: string,
  ) => {
    value: string;
    unit: string;
    original: string;
  };
  onEditRecipe: (recipe: Recipe) => void;
}

export function UnifiedRecipeModalIngredientsTab({
  recipe,
  recipeIngredients,
  previewYield,
  formatQuantity,
  onEditRecipe,
}: UnifiedRecipeModalIngredientsTabProps) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Recipe Ingredients</h3>
        <button
          onClick={() => onEditRecipe(recipe)}
          className="rounded-lg bg-[#29E7CD] px-4 py-2 text-sm font-medium text-white hover:bg-[#29E7CD]/80"
        >
          Add/Edit Ingredients
        </button>
      </div>
      <RecipeIngredientsList
        recipeIngredients={recipeIngredients}
        selectedRecipe={recipe}
        previewYield={previewYield}
        formatQuantity={formatQuantity}
      />
    </div>
  );
}

