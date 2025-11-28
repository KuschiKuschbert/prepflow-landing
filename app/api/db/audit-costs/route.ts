import { calculateRecipeCost } from '@/app/api/menus/[id]/statistics/helpers/calculateRecipeCost';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

interface AuditResult {
  dishId: string;
  dishName: string;
  apiTotalCost: number;
  uiTotalCost: number;
  discrepancy: number;
  discrepancyPercent: number;
  recipeBreakdown: Array<{
    recipeId: string;
    recipeName: string;
    recipeQuantity: number;
    recipeCost: number;
  }>;
  standaloneIngredients: Array<{
    ingredientName: string;
    quantity: number;
    unit: string;
    cost: number;
  }>;
  issues: string[];
}

export async function GET(request: NextRequest) {
  try {
    // Check admin key for security
    const adminKey = request.headers.get('X-Admin-Key');
    const expectedKey = process.env.SEED_ADMIN_KEY;

    if (!expectedKey || adminKey !== expectedKey) {
      return NextResponse.json(ApiErrorHandler.createError('Unauthorized', 'AUTH_ERROR', 401), {
        status: 401,
      });
    }

    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        ApiErrorHandler.createError('This endpoint is disabled in production', 'FORBIDDEN', 403),
        { status: 403 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Fetch all dishes
    const { data: dishes, error: dishesError } = await supabaseAdmin
      .from('dishes')
      .select('id, dish_name, selling_price');

    if (dishesError) {
      logger.error('[Audit Costs] Error fetching dishes:', {
        error: dishesError,
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to fetch dishes', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    if (!dishes || dishes.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No dishes found',
        results: [],
      });
    }

    const auditResults: AuditResult[] = [];

    // Audit each dish
    for (const dish of dishes) {
      const result: AuditResult = {
        dishId: dish.id,
        dishName: dish.dish_name,
        apiTotalCost: 0,
        uiTotalCost: 0,
        discrepancy: 0,
        discrepancyPercent: 0,
        recipeBreakdown: [],
        standaloneIngredients: [],
        issues: [],
      };

      try {
        // Fetch dish details (recipes and ingredients)
        // Fetch dish_recipes separately to avoid nested relation issues
        const { data: dishRecipesData, error: dishRecipesError } = await supabaseAdmin
          .from('dish_recipes')
          .select('recipe_id, quantity')
          .eq('dish_id', dish.id);

        const { data: dishIngredientsData, error: dishIngredientsError } = await supabaseAdmin
          .from('dish_ingredients')
          .select(
            `
            id,
            quantity,
            unit,
            ingredients (
              id,
              ingredient_name,
              cost_per_unit,
              cost_per_unit_incl_trim,
              trim_peel_waste_percentage,
              yield_percentage,
              category
            )
          `,
          )
          .eq('dish_id', dish.id);

        if (dishRecipesError || dishIngredientsError) {
          result.issues.push(
            `Failed to fetch dish details: ${dishRecipesError?.message || dishIngredientsError?.message || 'Unknown error'}`,
          );
          auditResults.push(result);
          continue;
        }

        // Fetch recipe names separately
        const recipeIds = (dishRecipesData || []).map(dr => dr.recipe_id).filter(Boolean);
        const recipeNamesMap: Record<string, string> = {};
        if (recipeIds.length > 0) {
          const { data: recipesData } = await supabaseAdmin
            .from('recipes')
            .select('id, recipe_name')
            .in('id', recipeIds);
          (recipesData || []).forEach((r: any) => {
            recipeNamesMap[r.id] = r.recipe_name || 'Unknown';
          });
        }

        // Map recipe names to dish_recipes
        const dishRecipesWithNames = (dishRecipesData || []).map(dr => ({
          ...dr,
          recipes: { id: dr.recipe_id, recipe_name: recipeNamesMap[dr.recipe_id] || 'Unknown' },
        }));

        const dishDetails = {
          id: dish.id,
          dish_name: dish.dish_name,
          dish_recipes: dishRecipesWithNames,
          dish_ingredients: dishIngredientsData || [],
        };

        // Calculate API total cost (using same logic as /api/dishes/[id]/cost)
        let apiTotalCost = 0;

        // Calculate cost from recipes
        const dishRecipes = dishDetails.dish_recipes || [];
        for (const dishRecipe of dishRecipes) {
          const recipeId = dishRecipe.recipe_id;
          const recipeQuantity = parseFloat(dishRecipe.quantity) || 1;
          const recipe = dishRecipe.recipes as any;

          try {
            const recipeCost = await calculateRecipeCost(recipeId, recipeQuantity);
            apiTotalCost += recipeCost;

            result.recipeBreakdown.push({
              recipeId,
              recipeName: recipe?.recipe_name || 'Unknown',
              recipeQuantity,
              recipeCost,
            });
          } catch (err) {
            result.issues.push(
              `Failed to calculate recipe cost for ${recipeId}: ${err instanceof Error ? err.message : String(err)}`,
            );
          }
        }

        // Calculate cost from standalone ingredients
        const dishIngredients = dishDetails.dish_ingredients || [];
        for (const di of dishIngredients) {
          const ingredient = di.ingredients as any;
          if (!ingredient) continue;

          const costPerUnit = ingredient.cost_per_unit_incl_trim || ingredient.cost_per_unit || 0;
          const quantity = parseFloat(di.quantity) || 0;
          const isConsumable = ingredient.category === 'Consumables';

          let ingredientCost = 0;
          if (isConsumable) {
            ingredientCost = quantity * costPerUnit;
          } else {
            const wastePercent = ingredient.trim_peel_waste_percentage || 0;
            const yieldPercent = ingredient.yield_percentage || 100;

            let adjustedCost = quantity * costPerUnit;
            if (!ingredient.cost_per_unit_incl_trim && wastePercent > 0) {
              adjustedCost = adjustedCost / (1 - wastePercent / 100);
            }
            adjustedCost = adjustedCost / (yieldPercent / 100);
            ingredientCost = adjustedCost;
          }

          apiTotalCost += ingredientCost;

          result.standaloneIngredients.push({
            ingredientName: ingredient.ingredient_name || 'Unknown',
            quantity,
            unit: di.unit || 'g',
            cost: ingredientCost,
          });
        }

        result.apiTotalCost = apiTotalCost;

        // Calculate UI total cost (simulate useDishCOGSCalculations logic)
        // For UI calculation, we need to fetch recipe ingredients
        let uiTotalCost = 0;

        // Calculate recipe costs for UI
        for (const dishRecipe of dishRecipes) {
          const recipeId = dishRecipe.recipe_id;
          const recipeQuantity = parseFloat(dishRecipe.quantity) || 1;

          // Fetch recipe ingredients
          const { data: recipeIngredients, error: riError } = await supabaseAdmin
            .from('recipe_ingredients')
            .select(
              `
              quantity,
              unit,
              ingredients (
                id,
                ingredient_name,
                cost_per_unit,
                cost_per_unit_incl_trim,
                trim_peel_waste_percentage,
                yield_percentage,
                category
              )
            `,
            )
            .eq('recipe_id', recipeId);

          if (riError || !recipeIngredients) {
            result.issues.push(`Failed to fetch recipe ingredients for ${recipeId}`);
            continue;
          }

          // Calculate UI cost for recipe ingredients (matching convertToCOGSCalculations logic)
          for (const ri of recipeIngredients) {
            const ingredient = ri.ingredients as any;
            if (!ingredient) continue;

            const baseCostPerUnit =
              ingredient.cost_per_unit_incl_trim || ingredient.cost_per_unit || 0;
            const ingredientQuantity = parseFloat(ri.quantity) || 0;
            const isConsumable = ingredient.category === 'Consumables';
            const totalCost = ingredientQuantity * baseCostPerUnit;

            let yieldAdjustedCost = 0;
            if (isConsumable) {
              yieldAdjustedCost = totalCost;
            } else {
              const wastePercent = ingredient.trim_peel_waste_percentage || 0;
              const yieldPercent = ingredient.yield_percentage || 100;

              let wasteAdjustedCost = totalCost;
              if (!ingredient.cost_per_unit_incl_trim && wastePercent > 0) {
                wasteAdjustedCost = totalCost / (1 - wastePercent / 100);
              }
              yieldAdjustedCost = wasteAdjustedCost / (yieldPercent / 100);
            }

            // Scale by recipe quantity
            uiTotalCost += yieldAdjustedCost * recipeQuantity;
          }
        }

        // Calculate standalone ingredient costs for UI (same as API)
        for (const di of dishIngredients) {
          const ingredient = di.ingredients as any;
          if (!ingredient) continue;

          const costPerUnit = ingredient.cost_per_unit_incl_trim || ingredient.cost_per_unit || 0;
          const quantity = parseFloat(di.quantity) || 0;
          const isConsumable = ingredient.category === 'Consumables';

          let ingredientCost = 0;
          if (isConsumable) {
            ingredientCost = quantity * costPerUnit;
          } else {
            const wastePercent = ingredient.trim_peel_waste_percentage || 0;
            const yieldPercent = ingredient.yield_percentage || 100;

            let adjustedCost = quantity * costPerUnit;
            if (!ingredient.cost_per_unit_incl_trim && wastePercent > 0) {
              adjustedCost = adjustedCost / (1 - wastePercent / 100);
            }
            adjustedCost = adjustedCost / (yieldPercent / 100);
            ingredientCost = adjustedCost;
          }

          uiTotalCost += ingredientCost;
        }

        result.uiTotalCost = uiTotalCost;
        result.discrepancy = Math.abs(apiTotalCost - uiTotalCost);
        result.discrepancyPercent =
          apiTotalCost > 0 ? (result.discrepancy / apiTotalCost) * 100 : 0;

        if (result.discrepancy > 0.01) {
          result.issues.push(
            `Cost mismatch: API=${apiTotalCost.toFixed(2)}, UI=${uiTotalCost.toFixed(2)}, Diff=${result.discrepancy.toFixed(2)}`,
          );
        }
      } catch (err) {
        result.issues.push(
          `Error auditing dish: ${err instanceof Error ? err.message : String(err)}`,
        );
      }

      auditResults.push(result);
    }

    // Summary statistics
    const totalDishes = auditResults.length;
    const dishesWithIssues = auditResults.filter(r => r.issues.length > 0).length;
    const dishesWithDiscrepancies = auditResults.filter(r => r.discrepancy > 0.01).length;
    const avgDiscrepancy = auditResults.reduce((sum, r) => sum + r.discrepancy, 0) / totalDishes;
    const maxDiscrepancy = Math.max(...auditResults.map(r => r.discrepancy));

    return NextResponse.json({
      success: true,
      summary: {
        totalDishes,
        dishesWithIssues,
        dishesWithDiscrepancies,
        avgDiscrepancy: avgDiscrepancy.toFixed(2),
        maxDiscrepancy: maxDiscrepancy.toFixed(2),
      },
      results: auditResults,
    });
  } catch (err) {
    logger.error('[Audit Costs] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });

    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? err instanceof Error
            ? err.message
            : 'Unknown error'
          : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}
