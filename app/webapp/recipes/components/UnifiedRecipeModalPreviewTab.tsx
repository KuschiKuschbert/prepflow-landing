'use client';

import { FoodImageGenerator } from '@/components/ui/FoodImageGenerator';
import { Icon } from '@/components/ui/Icon';
import { ChefHat, FileText, Loader2 } from 'lucide-react';
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
      {/* Food Image Generation */}
      <FoodImageGenerator
        entityType="recipe"
        entityId={recipe.id}
        entityName={recipe.recipe_name}
        imageUrl={recipe.image_url}
        imageUrlAlternative={recipe.image_url_alternative}
        imageUrlModern={recipe.image_url_modern}
        imageUrlMinimalist={recipe.image_url_minimalist}
        className="mb-6"
        compact={false}
      />

      {/* Ingredients Summary */}
      <div>
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[var(--foreground)]">
          <Icon icon={ChefHat} size="md" className="text-[var(--primary)]" aria-hidden={true} />
          Ingredients
          <span className="ml-2 text-sm font-normal text-[var(--foreground-muted)]">
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
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[var(--foreground)]">
          <Icon icon={FileText} size="md" className="text-[var(--primary)]" aria-hidden={true} />
          AI-Generated Cooking Method
        </h3>
        <div className="rounded-lg bg-[var(--background)] p-4">
          {generatingInstructions ? (
            <div className="flex items-center justify-center py-8">
              <Icon
                icon={Loader2}
                size="lg"
                className="animate-spin text-[var(--primary)]"
                aria-hidden={true}
              />
              <span className="ml-3 text-[var(--foreground-muted)]">
                Generating cooking instructions...
              </span>
            </div>
          ) : (
            <div className="whitespace-pre-wrap text-[var(--foreground-secondary)]">
              {aiInstructions}
            </div>
          )}
        </div>
      </div>

      {/* Manual Instructions */}
      {recipe.instructions ? (
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[var(--foreground)]">
            <Icon icon={FileText} size="md" className="text-[var(--primary)]" aria-hidden={true} />
            Manual Instructions
          </h3>
          <div className="rounded-lg bg-[var(--background)] p-4">
            <p className="whitespace-pre-wrap text-[var(--foreground-secondary)]">
              {recipe.instructions}
            </p>
          </div>
        </div>
      ) : (
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[var(--foreground)]">
            <Icon icon={FileText} size="md" className="text-[var(--primary)]" aria-hidden={true} />
            Manual Instructions
          </h3>
          <div className="rounded-lg bg-[var(--background)] p-8 text-center text-[var(--foreground-subtle)]">
            No instructions added yet. Use the Edit button to add instructions.
          </div>
        </div>
      )}
    </div>
  );
}
