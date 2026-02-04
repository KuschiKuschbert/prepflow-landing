'use client';

import { IngredientPreviewRow } from './IngredientPreviewRow';

interface Ingredient {
  ingredient_name?: string;
  brand?: string;
  pack_size?: string;
  pack_size_unit?: string;
  pack_price?: number;
  unit?: string;
  cost_per_unit?: number;
}

interface CSVImportPreviewProps {
  parsedIngredients: Partial<Ingredient>[];
  selectedIngredients: Set<string>;
  onSelectIngredient: (index: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  getDisplayCost: (ingredient: Partial<Ingredient>) => {
    cost: number;
    unit: string;
    formattedCost: string;
    packInfo: string;
  };
}

export function CSVImportPreview({
  parsedIngredients,
  selectedIngredients,
  onSelectIngredient,
  onSelectAll,
  getDisplayCost,
}: CSVImportPreviewProps) {
  if (parsedIngredients.length === 0) return null;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium text-[var(--foreground)]">
          Preview ({parsedIngredients.length} ingredients found)
        </h3>
        <div className="space-x-2">
          <button
            onClick={() => onSelectAll(true)}
            className="text-sm text-[var(--primary)] transition-colors hover:text-[var(--primary)]/80"
          >
            Select All
          </button>
          <button
            onClick={() => onSelectAll(false)}
            className="text-sm text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="max-h-60 overflow-y-auto rounded-lg border border-[var(--border)]">
        {parsedIngredients.map((ingredient, index) => (
          <IngredientPreviewRow
            key={index}
            ingredient={ingredient}
            index={index}
            isSelected={selectedIngredients.has(index.toString())}
            onToggle={onSelectIngredient}
            displayCost={getDisplayCost(ingredient)}
          />
        ))}
      </div>
    </div>
  );
}
