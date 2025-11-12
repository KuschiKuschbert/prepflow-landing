import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') || '50'), 100);
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    const {
      data: dishes,
      error,
      count,
    } = await supabaseAdmin
      .from('dishes')
      .select('*', { count: 'exact' })
      .order('dish_name')
      .range(start, end);

    if (error) {
      console.error('Error fetching dishes:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      dishes: dishes || [],
      count: count || 0,
      page,
      pageSize,
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { dish_name, description, selling_price, recipes, ingredients } = body;

    if (!dish_name || !selling_price) {
      return NextResponse.json(
        { error: 'Missing required fields', message: 'Dish name and selling price are required' },
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }

    // Validate that at least one recipe or ingredient is provided
    if ((!recipes || recipes.length === 0) && (!ingredients || ingredients.length === 0)) {
      return NextResponse.json(
        { error: 'Invalid dish', message: 'Dish must contain at least one recipe or ingredient' },
        { status: 400 },
      );
    }

    // Create the dish
    const { data: newDish, error: createError } = await supabaseAdmin
      .from('dishes')
      .insert({
        dish_name: dish_name.trim(),
        description: description?.trim() || null,
        selling_price: parseFloat(selling_price),
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating dish:', createError);
      return NextResponse.json({ error: createError.message }, { status: 500 });
    }

    // Add recipes if provided
    if (recipes && recipes.length > 0) {
      const dishRecipes = recipes.map((r: { recipe_id: string; quantity?: number }) => ({
        dish_id: newDish.id,
        recipe_id: r.recipe_id,
        quantity: r.quantity || 1,
      }));

      const { error: recipesError } = await supabaseAdmin.from('dish_recipes').insert(dishRecipes);

      if (recipesError) {
        console.error('Error adding recipes to dish:', recipesError);
        // Rollback dish creation
        await supabaseAdmin.from('dishes').delete().eq('id', newDish.id);
        return NextResponse.json({ error: recipesError.message }, { status: 500 });
      }
    }

    // Add ingredients if provided
    if (ingredients && ingredients.length > 0) {
      const dishIngredients = ingredients.map(
        (i: { ingredient_id: string; quantity: number; unit: string }) => ({
          dish_id: newDish.id,
          ingredient_id: i.ingredient_id,
          quantity: typeof i.quantity === 'string' ? parseFloat(i.quantity) : i.quantity,
          unit: i.unit,
        }),
      );

      const { error: ingredientsError } = await supabaseAdmin
        .from('dish_ingredients')
        .insert(dishIngredients);

      if (ingredientsError) {
        console.error('Error adding ingredients to dish:', ingredientsError);
        // Rollback dish creation
        await supabaseAdmin!.from('dishes').delete().eq('id', newDish.id);
        return NextResponse.json({ error: ingredientsError.message }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      dish: newDish,
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
