import { RecipeSource } from '../hooks/useIngredientData';

interface RecipeSourcesListProps {
  recipeSources: RecipeSource[];
}

export function RecipeSourcesList({ recipeSources }: RecipeSourcesListProps) {
  if (recipeSources.length === 0) return null;

  return (
    <div>
      <h4 className="mb-2 text-xs font-semibold tracking-wider text-gray-300 uppercase">Recipes</h4>
      <div className="space-y-1.5">
        {recipeSources.map(recipe => (
          <div
            key={recipe.source_id}
            className="rounded-lg border border-[#2a2a2a] bg-[#2a2a2a]/30 p-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="truncate text-xs font-medium text-white">{recipe.source_name}</span>
              {recipe.quantity && recipe.unit && (
                <span className="ml-2 text-xs whitespace-nowrap text-gray-400">
                  {recipe.quantity} {recipe.unit}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



