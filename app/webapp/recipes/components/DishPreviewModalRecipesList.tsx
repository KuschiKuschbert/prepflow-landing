'use client';

import { DishWithDetails } from '../types';

interface DishPreviewModalRecipesListProps {
  dishDetails: DishWithDetails;
}

export function DishPreviewModalRecipesList({ dishDetails }: DishPreviewModalRecipesListProps) {
  if (!dishDetails.recipes || dishDetails.recipes.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="mb-3 text-lg font-semibold text-white">Recipes</h3>
      <div className="space-y-2">
        {dishDetails.recipes.map((dr, index) => (
          <div key={index} className="rounded-lg bg-[#2a2a2a]/30 p-3 text-sm text-gray-300">
            <span className="font-medium text-white">{dr.recipes?.name || 'Unknown Recipe'}</span>
            <span className="ml-2 text-gray-400">× {dr.quantity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

