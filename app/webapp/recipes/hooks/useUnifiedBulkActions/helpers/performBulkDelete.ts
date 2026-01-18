/**
 * Perform bulk delete operation.
 */
import { logger } from '@/lib/logger';

export async function performBulkDelete(
  selectedRecipeIds: string[],
  selectedDishIds: string[],
  showSuccess: (message: string) => void,
  showError: (message: string) => void,
): Promise<void> {
  const deletePromises: Promise<Response>[] = [];
  if (selectedRecipeIds.length > 0) {
    deletePromises.push(
      fetch('/api/recipes/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeIds: selectedRecipeIds }),
      }),
    );
  }
  if (selectedDishIds.length > 0) {
    deletePromises.push(
      fetch('/api/dishes/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dishIds: selectedDishIds }),
      }),
    );
  }
  const responses = await Promise.all(deletePromises);
  const results = await Promise.all(responses.map(r => r.json()));
  const errors: string[] = [];
  for (let i = 0; i < responses.length; i++) {
    if (!responses[i].ok) {
      errors.push(results[i].message || results[i].error || 'Deletion failed');
    }
  }
  if (errors.length > 0) {
    showError(errors.join('; '));
    throw new Error(errors.join('; '));
  }
  const recipeCount = selectedRecipeIds.length;
  const dishCount = selectedDishIds.length;
  const message =
    recipeCount > 0 && dishCount > 0
      ? `${recipeCount} recipe${recipeCount > 1 ? 's' : ''} and ${dishCount} dish${dishCount > 1 ? 'es' : ''} deleted successfully!`
      : recipeCount > 0
        ? `${recipeCount} recipe${recipeCount > 1 ? 's' : ''} deleted successfully!`
        : `${dishCount} dish${dishCount > 1 ? 'es' : ''} deleted successfully!`;
  showSuccess(message);
}
