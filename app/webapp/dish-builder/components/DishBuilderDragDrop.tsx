'use client';

import { useState, useMemo } from 'react';
import { Ingredient, Recipe } from '../../cogs/types';
import { Icon } from '@/components/ui/Icon';
import { Search, ChefHat, Package, Plus, ShoppingBag } from 'lucide-react';

interface DishBuilderDragDropProps {
  recipes: Recipe[];
  ingredients: Ingredient[];
  onRecipeTap: (recipe: Recipe) => void;
  onIngredientTap: (ingredient: Ingredient) => void;
  onConsumableTap?: (consumable: Ingredient) => void;
}

function TappableRecipe({ recipe, onTap }: { recipe: Recipe; onTap: (recipe: Recipe) => void }) {
  return (
    <button
      onClick={() => onTap(recipe)}
      className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 text-left transition-all hover:border-[var(--primary)]/50 hover:shadow-lg focus:ring-2 focus:ring-[var(--primary)]/50 focus:outline-none"
    >
      <div className="flex items-center gap-2">
        <Icon icon={ChefHat} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
        <div className="flex-1">
          <div className="font-medium text-[var(--foreground)]">{recipe.recipe_name}</div>
        </div>
        <Icon icon={Plus} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
      </div>
    </button>
  );
}

function TappableIngredient({
  ingredient,
  onTap,
  isConsumable = false,
}: {
  ingredient: Ingredient;
  onTap: (ingredient: Ingredient) => void;
  isConsumable?: boolean;
}) {
  return (
    <button
      onClick={() => onTap(ingredient)}
      className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 text-left transition-all hover:border-[var(--primary)]/50 hover:shadow-lg focus:ring-2 focus:ring-[var(--primary)]/50 focus:outline-none"
    >
      <div className="flex items-center gap-2">
        <Icon
          icon={isConsumable ? ShoppingBag : Package}
          size="sm"
          className={isConsumable ? 'text-[var(--accent)]' : 'text-[var(--color-info)]'}
          aria-hidden={true}
        />
        <div className="flex-1">
          <div className="font-medium text-[var(--foreground)]">{ingredient.ingredient_name}</div>
          <div className="text-xs text-[var(--foreground-muted)]">
            {ingredient.cost_per_unit ? `$${ingredient.cost_per_unit.toFixed(2)}` : 'No price'}/
            {ingredient.unit || 'unit'}
          </div>
        </div>
        <Icon icon={Plus} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
      </div>
    </button>
  );
}

export default function DishBuilderDragDrop({
  recipes,
  ingredients,
  onRecipeTap,
  onIngredientTap,
  onConsumableTap,
}: DishBuilderDragDropProps) {
  const [recipeSearch, setRecipeSearch] = useState('');
  const [ingredientSearch, setIngredientSearch] = useState('');
  const [consumableSearch, setConsumableSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'recipes' | 'ingredients' | 'consumables'>('recipes');

  // Separate ingredients and consumables
  const regularIngredients = useMemo(() => {
    return ingredients.filter(ing => ing.category !== 'Consumables');
  }, [ingredients]);

  const consumables = useMemo(() => {
    return ingredients.filter(ing => ing.category === 'Consumables');
  }, [ingredients]);

  const filteredRecipes = useMemo(() => {
    if (!recipeSearch.trim()) return recipes;
    const searchLower = recipeSearch.toLowerCase();
    return recipes.filter(recipe => recipe.recipe_name.toLowerCase().includes(searchLower));
  }, [recipes, recipeSearch]);

  const filteredIngredients = useMemo(() => {
    if (!ingredientSearch.trim()) return regularIngredients;
    const searchLower = ingredientSearch.toLowerCase();
    return regularIngredients.filter(ing =>
      ing.ingredient_name.toLowerCase().includes(searchLower),
    );
  }, [regularIngredients, ingredientSearch]);

  const filteredConsumables = useMemo(() => {
    if (!consumableSearch.trim()) return consumables;
    const searchLower = consumableSearch.toLowerCase();
    return consumables.filter(cons => cons.ingredient_name.toLowerCase().includes(searchLower));
  }, [consumables, consumableSearch]);

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <h3 className="mb-3 text-lg font-semibold text-[var(--foreground)]">Tap to Add to Dish</h3>

      {/* Compact Instructions Banner */}
      <div className="mb-4 rounded-lg border border-[var(--primary)]/20 bg-gradient-to-r from-[var(--primary)]/10 to-[var(--accent)]/10 p-3">
        <div className="flex items-start gap-2 text-xs text-[var(--foreground-secondary)]">
          <Icon
            icon={ChefHat}
            size="sm"
            className="mt-0.5 shrink-0 text-[var(--primary)]"
            aria-hidden={true}
          />
          <div className="flex-1 space-y-1">
            <div>
              <span className="font-medium text-[var(--foreground)]">Tap a recipe</span> to add all
              ingredients at once
            </div>
            <div>
              <span className="font-medium text-[var(--foreground)]">Tap an ingredient</span> to add
              individually
            </div>
            <div className="text-[var(--foreground-muted)]">
              COGS and pricing calculate automatically
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-2 border-b border-[var(--border)]">
        <button
          onClick={() => setActiveTab('recipes')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'recipes'
              ? 'border-b-2 border-[var(--primary)] text-[var(--primary)]'
              : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
          }`}
        >
          Recipes ({recipes.length})
        </button>
        <button
          onClick={() => setActiveTab('ingredients')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'ingredients'
              ? 'border-b-2 border-[var(--primary)] text-[var(--primary)]'
              : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
          }`}
        >
          Ingredients ({regularIngredients.length})
        </button>
        <button
          onClick={() => setActiveTab('consumables')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'consumables'
              ? 'border-b-2 border-[var(--primary)] text-[var(--primary)]'
              : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)]'
          }`}
        >
          Consumables ({consumables.length})
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Icon
            icon={Search}
            size="sm"
            className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--foreground-muted)]"
            aria-hidden={true}
          />
          <input
            type="text"
            placeholder={
              activeTab === 'recipes'
                ? 'Search recipes...'
                : activeTab === 'ingredients'
                  ? 'Search ingredients...'
                  : 'Search consumables...'
            }
            value={
              activeTab === 'recipes'
                ? recipeSearch
                : activeTab === 'ingredients'
                  ? ingredientSearch
                  : consumableSearch
            }
            onChange={e => {
              if (activeTab === 'recipes') {
                setRecipeSearch(e.target.value);
              } else if (activeTab === 'ingredients') {
                setIngredientSearch(e.target.value);
              } else {
                setConsumableSearch(e.target.value);
              }
            }}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] py-2 pr-4 pl-10 text-[var(--foreground)] placeholder-gray-500 focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] focus:outline-none"
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-h-[600px] space-y-2 overflow-y-auto">
        {activeTab === 'recipes' ? (
          <>
            {filteredRecipes.length === 0 ? (
              <div className="py-8 text-center text-sm text-[var(--foreground-muted)]">
                {recipeSearch ? 'No recipes found' : 'No recipes available'}
              </div>
            ) : (
              filteredRecipes.map(recipe => (
                <TappableRecipe key={recipe.id} recipe={recipe} onTap={onRecipeTap} />
              ))
            )}
          </>
        ) : activeTab === 'ingredients' ? (
          <>
            {filteredIngredients.length === 0 ? (
              <div className="py-8 text-center text-sm text-[var(--foreground-muted)]">
                {ingredientSearch ? 'No ingredients found' : 'No ingredients available'}
              </div>
            ) : (
              filteredIngredients.map(ingredient => (
                <TappableIngredient
                  key={ingredient.id}
                  ingredient={ingredient}
                  onTap={onIngredientTap}
                  isConsumable={false}
                />
              ))
            )}
          </>
        ) : (
          <>
            {filteredConsumables.length === 0 ? (
              <div className="py-8 text-center text-sm text-[var(--foreground-muted)]">
                {consumableSearch
                  ? 'No consumables found'
                  : 'No consumables available. Set ingredient category to "Consumables" to add them here.'}
              </div>
            ) : (
              filteredConsumables.map(consumable => (
                <TappableIngredient
                  key={consumable.id}
                  ingredient={consumable}
                  onTap={onConsumableTap || onIngredientTap}
                  isConsumable={true}
                />
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}
