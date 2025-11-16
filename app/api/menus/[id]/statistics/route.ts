import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

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

    // Fetch menu items with dishes and recipes
    const { data: menuItems } = await supabaseAdmin
      .from('menu_items')
      .select(
        `
        dish_id,
        recipe_id,
        dishes (
          id,
          dish_name,
          selling_price
        ),
        recipes (
          id,
          name,
          yield
        )
      `,
      )
      .eq('menu_id', menuId);

    if (!menuItems || menuItems.length === 0) {
      return NextResponse.json({
        success: true,
        statistics: {
          total_items: 0,
          total_dishes: 0,
          total_recipes: 0,
          total_cogs: 0,
          total_revenue: 0,
          gross_profit: 0,
          average_profit_margin: 0,
          food_cost_percent: 0,
        },
      });
    }

    // Helper function to calculate recipe cost
    async function calculateRecipeCost(recipeId: string, quantity: number = 1): Promise<number> {
      if (!supabaseAdmin) return 0;
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
        .eq('recipe_id', recipeId);

      if (!recipeIngredients || recipeIngredients.length === 0) {
        return 0;
      }

      let recipeCost = 0;
      for (const ri of recipeIngredients) {
        const ingredient = ri.ingredients as any;
        if (ingredient) {
          const costPerUnit = ingredient.cost_per_unit_incl_trim || ingredient.cost_per_unit || 0;
          const ingredientQuantity = parseFloat(ri.quantity) || 0;
          const wastePercent = ingredient.trim_peel_waste_percentage || 0;
          const yieldPercent = ingredient.yield_percentage || 100;

          let adjustedCost = ingredientQuantity * costPerUnit * quantity;
          if (!ingredient.cost_per_unit_incl_trim && wastePercent > 0) {
            adjustedCost = adjustedCost / (1 - wastePercent / 100);
          }
          adjustedCost = adjustedCost / (yieldPercent / 100);

          recipeCost += adjustedCost;
        }
      }
      return recipeCost;
    }

    // Calculate costs for each item (dish or recipe)
    let totalCOGS = 0;
    let totalRevenue = 0;
    const profitMargins: number[] = [];
    let dishCount = 0;
    let recipeCount = 0;

    for (const item of menuItems) {
      const dish = item.dishes as any;
      const recipe = item.recipes as any;

      // Handle dishes
      if (dish) {
        dishCount++;
        const sellingPrice = parseFloat(dish.selling_price) || 0;
        totalRevenue += sellingPrice;

        // Calculate dish cost
        let dishCost = 0;

        // Calculate cost from recipes in dish
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
            dishCost += await calculateRecipeCost(
              dishRecipe.recipe_id,
              parseFloat(dishRecipe.quantity) || 1,
            );
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
              cost_per_unit_incl_trim,
              trim_peel_waste_percentage,
              yield_percentage
            )
          `,
          )
          .eq('dish_id', dish.id);

        if (dishIngredients) {
          for (const di of dishIngredients) {
            const ingredient = di.ingredients as any;
            if (ingredient) {
              const costPerUnit =
                ingredient.cost_per_unit_incl_trim || ingredient.cost_per_unit || 0;
              const quantity = parseFloat(di.quantity) || 0;
              const wastePercent = ingredient.trim_peel_waste_percentage || 0;
              const yieldPercent = ingredient.yield_percentage || 100;

              let adjustedCost = quantity * costPerUnit;
              if (!ingredient.cost_per_unit_incl_trim && wastePercent > 0) {
                adjustedCost = adjustedCost / (1 - wastePercent / 100);
              }
              adjustedCost = adjustedCost / (yieldPercent / 100);

              dishCost += adjustedCost;
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

      // Handle recipes - treat them as dishes by calculating a selling price
      if (recipe) {
        recipeCount++;
        const recipeCost = await calculateRecipeCost(recipe.id, 1);
        totalCOGS += recipeCost;

        // Calculate selling price for recipe using standard pricing logic (70% gross profit target)
        // This matches the COGS calculator pricing strategy
        if (recipeCost > 0) {
          const targetGrossProfit = 70; // 70% gross profit = 30% food cost
          const gstRate = 0.1;

          // Calculate GST-exclusive price
          const sellPriceExclGST = recipeCost / (1 - targetGrossProfit / 100);
          const gstAmount = sellPriceExclGST * gstRate;
          const sellPriceInclGST = sellPriceExclGST + gstAmount;

          // Apply charm pricing: Math.ceil() - 0.01 (matching COGS method)
          const finalPriceInclGST = Math.ceil(sellPriceInclGST) - 0.01;

          // Recalculate GST-exclusive from final price
          const finalPriceExclGST = finalPriceInclGST / (1 + gstRate);

          // Add to revenue (using GST-exclusive price for consistency with dishes)
          totalRevenue += finalPriceExclGST;

          // Calculate profit margin
          const grossProfit = finalPriceExclGST - recipeCost;
          const margin = finalPriceExclGST > 0 ? (grossProfit / finalPriceExclGST) * 100 : 0;
          profitMargins.push(margin);
        }
      }
    }

    const averageProfitMargin =
      profitMargins.length > 0
        ? profitMargins.reduce((sum, margin) => sum + margin, 0) / profitMargins.length
        : 0;
    const foodCostPercent = totalRevenue > 0 ? (totalCOGS / totalRevenue) * 100 : 0;
    const grossProfit = totalRevenue - totalCOGS;

    return NextResponse.json({
      success: true,
      statistics: {
        total_items: menuItems.length,
        total_dishes: dishCount,
        total_recipes: recipeCount,
        total_cogs: totalCOGS,
        total_revenue: totalRevenue,
        gross_profit: grossProfit,
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
