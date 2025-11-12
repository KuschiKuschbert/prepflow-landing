'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { Recipe } from '../types';

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
        { recipe_id: recipes[0].id, quantity: 1, recipe_name: recipes[0].name },
      ]);
    }
  };

  const handleRemoveRecipe = (index: number) => {
    onRecipesChange(selectedRecipes.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-6">
      <div className="mb-3 flex items-center justify-between">
        <label className="text-sm font-medium text-gray-300">Recipes</label>
        <button
          type="button"
          onClick={handleAddRecipe}
          className="flex items-center gap-2 rounded-lg bg-[#2a2a2a] px-3 py-1.5 text-sm text-white transition-colors hover:bg-[#3a3a3a]"
        >
          <Icon icon={Plus} size="sm" />
          Add Recipe
        </button>
      </div>
      <div className="space-y-3">
        {selectedRecipes.map((sr, index) => (
          <div key={index} className="flex gap-3 rounded-lg bg-[#2a2a2a]/30 p-3">
            <select
              value={sr.recipe_id}
              onChange={e => {
                const recipe = recipes.find(r => r.id === e.target.value);
                onRecipesChange(
                  selectedRecipes.map((r, i) =>
                    i === index
                      ? {
                          recipe_id: e.target.value,
                          quantity: r.quantity,
                          recipe_name: recipe?.name,
                        }
                      : r,
                  ),
                );
              }}
              className="flex-1 rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] px-3 py-2 text-white"
            >
              {recipes.map(r => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
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
              className="w-24 rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] px-3 py-2 text-white"
              placeholder="Qty"
            />
            <button
              type="button"
              onClick={() => handleRemoveRecipe(index)}
              className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-500/20"
            >
              <Icon icon={Trash2} size="sm" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
