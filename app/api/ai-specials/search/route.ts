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
      return NextResponse.json({ error: 'Ingredients, query (q), or use_stock parameter required' }, { status: 400 });
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
        const isIngredientList = queryParam.includes(',');

        if (isIngredientList) {
            // "chicken, basil, garlic" -> "chicken & basil & garlic"
            searchType = 'plain'; // Use plain to support logical operators we construct
            const terms = queryParam.split(',').map(t => t.trim()).filter(Boolean);

            usedIngredients = terms;

            // Construct AND query for specific ingredients
            ftsQuery = terms.map(term => {
                 // Handle spaces within an ingredient: "chicken breast" -> "chicken & breast"
                 return `(${term.split(/\s+/).join(' & ')})`;
            }).join(' & ');
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
        const ingredients = ingredientsParam.split(',').map(i => i.trim().toLowerCase()).filter(Boolean);
        if (ingredients.length === 0) return NextResponse.json({ data: [] });

        usedIngredients = ingredients;
        // Search for ANY of the ingredients (OR logic)
        ftsQuery = ingredients.map(ing => {
             // Split by space and join with & to handle "chicken breast" -> "chicken & breast"
             return `(${ing.split(/\s+/).join(' & ')})`;
        }).join(' | ');
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

    let query = supabaseAdmin
      .from('ai_specials')
      .select('*');

    // Apply strict cuisine filter if present
    if (cuisineParam) {
        // If comma separated, use IN
        if (cuisineParam.includes(',')) {
            query = query.in('cuisine', cuisineParam.split(','));
        } else {
            query = query.eq('cuisine', cuisineParam);
        }
    }

    // 4. Optimized "Ready to Cook" Search (100% Match)
    // Use the new V2 RPC with GIN Index for instant Set Containment matching


    if (useStock && minStockMatch >= 100 && !queryParam && !ingredientsParam) {


        // Prepare stock tags (normalized array of lowercase strings)
        // We use the raw names but clean them, matching the DB generation logic
        const stockTags = stockIngredientsRaw.map(s => s.toLowerCase().trim()).filter(s => s);

        const { data: rpcData, error: rpcError } = await supabaseAdmin.rpc('match_recipes_by_stock_v2', {
            p_stock_tags: stockTags,
            p_limit: limit, // User asked for 10 initially, but we respect the limit param passed by UI
            p_offset: offset,
            p_cuisine: cuisineParam || null
        });

        if (rpcError) {

            throw rpcError;
        }



        // Transform snake_case to camelCase
        const transformedData = (rpcData || []).map((row: Record<string, unknown>) => ({
            id: row.id,
            name: row.name,
            image_url: row.image_url, // Note: DB uses snake_case, Type uses snake_case, all good
            ingredients: row.ingredients,
            instructions: row.instructions,
            description: row.description,
            meta: row.meta,
            cuisine: row.cuisine,
            created_at: row.created_at,
            stockMatchPercentage: 100, // By definition of V2 RPC
            stockMatchCount: row.stock_match_count as number || 0,
            matchCount: 0,
            randomScore: Math.random() // For consistent sorting if needed later
        }));

        return NextResponse.json({
            data: transformedData,
            meta: {
                total: transformedData.length, // Pagination might be inexact if not returning total count, but fine for infinite scroll
                page: Math.floor(offset / limit) + 1
            }
        });
    }

    // 5. Fallback / Standard Search (Partial Match or Text Search)
    // Checks standard query logic with client-side or partial RPC matching (removed partial RPC for now, using direct query)
    let recipes: Recipe[] = [];

    // For stock matching, fetch a smaller batch to prevent timeouts (500 was too heavy)
    const fetchLimit = useStock ? 50 : effectiveLimit;
    // Use a smaller random offset to avoid exceeding record count (24k recipes)
    // And use offset 0 for now to ensure basic functionality works
    const actualOffset = offset;



    // Apply search filters if provided
    if (queryParam || ingredientsParam) {
        if (ftsQuery) {
            query = query.textSearch('fts', ftsQuery, { type: searchType, config: 'english' });
        }
    }

    const { data, error: qError } = await query
        .order('created_at', { ascending: false })
        .range(actualOffset, actualOffset + fetchLimit - 1);

    if (qError) {

        throw qError;
    }


    recipes = data as unknown as Recipe[];


    let rankedRecipes = (recipes as unknown as Recipe[])?.map((recipe) => {
        // Standard query match count
        const recipeText = JSON.stringify(recipe).toLowerCase();
        const matchCount = usedIngredients.filter(ui =>
            recipeText.includes(ui.toLowerCase())
        ).length;

        // Stock Match Calculation - use fuzzy matching
        let stockMatchPercentage = 0;
        let stockMatchCount = 0;

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
                for (const stockItem of stockIngredientsRaw) {
                    if (ingredientsMatch(stockItem, ingName)) {
                        stockMatchCount++;
                        return; // Count each recipe ingredient only once
                    }
                }
             });

             stockMatchPercentage = recipe.ingredients.length > 0
                ? Math.round((stockMatchCount / recipe.ingredients.length) * 100)
                : 0;
        }

        return {
            ...recipe,
            matchCount,
            stockMatchCount,
            stockMatchPercentage,
            randomScore: Math.random() // Assign stable random score for this request
        };
    }).sort((a, b) => {
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
            page: Math.floor(offset / limit) + 1
        }
    });

  } catch (error: unknown) {
    // eslint-disable-next-line no-console
    console.error('Search error:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    const stack = error instanceof Error ? error.stack : undefined;
    const rawError = JSON.stringify(error, null, 2);
    return NextResponse.json({ error: message, debug_stack: stack, raw: rawError }, { status: 500 });
  }
}
