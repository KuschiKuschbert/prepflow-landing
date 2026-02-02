'use client';

import { FoodImageGenerator } from '@/components/ui/FoodImageGenerator';
import { Icon } from '@/components/ui/Icon';
import { ChefHat } from 'lucide-react';
import { Recipe, RecipeIngredientWithDetails } from '@/lib/types/recipes';
import { RecipeIngredientsList } from './RecipeIngredientsList';
import { RecipePreviewInstructions } from './RecipePreviewInstructions';

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
          interactive={true}
        />
      </div>

      {/* Instructions Section */}
      <RecipePreviewInstructions
        recipe={recipe}
        aiInstructions={aiInstructions}
        generatingInstructions={generatingInstructions}
      />
    </div>
  );
}
