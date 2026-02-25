/**
 * Build FTS query and search context from params and stock.
 */

import type { ParsedSearchParams } from './parseSearchParams';
import type { StockIngredientsResult } from './fetchStockIngredients';

export type SearchType = 'plain' | 'phrase' | 'websearch';

export interface FtsContext {
  ftsQuery: string;
  usedIngredients: string[];
  searchType: SearchType;
}

export function buildFtsQuery(
  params: ParsedSearchParams,
  stock: StockIngredientsResult,
): FtsContext {
  let ftsQuery = '';
  let usedIngredients: string[] = [];
  let searchType: SearchType = 'websearch';

  const { queryParam, ingredientsParam, useStock } = params;
  const { stockIngredients, stockIngredientsRaw } = stock;

  if (queryParam) {
    const isIngredientList = /[;,]/.test(queryParam);
    if (isIngredientList) {
      searchType = 'websearch';
      const terms = queryParam
        .split(/[,;]+/)
        .map(t => t.trim())
        .filter(Boolean);
      usedIngredients = terms;
      ftsQuery = terms.join(' OR ');
    } else {
      searchType = 'websearch';
      ftsQuery = queryParam;
      usedIngredients = queryParam.split(/\s+/).filter(t => t.length > 2);
    }
  } else if (ingredientsParam) {
    searchType = 'plain';
    const ingredients = ingredientsParam
      .split(',')
      .map(i => i.trim().toLowerCase())
      .filter(Boolean);
    usedIngredients = ingredients;
    ftsQuery = ingredients.map(ing => `(${ing.split(/\s+/).join(' & ')})`).join(' | ');
  }
  // useStock-only leaves ftsQuery empty for broad scan

  return { ftsQuery, usedIngredients, searchType };
}

export function shouldProceedWithSearch(
  params: ParsedSearchParams,
  context: FtsContext,
  stock: StockIngredientsResult,
): boolean {
  const { ftsQuery } = context;
  const { queryParam, ingredientsParam, useStock } = params;
  const { stockIngredients } = stock;

  if (ftsQuery || useStock || queryParam || ingredientsParam) return true;
  if (useStock && stockIngredients.size > 0) return true;
  return false;
}
