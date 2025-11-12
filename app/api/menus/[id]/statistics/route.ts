import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const menuId = id;

    if (!menuId) {
      return NextResponse.json({ error: 'Missing menu id' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }

    // Fetch menu items with dishes
    const { data: menuItems } = await supabaseAdmin
      .from('menu_items')
      .select(
        `
        dish_id,
        dishes (
          id,
          dish_name,
          selling_price
        )
      `,
      )
      .eq('menu_id', menuId);

    if (!menuItems || menuItems.length === 0) {
      return NextResponse.json({
        success: true,
        statistics: {
          total_dishes: 0,
          total_cogs: 0,
          total_revenue: 0,
          average_profit_margin: 0,
          food_cost_percent: 0,
        },
      });
    }

    // Calculate costs for each dish
    let totalCOGS = 0;
    let totalRevenue = 0;
    const profitMargins: number[] = [];

    for (const item of menuItems) {
      const dish = item.dishes as any;
      if (!dish) continue;

      const sellingPrice = parseFloat(dish.selling_price) || 0;
      totalRevenue += sellingPrice;

      // Calculate dish cost directly
      let dishCost = 0;

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
        .eq('dish_id', dish.id);

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
                const costPerUnit =
                  ingredient.cost_per_unit_incl_trim || ingredient.cost_per_unit || 0;
                const quantity = parseFloat(ri.quantity) || 0;
                const recipeQuantity = parseFloat(dishRecipe.quantity) || 1;
                dishCost += quantity * recipeQuantity * costPerUnit;
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
        .eq('dish_id', dish.id);

      if (dishIngredients) {
        for (const di of dishIngredients) {
          const ingredient = di.ingredients as any;
          if (ingredient) {
            const costPerUnit = ingredient.cost_per_unit_incl_trim || ingredient.cost_per_unit || 0;
            const quantity = parseFloat(di.quantity) || 0;
            dishCost += quantity * costPerUnit;
          }
        }
      }

      totalCOGS += dishCost;
      if (sellingPrice > 0) {
        const grossProfit = sellingPrice - dishCost;
        const margin = (grossProfit / sellingPrice) * 100;
        profitMargins.push(margin);
      }
    }

    const averageProfitMargin =
      profitMargins.length > 0
        ? profitMargins.reduce((sum, margin) => sum + margin, 0) / profitMargins.length
        : 0;
    const foodCostPercent = totalRevenue > 0 ? (totalCOGS / totalRevenue) * 100 : 0;

    return NextResponse.json({
      success: true,
      statistics: {
        total_dishes: menuItems.length,
        total_cogs: totalCOGS,
        total_revenue: totalRevenue,
        average_profit_margin: averageProfitMargin,
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
