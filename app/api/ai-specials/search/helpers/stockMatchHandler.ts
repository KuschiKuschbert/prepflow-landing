/**
 * Handle stock-only RPC path for AI specials search.
 */

import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';

import type { ParsedSearchParams } from './parseSearchParams';
import type { StockIngredientsResult } from './fetchStockIngredients';

interface RpcRow {
  id: string;
  name: string;
  image_url: string;
  ingredients: string[];
  instructions: string;
  description: string;
  meta: Record<string, unknown>;
  cuisine: string;
  created_at: string;
  stock_match_percentage?: number;
  stock_match_count?: number;
  total_ingredients?: number;
  full_count?: number;
}

export interface StockMatchResult {
  data: unknown[];
  meta: { total: number; page: number };
}

export async function runStockMatchRpc(
  params: ParsedSearchParams,
  stock: StockIngredientsResult,
): Promise<StockMatchResult | null> {
  const { stockIngredientsRaw } = stock;
  const { limit, offset, cuisineParam, minStockMatch } = params;

  const stockTags = stockIngredientsRaw.map(s => s.toLowerCase().trim()).filter(Boolean);
  if (stockTags.length === 0) {
    return { data: [], meta: { total: 0, page: 1 } };
  }

  const isStrictMatch = minStockMatch >= 100;
  const rpcName = isStrictMatch ? 'match_recipes_by_stock_v2' : 'match_recipes_by_stock_partial';

  const rpcParams: Record<string, unknown> = {
    p_stock_tags: stockTags,
    p_limit: limit,
    p_offset: offset,
    p_cuisine: cuisineParam || null,
  };
  if (!isStrictMatch) (rpcParams as { p_min_match?: number }).p_min_match = minStockMatch;

  const { data: rpcData, error } = await supabaseAdmin!.rpc(rpcName, rpcParams);

  if (error) {
    logger.error(`Stock Match RPC Error (${rpcName}):`, error);
    return { data: [], meta: { total: 0, page: 1 } };
  }

  const transformedData = (rpcData || []).map((row: RpcRow) => ({
    id: row.id,
    name: row.name,
    image_url: row.image_url,
    ingredients: row.ingredients,
    instructions: row.instructions,
    description: row.description,
    meta: row.meta,
    cuisine: row.cuisine,
    created_at: row.created_at,
    stockMatchPercentage: row.stock_match_percentage || 0,
    stockMatchCount: row.stock_match_count || 0,
    totalIngredients: row.total_ingredients || 0,
    matchCount: 0,
    randomScore: Math.random(),
  }));

  const totalCount = (rpcData as RpcRow[])?.[0]?.full_count ?? transformedData.length + offset;

  return {
    data: transformedData,
    meta: {
      total: Number(totalCount),
      page: Math.floor(offset / limit) + 1,
    },
  };
}
