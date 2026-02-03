import { Recipe, RecipePriceData } from '@/lib/types/recipes';
import { RecipeSortField } from '../hooks/useRecipeFiltering';

export function sortRecipes(
  recipes: Recipe[],
  recipePrices: Record<string, RecipePriceData>,
  sortField: RecipeSortField,
  sortOrder: 'asc' | 'desc',
): Recipe[] {
  return [...recipes].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortField) {
      case 'name':
        aValue = (a.recipe_name || '').toLowerCase();
        bValue = (b.recipe_name || '').toLowerCase();
        break;
      case 'recommended_price':
        aValue = recipePrices[a.id]?.recommendedPrice || 0;
        bValue = recipePrices[b.id]?.recommendedPrice || 0;
        break;
      case 'profit_margin':
        aValue = recipePrices[a.id]?.gross_profit_margin || 0;
        bValue = recipePrices[b.id]?.gross_profit_margin || 0;
        break;
      case 'contributing_margin':
        aValue = recipePrices[a.id]?.contributingMargin || 0;
        bValue = recipePrices[b.id]?.contributingMargin || 0;
        break;
      case 'created':
        aValue = new Date(a.created_at).getTime();
        bValue = new Date(b.created_at).getTime();
        break;
      default:
        aValue = (a.recipe_name || '').toLowerCase();
        bValue = (b.recipe_name || '').toLowerCase();
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
}
