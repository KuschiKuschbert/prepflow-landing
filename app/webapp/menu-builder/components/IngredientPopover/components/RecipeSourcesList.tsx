import { RecipeSource } from '../hooks/useIngredientData';

interface RecipeSourcesListProps {
  recipeSources: RecipeSource[];
}

export function RecipeSourcesList({ recipeSources }: RecipeSourcesListProps) {
  if (recipeSources.length === 0) return null;

  return (
    <div>
      <h4 className="mb-2 text-xs font-semibold tracking-wider text-[var(--foreground-secondary)] uppercase">
        Recipes
      </h4>
      <div className="space-y-1.5">
        {recipeSources.map(recipe => (
          <div
            key={recipe.source_id}
            className="rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 p-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="truncate text-xs font-medium text-[var(--foreground)]">
                {recipe.source_name}
              </span>
              {recipe.quantity && recipe.unit && (
                <span className="ml-2 text-xs whitespace-nowrap text-[var(--foreground-muted)]">
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
