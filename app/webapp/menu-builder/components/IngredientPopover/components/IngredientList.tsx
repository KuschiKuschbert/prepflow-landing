import { AllergenBadge } from '@/components/ui/AllergenBadge';
import { IngredientData } from '../hooks/useIngredientData';

interface IngredientListProps {
  ingredients: IngredientData[];
}

export function IngredientList({ ingredients }: IngredientListProps) {
  if (ingredients.length === 0) return null;

  return (
    <div>
      <h4 className="mb-2 text-xs font-semibold tracking-wider text-gray-300 uppercase">
        Ingredients
      </h4>
      <div className="space-y-1.5">
        {ingredients.map(ingredient => (
          <div
            key={ingredient.id}
            className="rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/30 p-2.5"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="mb-1.5 flex items-center gap-1.5">
                  <span className="truncate text-xs font-medium text-white">
                    {ingredient.ingredient_name}
                  </span>
                  {ingredient.brand && (
                    <span className="truncate text-xs text-gray-400">({ingredient.brand})</span>
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
                <div className="flex-shrink-0 text-xs whitespace-nowrap text-gray-400">
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

