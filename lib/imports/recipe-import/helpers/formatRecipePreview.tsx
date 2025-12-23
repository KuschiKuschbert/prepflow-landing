import { formatEntityPreview } from '../../import-utils';
import type { RecipeImportRow } from '../../recipe-import';

/**
 * Format recipe for preview
 */
export function formatRecipePreview(recipe: RecipeImportRow, index: number): React.ReactNode {
  return (
    <div className="space-y-1">
      <div className="font-medium text-white">{recipe.recipe_name}</div>
      <div className="text-xs text-gray-400">
        {formatEntityPreview(recipe, [
          'description',
          'yield',
          'yield_unit',
          'category',
          'selling_price',
        ])}
      </div>
    </div>
  );
}

