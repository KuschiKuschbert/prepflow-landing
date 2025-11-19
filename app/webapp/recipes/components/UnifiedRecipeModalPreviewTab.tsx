'use client';

import { Icon } from '@/components/ui/Icon';
import { Loader2, ChefHat, FileText } from 'lucide-react';
import { Recipe, RecipeIngredientWithDetails } from '../types';
import { RecipeIngredientsList } from './RecipeIngredientsList';

interface UnifiedRecipeModalPreviewTabProps {
  recipe: Recipe;
  recipeIngredients: RecipeIngredientWithDetails[];
  aiInstructions: string;
  generatingInstructions: boolean;
  previewYield: number;
  formatQuantity: (
    quantity: number,
    unit: string,
  ) => {
    value: string;
    unit: string;
    original: string;
  };
}

export function UnifiedRecipeModalPreviewTab({
  recipe,
  recipeIngredients,
  aiInstructions,
  generatingInstructions,
  previewYield,
  formatQuantity,
}: UnifiedRecipeModalPreviewTabProps) {
  return (
    <div className="space-y-6">
      {/* Ingredients Summary */}
      <div>
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
          <Icon icon={ChefHat} size="md" className="text-[#29E7CD]" aria-hidden={true} />
          Ingredients
          <span className="ml-2 text-sm font-normal text-gray-400">
            ({recipeIngredients.length} item{recipeIngredients.length !== 1 ? 's' : ''})
          </span>
        </h3>
        <RecipeIngredientsList
          recipeIngredients={recipeIngredients}
          selectedRecipe={recipe}
          previewYield={previewYield}
          formatQuantity={formatQuantity}
        />
      </div>

      {/* AI Instructions */}
      <div>
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
          <Icon icon={FileText} size="md" className="text-[#29E7CD]" aria-hidden={true} />
          AI-Generated Cooking Method
        </h3>
        <div className="rounded-lg bg-[#0a0a0a] p-4">
          {generatingInstructions ? (
            <div className="flex items-center justify-center py-8">
              <Icon
                icon={Loader2}
                size="lg"
                className="animate-spin text-[#29E7CD]"
                aria-hidden={true}
              />
              <span className="ml-3 text-gray-400">Generating cooking instructions...</span>
            </div>
          ) : (
            <div className="whitespace-pre-wrap text-gray-300">{aiInstructions}</div>
          )}
        </div>
      </div>

      {/* Manual Instructions */}
      {recipe.instructions ? (
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
            <Icon icon={FileText} size="md" className="text-[#29E7CD]" aria-hidden={true} />
            Manual Instructions
          </h3>
          <div className="rounded-lg bg-[#0a0a0a] p-4">
            <p className="whitespace-pre-wrap text-gray-300">{recipe.instructions}</p>
          </div>
        </div>
      ) : (
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
            <Icon icon={FileText} size="md" className="text-[#29E7CD]" aria-hidden={true} />
            Manual Instructions
          </h3>
          <div className="rounded-lg bg-[#0a0a0a] p-8 text-center text-gray-500">
            No instructions added yet. Use the Edit button to add instructions.
          </div>
        </div>
      )}
    </div>
  );
}

