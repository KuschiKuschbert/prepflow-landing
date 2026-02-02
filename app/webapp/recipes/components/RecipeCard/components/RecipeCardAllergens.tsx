import { AllergenDisplay } from '@/components/ui/AllergenDisplay';
import { DietaryBadge } from '@/components/ui/DietaryBadge';
import type { Recipe } from '@/lib/types/recipes';

interface RecipeCardAllergensProps {
  recipe: Recipe;
}

/**
 * Recipe card allergens and dietary information component
 */
export function RecipeCardAllergens({ recipe }: RecipeCardAllergensProps) {
  const hasAllergens = (recipe.allergens?.length ?? 0) > 0;
  const hasDietaryInfo = recipe.is_vegetarian || recipe.is_vegan;

  if (!hasAllergens && !hasDietaryInfo) {
    return null;
  }

  return (
    <div className="mb-3 ml-7 space-y-2">
      {hasAllergens && (
        <div>
          <span className="text-xs font-medium text-[var(--foreground-muted)]">Allergens:</span>
          <div className="mt-1">
            <AllergenDisplay allergens={recipe.allergens || []} size="sm" showEmpty={false} />
          </div>
        </div>
      )}
      <DietaryBadge
        isVegetarian={recipe.is_vegetarian}
        isVegan={recipe.is_vegan}
        confidence={recipe.dietary_confidence}
        size="sm"
      />
    </div>
  );
}
