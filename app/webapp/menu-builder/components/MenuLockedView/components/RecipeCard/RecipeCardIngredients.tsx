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
      <h4 className="mb-2 text-base font-semibold text-white">Ingredients:</h4>
      <div className="space-y-1.5">
        {ingredients.map((ingredient, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-lg bg-[#0a0a0a] px-3 py-1.5"
          >
            <span className="text-xs text-gray-300">{ingredient.name}</span>
            <div className="flex items-center gap-3 text-xs">
              {prepQuantity > 1 && (
                <span className="text-gray-500">
                  {ingredient.quantity} {ingredient.unit} × {prepQuantity} =
                </span>
              )}
              <span className="font-medium text-white">
                {formatScaledQuantity(ingredient.scaledQuantity, ingredient.unit)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
