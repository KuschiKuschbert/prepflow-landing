'use client';

import { DishWithDetails } from '../types';

interface DishPreviewModalIngredientsListProps {
  dishDetails: DishWithDetails;
}

export function DishPreviewModalIngredientsList({
  dishDetails,
}: DishPreviewModalIngredientsListProps) {
  if (!dishDetails.ingredients || dishDetails.ingredients.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="mb-3 text-lg font-semibold text-white">Standalone Ingredients</h3>
      <div className="space-y-2">
        {dishDetails.ingredients.map((di, index) => (
          <div key={index} className="rounded-lg bg-[#2a2a2a]/30 p-3 text-sm text-gray-300">
            <span className="font-medium text-white">
              {di.ingredients?.ingredient_name || 'Unknown Ingredient'}
            </span>
            <span className="ml-2 text-gray-400">
              {di.quantity} {di.unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

