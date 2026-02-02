import { Recipe } from '@/lib/types/recipes';
import { formatQuantity as formatQuantityUtil } from '../../../utils/formatQuantity';

/**
 * Build formatQuantity function.
 *
 * @param {Object} params - Format parameters
 */
export function buildFormatQuantity(previewYield: number, selectedRecipe: Recipe | null) {
  return (q: number, u: string) =>
    formatQuantityUtil(q, u, previewYield, selectedRecipe?.yield || 1);
}
