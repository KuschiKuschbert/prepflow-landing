'use client';

import { SelectionCheckbox } from './SelectionCheckbox';

interface Ingredient {
  ingredient_name?: string;
  brand?: string;
  pack_size?: string;
  pack_size_unit?: string;
  pack_price?: number;
  unit?: string;
  cost_per_unit?: number;
}

interface IngredientPreviewRowProps {
  ingredient: Partial<Ingredient>;
  index: number;
  isSelected: boolean;
  onToggle: (index: string, selected: boolean) => void;
  displayCost: {
    cost: number;
    unit: string;
    formattedCost: string;
    packInfo: string;
  };
}

/** A single row in the CSV import preview list */
export function IngredientPreviewRow({
  ingredient,
  index,
  isSelected,
  onToggle,
  displayCost,
}: IngredientPreviewRowProps) {
  return (
    <div
      className={`border-b border-[var(--border)] p-3 transition-colors last:border-b-0 ${
        isSelected ? 'bg-[var(--primary)]/10' : 'hover:bg-[var(--muted)]/20'
      }`}
    >
      <div className="flex items-center space-x-3">
        <SelectionCheckbox
          isSelected={isSelected}
          onToggle={() => onToggle(index.toString(), !isSelected)}
          ariaLabel={`${isSelected ? 'Deselect' : 'Select'} ingredient ${ingredient.ingredient_name || 'Unknown'}`}
        />
        <div className="flex-1">
          <div className="font-medium text-[var(--foreground)]">{ingredient.ingredient_name}</div>
          <div className="text-sm text-[var(--foreground-muted)]">
            {ingredient.brand && `Brand: ${ingredient.brand} • `}
            Cost: ${displayCost.formattedCost}/{displayCost.unit}
            {displayCost.packInfo && ` • ${displayCost.packInfo}`}
          </div>
        </div>
      </div>
    </div>
  );
}
