import React from 'react';
import { Ingredient } from '@/lib/types/cogs';

interface IngredientSearchSuggestionsProps {
  filteredIngredients: Ingredient[];
  highlightedIndex: number;
  onIngredientSelect: (ingredient: Ingredient) => void;
}

export const IngredientSearchSuggestions: React.FC<IngredientSearchSuggestionsProps> = ({
  filteredIngredients,
  highlightedIndex,
  onIngredientSelect,
}) => {
  return (
    <div className="suggestions-dropdown relative z-[60] mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-lg">
      {filteredIngredients.slice(0, 10).map((ingredient, index) => {
        const displayCost = ingredient.cost_per_unit_incl_trim || ingredient.cost_per_unit || 0;
        const isHighlighted = highlightedIndex === index;
        return (
          <button
            key={ingredient.id}
            type="button"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              onIngredientSelect(ingredient);
            }}
            className={`w-full border-b border-[var(--border)] px-4 py-3 text-left transition-colors last:border-b-0 ${
              isHighlighted
                ? 'bg-[var(--primary)]/20 hover:bg-[var(--primary)]/30'
                : 'hover:bg-[var(--muted)]/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div
                  className={`font-medium ${isHighlighted ? 'text-[var(--primary)]' : 'text-[var(--foreground)]'}`}
                >
                  {ingredient.ingredient_name}
                </div>
                <div className="text-xs text-[var(--foreground-muted)]">
                  {ingredient.unit && `${ingredient.unit} • `}${displayCost.toFixed(2)}/
                  {ingredient.unit || 'unit'}
                </div>
              </div>
              <div className="text-xs text-[var(--primary)]">
                {ingredient.trim_peel_waste_percentage
                  ? `${ingredient.trim_peel_waste_percentage}% waste`
                  : 'No waste'}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
