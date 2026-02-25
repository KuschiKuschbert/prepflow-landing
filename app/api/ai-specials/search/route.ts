import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';

import { buildFtsQuery, shouldProceedWithSearch } from './helpers/buildFtsQuery';
import { fetchStockIngredients } from './helpers/fetchStockIngredients';
import { parseSearchParams, validateSearchParams } from './helpers/parseSearchParams';
import { rankAndFilterRecipes } from './helpers/rankRecipes';
import { runStockMatchRpc } from './helpers/stockMatchHandler';

interface Recipe {
  id: string;
  name: string;
  image_url: string;
  ingredients: (string | { name: string; quantity?: number; unit?: string })[];
  meta: Record<string, unknown>;
  matchCount?: number;
  stockMatchCount?: number;
  stockMatchPercentage?: number;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = parseSearchParams(searchParams);

    const validation = validateSearchParams(params);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase Admin not initialized' }, { status: 500 });
    }

    const stock = params.useStock
      ? await fetchStockIngredients()
      : { stockIngredients: new Set<string>(), stockIngredientsRaw: [] };
    const ftsContext = buildFtsQuery(params, stock);

    if (!shouldProceedWithSearch(params, ftsContext, stock)) {
      return NextResponse.json({ data: [], meta: { total: 0, page: 1 } });
    }

    if (
      params.ingredientsParam &&
      params.ingredientsParam
        .split(',')
        .map(i => i.trim().toLowerCase())
        .filter(Boolean).length === 0
    ) {
      return NextResponse.json({ data: [] });
    }

    let query = supabaseAdmin.from('ai_specials').select('*');

    if (params.cuisineParam) {
      query = params.cuisineParam.includes(',')
        ? query.in('cuisine', params.cuisineParam.split(','))
        : query.eq('cuisine', params.cuisineParam);
    }

    if (params.useStock && !params.queryParam && !params.ingredientsParam) {
      const stockResult = await runStockMatchRpc(params, stock);
      return NextResponse.json(stockResult);
    }

    const fetchLimit = params.useStock ? 50 : params.effectiveLimit;
    if (params.queryParam || params.ingredientsParam) {
      if (ftsContext.ftsQuery) {
        query = query.textSearch('fts', ftsContext.ftsQuery, {
          type: ftsContext.searchType,
          config: 'english',
        });
      }
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .range(params.offset, params.offset + fetchLimit - 1);

    if (error) throw error;

    const recipes = (data || []) as Recipe[];
    const ranked = rankAndFilterRecipes(
      recipes,
      ftsContext.usedIngredients,
      stock.stockIngredientsRaw,
      params.useStock,
      params.minStockMatch,
    );

    return NextResponse.json({
      data: ranked,
      meta: {
        total: recipes.length,
        page: Math.floor(params.offset / params.limit) + 1,
      },
    });
  } catch (error: unknown) {
    logger.error('Search error:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    const stack = error instanceof Error ? error.stack : undefined;
    const rawError = JSON.stringify(error, null, 2);
    return NextResponse.json(
      { error: message, debug_stack: stack, raw: rawError },
      { status: 500 },
    );
  }
}
