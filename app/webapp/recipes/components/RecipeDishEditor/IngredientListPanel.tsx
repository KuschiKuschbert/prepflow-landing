'use client';

import { useState, useMemo } from 'react';
import { Ingredient } from '@/lib/types/recipes';
import { Icon } from '@/components/ui/Icon';
import { Search, Package, Plus, ArrowLeft, ShoppingBag } from 'lucide-react';

interface IngredientListPanelProps {
  ingredients: Ingredient[];
  onIngredientClick: (ingredient: Ingredient) => void;
  onBack: () => void;
  capitalizeName: (name: string) => string;
}

function ClickableIngredient({
  ingredient,
  onTap,
}: {
  ingredient: Ingredient;
  onTap: (ingredient: Ingredient) => void;
}) {
  const isConsumable = ingredient.category === 'Consumables';

  return (
    <button
      onClick={() => onTap(ingredient)}
      className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 text-left transition-all duration-200 hover:border-[var(--primary)]/50 hover:bg-[var(--primary)]/10 focus:ring-2 focus:ring-[var(--primary)]/50 focus:outline-none"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon
            icon={isConsumable ? ShoppingBag : Package}
            size="md"
            className={isConsumable ? 'text-[var(--accent)]' : 'text-[var(--color-info)]'}
            aria-hidden={true}
          />
          <div>
            <p className="font-medium text-[var(--foreground)]">{ingredient.ingredient_name}</p>
            <p className="text-xs text-[var(--foreground-muted)]">
              {ingredient.cost_per_unit ? `$${ingredient.cost_per_unit.toFixed(2)}` : 'No price'}/
              {ingredient.unit || 'unit'}
              {isConsumable && <span className="ml-2 text-[var(--accent)]">• Consumable</span>}
            </p>
          </div>
        </div>
        <Icon icon={Plus} size="sm" className="text-[var(--primary)]" aria-hidden={true} />
      </div>
    </button>
  );
}

export function IngredientListPanel({
  ingredients,
  onIngredientClick,
  onBack,
  capitalizeName: _capitalizeName,
}: IngredientListPanelProps) {
  const [ingredientSearch, setIngredientSearch] = useState('');

  const filteredIngredients = useMemo(() => {
    // Show ALL ingredients (both regular and consumables) in one list
    if (!ingredientSearch.trim()) return ingredients;
    const searchLower = ingredientSearch.toLowerCase();
    return ingredients.filter(ing => ing.ingredient_name.toLowerCase().includes(searchLower));
  }, [ingredients, ingredientSearch]);

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={onBack}
          className="rounded-lg p-2 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
          aria-label="Back to recipes/dishes"
        >
          <Icon icon={ArrowLeft} size="sm" aria-hidden={true} />
        </button>
        <h3 className="text-lg font-semibold text-[var(--foreground)]">
          Add Ingredients & Consumables
        </h3>
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
            placeholder="Search ingredients and consumables..."
            value={ingredientSearch}
            onChange={e => setIngredientSearch(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] py-2 pr-4 pl-10 text-[var(--foreground)] placeholder-gray-500 focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] focus:outline-none"
          />
        </div>
      </div>

      {/* Ingredients List */}
      <div className="max-h-[calc(100vh-300px)] space-y-2 overflow-y-auto">
        {filteredIngredients.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-[var(--foreground-muted)]">
            <p>{ingredientSearch ? 'No ingredients found' : 'No ingredients available'}</p>
          </div>
        ) : (
          filteredIngredients.map(ingredient => (
            <ClickableIngredient
              key={ingredient.id}
              ingredient={ingredient}
              onTap={onIngredientClick}
            />
          ))
        )}
      </div>
    </div>
  );
}
