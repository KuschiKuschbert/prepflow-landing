'use client';

import type { SectionData } from '../types';

interface PrepListRecipeGroupedViewProps {
  section: SectionData;
}

export function PrepListRecipeGroupedView({ section }: PrepListRecipeGroupedViewProps) {
  return (
    <div className="space-y-4">
      {section.recipeGrouped.map((recipe, recipeIndex) => (
        <div key={recipeIndex} className="rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 p-4">
          <div className="mb-3">
            <h4 className="font-semibold text-white">{recipe.recipeName}</h4>
            {recipe.dishName && <p className="text-sm text-gray-400">From: {recipe.dishName}</p>}
          </div>
          <div className="space-y-2">
            {recipe.ingredients.map((ing, ingIndex) => (
              <div
                key={ingIndex}
                className="flex items-center justify-between rounded-lg bg-[#1f1f1f] px-3 py-2"
              >
                <span className="text-sm text-gray-300">{ing.name}</span>
                <span className="text-sm font-medium text-white">
                  {ing.quantity} {ing.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
