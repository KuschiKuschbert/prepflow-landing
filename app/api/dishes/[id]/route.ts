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

    // Fetch dish with recipes and ingredients
    const { data: dish, error: dishError } = await supabaseAdmin
      .from('dishes')
      .select('*')
      .eq('id', dishId)
      .single();

    if (dishError || !dish) {
      return NextResponse.json({ error: 'Dish not found' }, { status: 404 });
    }

    // Fetch dish recipes
    const { data: dishRecipes, error: recipesError } = await supabaseAdmin
      .from('dish_recipes')
      .select(
        `
        id,
        recipe_id,
        quantity,
        recipes (
          id,
          name,
          description,
          yield,
          yield_unit
        )
      `,
      )
      .eq('dish_id', dishId);

    // Fetch dish ingredients
    const { data: dishIngredients, error: ingredientsError } = await supabaseAdmin
      .from('dish_ingredients')
      .select(
        `
        id,
        ingredient_id,
        quantity,
        unit,
        ingredients (
          id,
          ingredient_name,
          cost_per_unit,
          cost_per_unit_incl_trim,
          trim_peel_waste_percentage,
          yield_percentage,
          unit,
          supplier_name,
          category
        )
      `,
      )
      .eq('dish_id', dishId);

    return NextResponse.json({
      success: true,
      dish: {
        ...dish,
        recipes: dishRecipes || [],
        ingredients: dishIngredients || [],
      },
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const dishId = id;
    const body = await request.json();
    const { dish_name, description, selling_price, recipes, ingredients } = body;

    if (!dishId) {
      return NextResponse.json({ error: 'Missing dish id' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }

    // Update dish basic info
    const updateData: {
      dish_name?: string;
      description?: string | null;
      selling_price?: number;
    } = {};

    if (dish_name !== undefined) updateData.dish_name = dish_name.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (selling_price !== undefined) updateData.selling_price = parseFloat(selling_price);

    const { data: updatedDish, error: updateError } = await supabaseAdmin
      .from('dishes')
      .update(updateData)
      .eq('id', dishId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating dish:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Update recipes if provided
    if (recipes !== undefined) {
      // Delete existing recipes
      await supabaseAdmin.from('dish_recipes').delete().eq('dish_id', dishId);

      // Insert new recipes
      if (recipes.length > 0) {
        const dishRecipes = recipes.map((r: { recipe_id: string; quantity?: number }) => ({
          dish_id: dishId,
          recipe_id: r.recipe_id,
          quantity: r.quantity || 1,
        }));

        const { error: recipesError } = await supabaseAdmin
          .from('dish_recipes')
          .insert(dishRecipes);

        if (recipesError) {
          console.error('Error updating dish recipes:', recipesError);
          return NextResponse.json({ error: recipesError.message }, { status: 500 });
        }
      }
    }

    // Update ingredients if provided
    if (ingredients !== undefined) {
      // Delete existing ingredients
      await supabaseAdmin.from('dish_ingredients').delete().eq('dish_id', dishId);

      // Insert new ingredients
      if (ingredients.length > 0) {
        const dishIngredients = ingredients.map(
          (i: { ingredient_id: string; quantity: number; unit: string }) => ({
            dish_id: dishId,
            ingredient_id: i.ingredient_id,
            quantity: typeof i.quantity === 'string' ? parseFloat(i.quantity) : i.quantity,
            unit: i.unit,
          }),
        );

        const { error: ingredientsError } = await supabaseAdmin
          .from('dish_ingredients')
          .insert(dishIngredients);

        if (ingredientsError) {
          console.error('Error updating dish ingredients:', ingredientsError);
          return NextResponse.json({ error: ingredientsError.message }, { status: 500 });
        }
      }
    }

    return NextResponse.json({
      success: true,
      dish: updatedDish,
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

export async function DELETE(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const dishId = id;

    if (!dishId) {
      return NextResponse.json({ error: 'Missing dish id' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }

    // Delete dish (cascade will handle related records)
    const { error } = await supabaseAdmin.from('dishes').delete().eq('id', dishId);

    if (error) {
      console.error('Error deleting dish:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Dish deleted successfully',
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
