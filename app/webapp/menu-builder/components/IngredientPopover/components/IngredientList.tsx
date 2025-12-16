import { AllergenBadge } from '@/components/ui/AllergenBadge';
import { IngredientData } from '../hooks/useIngredientData';

interface IngredientListProps {
  ingredients: IngredientData[];
}

export function IngredientList({ ingredients }: IngredientListProps) {
  if (ingredients.length === 0) return null;

  return (
    <div>
      <h4 className="mb-2 text-xs font-semibold tracking-wider text-[var(--foreground-secondary)] uppercase">
        Ingredients
      </h4>
      <div className="space-y-1.5">
        {ingredients.map(ingredient => (
          <div
            key={ingredient.id}
            className="rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 p-2.5"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="mb-1.5 flex items-center gap-1.5">
                  <span className="truncate text-xs font-medium text-[var(--foreground)]">
                    {ingredient.ingredient_name}
                  </span>
                  {ingredient.brand && (
                    <span className="truncate text-xs text-[var(--foreground-muted)]">({ingredient.brand})</span>
                  )}
                </div>
                {ingredient.allergens && ingredient.allergens.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {ingredient.allergens.map(allergen => (
                      <AllergenBadge
                        key={allergen}
                        allergenCode={allergen}
                        source={ingredient.allergen_source?.ai ? 'ai' : 'manual'}
                        size="sm"
                      />
                    ))}
                  </div>
                )}
              </div>
              {ingredient.quantity && ingredient.unit && (
                <div className="flex-shrink-0 text-xs whitespace-nowrap text-[var(--foreground-muted)]">
                  {ingredient.quantity} {ingredient.unit}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



