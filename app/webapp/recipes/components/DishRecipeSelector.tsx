'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { Recipe } from '@/lib/types/recipes';
import DishRecipeCombobox from './DishRecipeCombobox';

interface SelectedRecipe {
  recipe_id: string;
  quantity: number;
  recipe_name?: string;
}

interface DishRecipeSelectorProps {
  recipes: Recipe[];
  selectedRecipes: SelectedRecipe[];
  onRecipesChange: (recipes: SelectedRecipe[]) => void;
}

export default function DishRecipeSelector({
  recipes,
  selectedRecipes,
  onRecipesChange,
}: DishRecipeSelectorProps) {
  const handleAddRecipe = () => {
    if (recipes.length > 0) {
      onRecipesChange([
        ...selectedRecipes,
        { recipe_id: recipes[0].id, quantity: 1, recipe_name: recipes[0].recipe_name },
      ]);
    }
  };

  const handleRemoveRecipe = (index: number) => {
    onRecipesChange(selectedRecipes.filter((_, i) => i !== index));
  };

  const handleRecipeSelect = (index: number, recipe: Recipe) => {
    onRecipesChange(
      selectedRecipes.map((r, i) =>
        i === index
          ? {
              recipe_id: recipe.id,
              quantity: r.quantity,
              recipe_name: recipe.recipe_name,
            }
          : r,
      ),
    );
  };

  return (
    <div className="mb-6">
      <div className="mb-3 flex items-center justify-between">
        <label className="text-sm font-medium text-[var(--foreground-secondary)]">Recipes</label>
        <button
          type="button"
          onClick={handleAddRecipe}
          className="flex items-center gap-2 rounded-lg bg-[var(--muted)] px-3 py-1.5 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--surface-variant)]"
        >
          <Icon icon={Plus} size="sm" />
          Add Recipe
        </button>
      </div>
      <div className="space-y-3">
        {selectedRecipes.map((sr, index) => (
          <div key={index} className="flex gap-3 rounded-lg bg-[var(--muted)]/30 p-3">
            <DishRecipeCombobox
              recipes={recipes}
              selectedRecipe={sr}
              onSelect={recipe => handleRecipeSelect(index, recipe)}
            />
            <input
              type="number"
              step="0.1"
              min="0.1"
              value={sr.quantity}
              onChange={e =>
                onRecipesChange(
                  selectedRecipes.map((r, i) =>
                    i === index ? { ...r, quantity: parseFloat(e.target.value) || 1 } : r,
                  ),
                )
              }
              className="w-24 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[var(--foreground)]"
              placeholder="Qty"
            />
            <button
              type="button"
              onClick={() => handleRemoveRecipe(index)}
              className="rounded-lg p-2 text-[var(--color-error)] transition-colors hover:bg-[var(--color-error)]/20"
            >
              <Icon icon={Trash2} size="sm" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
