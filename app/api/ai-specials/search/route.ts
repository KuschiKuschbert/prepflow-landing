import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

interface Recipe {
  id: string;
  name: string;
  image_url: string;
  ingredients: string[];
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
    let searchType: 'plain' | 'phrase' | 'websearch' = 'websearch';

    // 1. Fetch Stock if requested
    if (useStock) {
        const { data: stockData, error: stockError } = await supabaseAdmin
            .from('ingredients')
            .select('ingredient_name, name')
            .gt('current_stock', 0);

        if (!stockError && stockData) {
            stockData.forEach(item => {
                const name = item.ingredient_name || item.name;
                if (name) stockIngredients.add(name.toLowerCase());
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
        // If only use_stock is provided, search for recipes containing ANY of the stock ingredients
        // Limit to top 50 stock items to prevent query overflow
        const limitedStock = Array.from(stockIngredients).slice(0, 50);
        searchType = 'plain';
        ftsQuery = limitedStock.map(ing => `(${ing.split(/\s+/).join(' & ')})`).join(' | ');
    }

    if (!ftsQuery) {
         return NextResponse.json({ data: [], meta: { total: 0, page: 1 } });
    }

    // Execute Search
    const { data: recipes, error } = await supabaseAdmin
      .from('ai_specials')
      .select('*')
      .textSearch('fts', ftsQuery, {
        type: searchType,
        config: 'english'
      })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    // Optional: Re-rank in memory based on ingredient coverage if needed
    // (Postgres textSearch rank can be added too, but simple count is fine for now)
    const rankedRecipes = (recipes as unknown as Recipe[])?.map(recipe => {
        // Standard query match count
        const recipeText = JSON.stringify(recipe).toLowerCase();
        const matchCount = usedIngredients.filter(ui =>
            recipeText.includes(ui.toLowerCase())
        ).length;

        // Stock Match Calculation
        let stockMatchPercentage = 0;
        let stockMatchCount = 0;

        if (useStock && recipe.ingredients && Array.isArray(recipe.ingredients)) {
             const normalizedRecipeIngredients = recipe.ingredients.map(i => i.toLowerCase());

             normalizedRecipeIngredients.forEach(rIng => {
                for (const stockItem of stockIngredients) {
                    if (rIng.includes(stockItem)) {
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
            stockMatchPercentage
        };
    }).sort((a, b) => {
        if (useStock) {
            // Prioritize stock match % then query match
             if ((b.stockMatchPercentage || 0) !== (a.stockMatchPercentage || 0)) {
                 return (b.stockMatchPercentage || 0) - (a.stockMatchPercentage || 0);
             }
        }
        return (b.matchCount || 0) - (a.matchCount || 0);
    });

    return NextResponse.json({
        data: rankedRecipes,
        meta: {
            total: recipes?.length,
            page: Math.floor(offset / limit) + 1
        }
    });

  } catch (error: unknown) {
    // eslint-disable-next-line no-console
    console.error('Search error:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
