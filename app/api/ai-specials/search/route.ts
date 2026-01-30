import { ingredientsMatch, normalizeIngredient } from '@/lib/ingredient-normalization';
import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// Updated type definition to reflect that ingredients can be objects or strings
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
    const ingredientsParam = searchParams.get('ingredients');
    const queryParam = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '20');
    // If filtering by stock match, we need to fetch significantly more candidates to find the needle in the haystack
    const minStockMatch = parseInt(searchParams.get('min_stock_match') || '0');
    // If we need 90%+ match, we might need to scan 1000 items to find 20 perfect ones.
    const effectiveLimit = minStockMatch > 0 ? 500 : limit;

    const offset = parseInt(searchParams.get('offset') || '0');
    const useStock = searchParams.get('use_stock') === 'true';

    if (!ingredientsParam && !queryParam && !useStock) {
      return NextResponse.json(
        { error: 'Ingredients, query (q), or use_stock parameter required' },
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase Admin not initialized' }, { status: 500 });
    }

    let ftsQuery = '';
    let usedIngredients: string[] = [];
    const stockIngredients: Set<string> = new Set();
    const stockIngredientsRaw: string[] = []; // Keep raw names for fuzzy matching
    let searchType: 'plain' | 'phrase' | 'websearch' = 'websearch';

    // 1. Fetch Stock if requested
    if (useStock) {
      const { data: stockData, error: stockError } = await supabaseAdmin
        .from('ingredients')
        .select('ingredient_name')
        .gt('current_stock', 0);

      if (!stockError && stockData) {
        stockData.forEach(item => {
          const name = item.ingredient_name;
          if (name) {
            stockIngredientsRaw.push(name);
            // Add both normalized and original for FTS
            stockIngredients.add(normalizeIngredient(name));
            stockIngredients.add(name.toLowerCase());
          }
        });
      }
    }

    if (queryParam) {
      // mixed mode: check if it looks like a list of ingredients
      const isIngredientList = /[;,]/.test(queryParam);

      if (isIngredientList) {
        // "chicken breast, cream" -> "chicken breast OR cream"
        // Use 'websearch' to properly interpret "OR" and spaces (as AND)
        searchType = 'websearch';

        // Support comma and semicolon as delimiters
        const terms = queryParam
          .split(/[,;]+/)
          .map(t => t.trim())
          .filter(Boolean);

        usedIngredients = terms;

        // Construct OR query: "chicken breast" OR "cream"
        // Postgres websearch_to_tsquery handles this as: (chicken & breast) | cream
        ftsQuery = terms.join(' OR ');
      } else {
        // Natural Language -> Use Postgres websearch
        // "mediterranean chicken" -> websearch handles the operators
        searchType = 'websearch';
        ftsQuery = queryParam;

        // For ranking/highlighting, we can crudely split by space
        usedIngredients = queryParam.split(/\s+/).filter(t => t.length > 2);
      }
    } else if (ingredientsParam) {
      // Legacy Tag Search
      searchType = 'plain';
      const ingredients = ingredientsParam
        .split(',')
        .map(i => i.trim().toLowerCase())
        .filter(Boolean);
      if (ingredients.length === 0) return NextResponse.json({ data: [] });

      usedIngredients = ingredients;
      // Search for ANY of the ingredients (OR logic)
      ftsQuery = ingredients
        .map(ing => {
          // Split by space and join with & to handle "chicken breast" -> "chicken & breast"
          return `(${ing.split(/\s+/).join(' & ')})`;
        })
        .join(' | ');
    } else if (useStock && stockIngredients.size > 0) {
      // If only use_stock is provided, we used to search for recipes containing ANY of the stock ingredients.
      // However, this limited discovery and could miss 100% matches if the ingredient wasn't in the top 50.
      // Now we intentionally leave ftsQuery empty to allow a broad "scan" of recent recipes.
    }

    if (!ftsQuery && !useStock && !queryParam && !ingredientsParam) {
      // Only return empty if absolutely no criteria provided.
      // If useStock is true (even without FTS), we want to proceed (to scan for matches).
      return NextResponse.json({ data: [], meta: { total: 0, page: 1 } });
    }

    const cuisineParam = searchParams.get('cuisine');

    // ... (existing logic)

    let query = supabaseAdmin.from('ai_specials').select('*');

    // Apply strict cuisine filter if present
    if (cuisineParam) {
      // If comma separated, use IN
      if (cuisineParam.includes(',')) {
        query = query.in('cuisine', cuisineParam.split(','));
      } else {
        query = query.eq('cuisine', cuisineParam);
      }
    }

    // 4. Stock Match (RPC-based) - Unified Logic
    // Uses the partial match RPC which supports pagination (full_count) and varying thresholds.
    // This handles both "Strict 100% Match" (when minStockMatch=100) and "Best Match" (minStockMatch=0).
    if (useStock && !queryParam && !ingredientsParam) {
      // Prepare stock tags
      const stockTags = stockIngredientsRaw.map(s => s.toLowerCase().trim()).filter(s => s);

      // OPTIMIZATION: If no valid stock tags, return empty result immediately
      // This prevents passing empty/invalid search params to RPC which might cause full table scans
      if (stockTags.length === 0) {
        return NextResponse.json({
          data: [],
          meta: { total: 0, page: 1 },
        });
      }

      // Determine which RPC to use based on strictness
      // If minStockMatch is 100, we use the ULTRA-FAST GIN Index Subset Match (v2)
      // If it's less, we use the FTS-based Partial Match (slower but fuzzy)
      const isStrictMatch = minStockMatch >= 100;
      const rpcName = isStrictMatch
        ? 'match_recipes_by_stock_v2'
        : 'match_recipes_by_stock_partial';

      // console.log('[Specials Search] unified stock match:', {
      //     useStock,
      //     minStockMatch,
      //     stockTagCount: stockTags.length,
      //     limit,
      //     offset,
      //     cuisineParam,
      //     rpcToCheck: rpcName
      // });

      // Parameters differ slightly between v2 and partial
      const rpcParams: {
        p_stock_tags: string[];
        p_limit: number;
        p_offset: number;
        p_cuisine: string | null;
        p_min_match?: number;
      } = {
        p_stock_tags: stockTags,
        p_limit: limit,
        p_offset: offset,
        p_cuisine: cuisineParam || null,
      };

      if (!isStrictMatch) {
        rpcParams.p_min_match = minStockMatch;
      }

      const { data: rpcData, error: rpcError } = await supabaseAdmin.rpc(rpcName, rpcParams);

      if (rpcError) {
        // eslint-disable-next-line no-console
        console.error(`Stock Match RPC Error (${rpcName}):`, rpcError);
        return NextResponse.json({ data: [], meta: { total: 0, page: 1 } });
      }

      const transformedData = (rpcData || []).map(
        (row: {
          id: string;
          name: string;
          image_url: string;
          ingredients: string[];
          instructions: string;
          description: string;
          meta: any;
          cuisine: string;
          created_at: string;
          stock_match_percentage?: number;
          stock_match_count?: number;
          total_ingredients?: number;
        }) => ({
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
        }),
      );

      // Get total count from window function
      const totalCount = rpcData?.[0]?.full_count || transformedData.length + offset;

      return NextResponse.json({
        data: transformedData,
        meta: {
          total: Number(totalCount),
          page: Math.floor(offset / limit) + 1,
        },
      });
    }

    // 6. Text Search / Legacy Search (Fallback)
    // Only used if queryParam or ingredientsParam are present
    let recipes: Recipe[] = [];

    // For stock matching, fetch a smaller batch to prevent timeouts (500 was too heavy)
    const fetchLimit = useStock ? 50 : effectiveLimit;
    const actualOffset = offset;

    // Apply search filters if provided
    if (queryParam || ingredientsParam) {
      if (ftsQuery) {
        // console.log(`[Search Debug] Query: "${ftsQuery}", Type: ${searchType}`);
        query = query.textSearch('fts', ftsQuery, { type: searchType, config: 'english' });
      }
    }

    const { data, error: qError } = await query
      .order('created_at', { ascending: false })
      .range(actualOffset, actualOffset + fetchLimit - 1);

    if (data) {
      // console.log(`[Search Debug] Rows returned: ${data.length}`);
    }

    if (qError) {
      throw qError;
    }

    recipes = data as unknown as Recipe[];

    let rankedRecipes = (recipes as unknown as Recipe[])
      ?.map(recipe => {
        // Standard query match count
        const recipeText = JSON.stringify(recipe).toLowerCase();
        const matchCount = usedIngredients.filter(ui =>
          recipeText.includes(ui.toLowerCase()),
        ).length;

        // Stock Match Calculation - use fuzzy matching
        let stockMatchPercentage = 0;
        let stockMatchCount = 0;
        const missingIngredients: string[] = [];

        if (useStock && recipe.ingredients && Array.isArray(recipe.ingredients)) {
          recipe.ingredients.forEach(recipeIng => {
            // Handle both string and object ingredients
            let ingName = '';
            if (typeof recipeIng === 'string') {
              ingName = recipeIng;
            } else if (typeof recipeIng === 'object' && recipeIng !== null && 'name' in recipeIng) {
              ingName = recipeIng.name;
            }

            if (!ingName) return;

            // Check if any stock ingredient matches this recipe ingredient
            let isMatch = false;
            for (const stockItem of stockIngredientsRaw) {
              if (ingredientsMatch(stockItem, ingName)) {
                isMatch = true;
                break;
              }
            }

            if (isMatch) {
              stockMatchCount++;
            } else {
              // Check if pantry staple (salt, oil, water, pepper, sugar) - if so, don't count as missing
              const lowerName = ingName.toLowerCase();
              const isPantry = ['salt', 'pepper', 'water', 'oil', 'sugar'].some(p =>
                lowerName.includes(p),
              );
              if (!isPantry) {
                missingIngredients.push(ingName);
              }
            }
          });

          stockMatchPercentage =
            recipe.ingredients.length > 0
              ? Math.round((stockMatchCount / recipe.ingredients.length) * 100)
              : 0;
        }

        return {
          ...recipe,
          matchCount,
          stockMatchCount,
          stockMatchPercentage,
          missingIngredients, // Pass missing ingredients to frontend
          randomScore: Math.random(), // Assign stable random score for this request
        };
      })
      .sort((a, b) => {
        if (useStock) {
          // Prioritize stock match % then query match
          if ((b.stockMatchPercentage || 0) !== (a.stockMatchPercentage || 0)) {
            return (b.stockMatchPercentage || 0) - (a.stockMatchPercentage || 0);
          }
        }
        // Secondary sort: Number of matched search ingredients
        if ((b.matchCount || 0) !== (a.matchCount || 0)) {
          return (b.matchCount || 0) - (a.matchCount || 0);
        }

        // Tertiary sort: Random Shuffle (for "Show me ideas")
        return (a.randomScore || 0) - (b.randomScore || 0);
      });

    // Filter by minStockMatch if requested
    if (minStockMatch > 0) {
      rankedRecipes = rankedRecipes.filter(r => (r.stockMatchPercentage || 0) >= minStockMatch);
    }

    return NextResponse.json({
      data: rankedRecipes,
      meta: {
        total: recipes?.length, // Note: this is total fetched, not total matching in DB. Pagination with filtering is inexact here.
        page: Math.floor(offset / limit) + 1,
      },
    });
  } catch (error: unknown) {
    // eslint-disable-next-line no-console
    console.error('Search error:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    const stack = error instanceof Error ? error.stack : undefined;
    const rawError = JSON.stringify(error, null, 2);
    return NextResponse.json(
      { error: message, debug_stack: stack, raw: rawError },
      { status: 500 },
    );
  }
}
