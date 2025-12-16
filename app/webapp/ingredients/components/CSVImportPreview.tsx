'use client';

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
        {parsedIngredients.map((ingredient, index) => {
          const displayCost = getDisplayCost(ingredient);
          const isSelected = selectedIngredients.has(index.toString());

          return (
            <div
              key={index}
              className={`border-b border-[var(--border)] p-3 transition-colors last:border-b-0 ${
                isSelected ? 'bg-[var(--primary)]/10' : 'hover:bg-[var(--muted)]/20'
              }`}
            >
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onSelectIngredient(index.toString(), !isSelected)}
                  className="flex items-center justify-center transition-colors hover:text-[var(--primary)]"
                  aria-label={`${isSelected ? 'Deselect' : 'Select'} ingredient ${ingredient.ingredient_name || 'Unknown'}`}
                >
                  {isSelected ? (
                    <svg
                      className="h-4 w-4 text-[var(--primary)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <div className="h-4 w-4 rounded border border-[var(--border)] bg-[var(--background)] transition-colors hover:border-[var(--primary)]/50" />
                  )}
                </button>
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
        })}
      </div>
    </div>
  );
}
