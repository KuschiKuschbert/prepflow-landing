/**
 * Recipe Card Ingredients Section Component
 */
'use client';

interface ScaledIngredient {
  name: string;
  quantity: number;
  unit: string;
  scaledQuantity: number;
}

interface RecipeCardIngredientsProps {
  ingredients: ScaledIngredient[];
  prepQuantity: number;
  formatScaledQuantity: (quantity: number, unit: string) => string;
}

export function RecipeCardIngredients({
  ingredients,
  prepQuantity,
  formatScaledQuantity,
}: RecipeCardIngredientsProps) {
  return (
    <div className="desktop:float-right desktop:ml-4 desktop:mb-0 desktop:w-80 mb-4 w-full">
      <h4 className="mb-2 text-base font-semibold text-[var(--foreground)]">Ingredients:</h4>
      <div className="space-y-1.5">
        {ingredients.map((ingredient, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-lg bg-[var(--background)] px-3 py-1.5"
          >
            <span className="text-xs text-[var(--foreground-secondary)]">{ingredient.name}</span>
            <div className="flex items-center gap-3 text-xs">
              {prepQuantity > 1 && (
                <span className="text-[var(--foreground-subtle)]">
                  {ingredient.quantity} {ingredient.unit} × {prepQuantity} =
                </span>
              )}
              <span className="font-medium text-[var(--foreground)]">
                {formatScaledQuantity(ingredient.scaledQuantity, ingredient.unit)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
