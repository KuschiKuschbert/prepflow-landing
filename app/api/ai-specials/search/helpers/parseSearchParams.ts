/**
 * Parse and validate AI specials search URL params.
 */

export interface ParsedSearchParams {
  ingredientsParam: string | null;
  queryParam: string | null;
  limit: number;
  minStockMatch: number;
  offset: number;
  useStock: boolean;
  cuisineParam: string | null;
  effectiveLimit: number;
}

export function parseSearchParams(searchParams: URLSearchParams): ParsedSearchParams {
  const ingredientsParam = searchParams.get('ingredients');
  const queryParam = searchParams.get('q');
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const minStockMatch = parseInt(searchParams.get('min_stock_match') || '0', 10);
  const effectiveLimit = minStockMatch > 0 ? 500 : limit;
  const offset = parseInt(searchParams.get('offset') || '0', 10);
  const useStock = searchParams.get('use_stock') === 'true';
  const cuisineParam = searchParams.get('cuisine');

  return {
    ingredientsParam,
    queryParam,
    limit,
    minStockMatch,
    offset,
    useStock,
    cuisineParam,
    effectiveLimit,
  };
}

export function validateSearchParams(params: ParsedSearchParams): {
  valid: boolean;
  error?: string;
} {
  if (!params.ingredientsParam && !params.queryParam && !params.useStock) {
    return { valid: false, error: 'Ingredients, query (q), or use_stock parameter required' };
  }
  return { valid: true };
}
