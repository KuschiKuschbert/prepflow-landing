/**
 * Search URL builder and response processing for useSpecialsData.
 */
import type { APIRecipe } from '../../utils';

export function buildSearchUrl(
  offset: number,
  ingredients: string[],
  searchQuery: string,
  activeTags: string[],
  activeCuisines: string[],
  isReadyToCook: boolean,
): string {
  let url = `/api/ai-specials/search?limit=50&offset=${offset}`;
  const hasExplicitQuery = searchQuery && searchQuery.length > 0;
  const hasFilters = activeTags.length > 0;

  if (hasExplicitQuery || hasFilters) {
    const parts = [];
    if (searchQuery) parts.push(searchQuery);
    if (hasFilters) parts.push(...activeTags);
    if (ingredients.length > 0) parts.push(...ingredients);
    url += `&q=${encodeURIComponent(parts.join(' '))}`;
  } else if (ingredients.length > 0) {
    url += `&ingredients=${encodeURIComponent(ingredients.join(','))}`;
  }
  if (activeCuisines.length > 0) {
    url += `&cuisine=${encodeURIComponent(activeCuisines.join(','))}`;
  }
  url += '&use_stock=true';
  if (isReadyToCook) url += '&min_stock_match=100';
  return url;
}

export function sortSearchResults(data: APIRecipe[]): APIRecipe[] {
  return [...data].sort((a, b) => {
    const stockA = a.stockMatchPercentage || 0;
    const stockB = b.stockMatchPercentage || 0;
    if (stockA !== stockB) return stockB - stockA;
    const matchA = a.matchCount || 0;
    const matchB = b.matchCount || 0;
    return matchB - matchA;
  });
}
