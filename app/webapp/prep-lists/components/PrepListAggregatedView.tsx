'use client';

import { Icon } from '@/components/ui/Icon';
import { Trash2 } from 'lucide-react';
import type { SectionData } from '@/lib/types/prep-lists';
import { IngredientPrepNotes } from './IngredientPrepNotes';

interface PrepListAggregatedViewProps {
  section: SectionData;
  sectionIndex: number;
  safeIngredients: Array<{ id: string; name?: string; ingredient_name?: string; unit: string }>;
  handleQuantityChange: (sectionIndex: number, ingredientIndex: number, quantity: number) => void;
  handleRemoveIngredient: (sectionIndex: number, ingredientIndex: number) => void;
  handleIngredientSelect: (
    sectionIndex: number,
    ingredientIndex: number,
    ingredientId: string,
  ) => void;
}

export function PrepListAggregatedView({
  section,
  sectionIndex,
  safeIngredients,
  handleQuantityChange,
  handleRemoveIngredient,
  handleIngredientSelect,
}: PrepListAggregatedViewProps) {
  return (
    <div className="space-y-3">
      {section.aggregatedIngredients.map((ingredient, ingredientIndex) => (
        <div
          key={ingredientIndex}
          className="flex items-center gap-4 rounded-xl bg-[var(--muted)]/30 p-4"
        >
          <div className="flex-1">
            {ingredient.ingredientId ? (
              <>
                <p className="font-medium text-[var(--foreground)]">{ingredient.name}</p>
                {ingredient.sources.length > 0 && (
                  <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                    {ingredient.sources.map(s => s.name).join(', ')}
                  </p>
                )}
                <IngredientPrepNotes ingredient={ingredient} />
              </>
            ) : (
              <select
                onChange={e =>
                  handleIngredientSelect(sectionIndex, ingredientIndex, e.target.value)
                }
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
                value={ingredient.ingredientId || ''}
              >
                <option value="">Select ingredient...</option>
                {safeIngredients.map(ing => {
                  const ingName = ing.name || ing.ingredient_name || '';
                  return (
                    <option key={ing.id} value={ing.id}>
                      {ingName} ({ing.unit})
                    </option>
                  );
                })}
              </select>
            )}
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              step="0.01"
              min="0"
              value={ingredient.totalQuantity}
              onChange={e =>
                handleQuantityChange(sectionIndex, ingredientIndex, parseFloat(e.target.value) || 0)
              }
              className="w-24 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-transparent focus:ring-2 focus:ring-[var(--primary)]"
            />
            <span className="w-16 text-sm text-[var(--foreground-secondary)]">
              {ingredient.unit}
            </span>
            <button
              onClick={() => handleRemoveIngredient(sectionIndex, ingredientIndex)}
              className="rounded-lg p-2 text-[var(--color-error)] transition-colors hover:bg-[var(--color-error)]/10"
              aria-label="Remove ingredient"
            >
              <Icon icon={Trash2} size="sm" aria-hidden={true} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
