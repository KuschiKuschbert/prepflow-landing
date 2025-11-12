import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const dishId = id;

    if (!dishId) {
      return NextResponse.json({ error: 'Missing dish id' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }

    // Fetch dish
    const { data: dish, error: dishError } = await supabaseAdmin
      .from('dishes')
      .select('id, dish_name, selling_price')
      .eq('id', dishId)
      .single();

    if (dishError || !dish) {
      return NextResponse.json({ error: 'Dish not found' }, { status: 404 });
    }

    let totalCost = 0;

    // Calculate cost from recipes
    const { data: dishRecipes } = await supabaseAdmin
      .from('dish_recipes')
      .select(
        `
        recipe_id,
        quantity,
        recipes (
          id,
          name
        )
      `,
      )
      .eq('dish_id', dishId);

    if (dishRecipes && dishRecipes.length > 0) {
      for (const dishRecipe of dishRecipes) {
        // Fetch recipe ingredients
        const { data: recipeIngredients } = await supabaseAdmin
          .from('recipe_ingredients')
          .select(
            `
            quantity,
            unit,
            ingredients (
              cost_per_unit,
              cost_per_unit_incl_trim,
              trim_peel_waste_percentage,
              yield_percentage
            )
          `,
          )
          .eq('recipe_id', dishRecipe.recipe_id);

        if (recipeIngredients) {
          for (const ri of recipeIngredients) {
            const ingredient = ri.ingredients as any;
            if (ingredient) {
              // Use cost_per_unit_incl_trim if available, otherwise cost_per_unit
              const costPerUnit =
                ingredient.cost_per_unit_incl_trim || ingredient.cost_per_unit || 0;
              const quantity = parseFloat(ri.quantity) || 0;
              const recipeQuantity = parseFloat(dishRecipe.quantity) || 1;

              // Calculate cost: (quantity * recipeQuantity) * costPerUnit
              totalCost += quantity * recipeQuantity * costPerUnit;
            }
          }
        }
      }
    }

    // Calculate cost from standalone ingredients
    const { data: dishIngredients } = await supabaseAdmin
      .from('dish_ingredients')
      .select(
        `
        quantity,
        unit,
        ingredients (
          cost_per_unit,
          cost_per_unit_incl_trim
        )
      `,
      )
      .eq('dish_id', dishId);

    if (dishIngredients) {
      for (const di of dishIngredients) {
        const ingredient = di.ingredients as any;
        if (ingredient) {
          const costPerUnit = ingredient.cost_per_unit_incl_trim || ingredient.cost_per_unit || 0;
          const quantity = parseFloat(di.quantity) || 0;
          totalCost += quantity * costPerUnit;
        }
      }
    }

    const sellingPrice = parseFloat(dish.selling_price) || 0;
    const grossProfit = sellingPrice - totalCost;
    const grossProfitMargin = sellingPrice > 0 ? (grossProfit / sellingPrice) * 100 : 0;
    const foodCostPercent = sellingPrice > 0 ? (totalCost / sellingPrice) * 100 : 0;

    return NextResponse.json({
      success: true,
      cost: {
        total_cost: totalCost,
        selling_price: sellingPrice,
        gross_profit: grossProfit,
        gross_profit_margin: grossProfitMargin,
        food_cost_percent: foodCostPercent,
      },
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
