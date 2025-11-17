'use client';

import { useState, useMemo } from 'react';
import { Ingredient, Recipe } from '../../cogs/types';
import { Icon } from '@/components/ui/Icon';
import { Search, ChefHat, Package, Plus } from 'lucide-react';

interface DishBuilderDragDropProps {
  recipes: Recipe[];
  ingredients: Ingredient[];
  onRecipeTap: (recipe: Recipe) => void;
  onIngredientTap: (ingredient: Ingredient) => void;
}

function TappableRecipe({ recipe, onTap }: { recipe: Recipe; onTap: (recipe: Recipe) => void }) {
  return (
    <button
      onClick={() => onTap(recipe)}
      className="w-full rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] p-3 text-left transition-all hover:border-[#29E7CD]/50 hover:shadow-lg focus:ring-2 focus:ring-[#29E7CD]/50 focus:outline-none"
    >
      <div className="flex items-center gap-2">
        <Icon icon={ChefHat} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
        <div className="flex-1">
          <div className="font-medium text-white">{recipe.name}</div>
        </div>
        <Icon icon={Plus} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
      </div>
    </button>
  );
}

function TappableIngredient({
  ingredient,
  onTap,
}: {
  ingredient: Ingredient;
  onTap: (ingredient: Ingredient) => void;
}) {
  return (
    <button
      onClick={() => onTap(ingredient)}
      className="w-full rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] p-3 text-left transition-all hover:border-[#29E7CD]/50 hover:shadow-lg focus:ring-2 focus:ring-[#29E7CD]/50 focus:outline-none"
    >
      <div className="flex items-center gap-2">
        <Icon icon={Package} size="sm" className="text-[#3B82F6]" aria-hidden={true} />
        <div className="flex-1">
          <div className="font-medium text-white">{ingredient.ingredient_name}</div>
          <div className="text-xs text-gray-400">
            {ingredient.cost_per_unit ? `$${ingredient.cost_per_unit.toFixed(2)}` : 'No price'}/
            {ingredient.unit || 'unit'}
          </div>
        </div>
        <Icon icon={Plus} size="sm" className="text-[#29E7CD]" aria-hidden={true} />
      </div>
    </button>
  );
}

export default function DishBuilderDragDrop({
  recipes,
  ingredients,
  onRecipeTap,
  onIngredientTap,
}: DishBuilderDragDropProps) {
  const [recipeSearch, setRecipeSearch] = useState('');
  const [ingredientSearch, setIngredientSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'recipes' | 'ingredients'>('recipes');

  const filteredRecipes = useMemo(() => {
    if (!recipeSearch.trim()) return recipes;
    const searchLower = recipeSearch.toLowerCase();
    return recipes.filter(recipe => recipe.name.toLowerCase().includes(searchLower));
  }, [recipes, recipeSearch]);

  const filteredIngredients = useMemo(() => {
    if (!ingredientSearch.trim()) return ingredients;
    const searchLower = ingredientSearch.toLowerCase();
    return ingredients.filter(ing => ing.ingredient_name.toLowerCase().includes(searchLower));
  }, [ingredients, ingredientSearch]);

  return (
    <div className="rounded-xl border border-[#2a2a2a] bg-[#1f1f1f] p-4">
      <h3 className="mb-4 text-lg font-semibold text-white">Tap to Add to Dish</h3>

      {/* Tabs */}
      <div className="mb-4 flex gap-2 border-b border-[#2a2a2a]">
        <button
          onClick={() => setActiveTab('recipes')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'recipes'
              ? 'border-b-2 border-[#29E7CD] text-[#29E7CD]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Recipes ({recipes.length})
        </button>
        <button
          onClick={() => setActiveTab('ingredients')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'ingredients'
              ? 'border-b-2 border-[#29E7CD] text-[#29E7CD]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Ingredients ({ingredients.length})
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Icon
            icon={Search}
            size="sm"
            className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
            aria-hidden={true}
          />
          <input
            type="text"
            placeholder={activeTab === 'recipes' ? 'Search recipes...' : 'Search ingredients...'}
            value={activeTab === 'recipes' ? recipeSearch : ingredientSearch}
            onChange={e =>
              activeTab === 'recipes'
                ? setRecipeSearch(e.target.value)
                : setIngredientSearch(e.target.value)
            }
            className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] py-2 pr-4 pl-10 text-white placeholder-gray-500 focus:border-[#29E7CD] focus:ring-1 focus:ring-[#29E7CD] focus:outline-none"
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-h-[600px] space-y-2 overflow-y-auto">
        {activeTab === 'recipes' ? (
          <>
            {filteredRecipes.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-400">
                {recipeSearch ? 'No recipes found' : 'No recipes available'}
              </div>
            ) : (
              filteredRecipes.map(recipe => (
                <TappableRecipe key={recipe.id} recipe={recipe} onTap={onRecipeTap} />
              ))
            )}
          </>
        ) : (
          <>
            {filteredIngredients.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-400">
                {ingredientSearch ? 'No ingredients found' : 'No ingredients available'}
              </div>
            ) : (
              filteredIngredients.map(ingredient => (
                <TappableIngredient
                  key={ingredient.id}
                  ingredient={ingredient}
                  onTap={onIngredientTap}
                />
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}
