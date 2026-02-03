/**
 * Helper to validate GET request parameters.
 */

export interface RecipeQueryParams {
  page: number;
  pageSize: number;
  category?: string;
  excludeAllergens: string[];
  includeAllergens: string[];
  vegetarian: boolean;
  vegan: boolean;
}

/**
 * Validate and parse GET request parameters.
 */
export function validateRequest(searchParams: URLSearchParams): RecipeQueryParams {
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = Math.min(parseInt(searchParams.get('pageSize') || '50'), 1000);
  const category = searchParams.get('category') || undefined;
  const excludeAllergens = searchParams.get('exclude_allergens')?.split(',').filter(Boolean) || [];
  const includeAllergens = searchParams.get('include_allergens')?.split(',').filter(Boolean) || [];
  const vegetarian = searchParams.get('vegetarian') === 'true';
  const vegan = searchParams.get('vegan') === 'true';

  return {
    page,
    pageSize,
    category,
    excludeAllergens,
    includeAllergens,
    vegetarian,
    vegan,
  };
}
