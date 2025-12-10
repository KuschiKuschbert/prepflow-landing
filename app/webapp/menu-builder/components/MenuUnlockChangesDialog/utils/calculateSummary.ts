import { MenuChangeTracking } from '@/lib/menu-lock/change-tracking';
import { groupChangesByType } from './groupChangesByType';

/**
 * Calculate summary text for changes
 */
export function calculateSummary(changes: MenuChangeTracking[]): string {
  const groupedChanges = groupChangesByType(changes);
  const dishCount = groupedChanges.dish.length;
  const recipeCount = groupedChanges.recipe.length;
  const ingredientCount = groupedChanges.ingredient.length;

  const summaryParts: string[] = [];
  if (dishCount > 0) summaryParts.push(`${dishCount} dish${dishCount !== 1 ? 'es' : ''}`);
  if (recipeCount > 0) summaryParts.push(`${recipeCount} recipe${recipeCount !== 1 ? 's' : ''}`);
  if (ingredientCount > 0)
    summaryParts.push(`${ingredientCount} ingredient${ingredientCount !== 1 ? 's' : ''}`);

  return summaryParts.join(', ');
}



