import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const recipeId = params?.id;
    if (!recipeId) {
      return NextResponse.json({ error: 'Missing recipe id' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }

    const { data, error } = await supabaseAdmin
      .from('recipe_ingredients')
      .select(
        `
        id,
        recipe_id,
        ingredient_id,
        quantity,
        unit,
        ingredients (
          id,
          ingredient_name,
          name,
          unit,
          cost_per_unit,
          trim_peel_waste_percentage,
          yield_percentage,
          category,
          supplier_name
        )
      `,
      )
      .eq('recipe_id', recipeId);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch ingredients', details: error.message },
        { status: 500 },
      );
    }

    const items = (data || []).map((row: any) => {
      const ing = row.ingredients || {};
      const normalized = {
        id: row.id,
        recipe_id: row.recipe_id,
        ingredient_id: row.ingredient_id,
        quantity: row.quantity,
        unit: row.unit,
        ingredients: {
          id: ing.id,
          ingredient_name: ing.ingredient_name || ing.name, // normalize field
          cost_per_unit: ing.cost_per_unit,
          unit: ing.unit,
          trim_peel_waste_percentage: ing.trim_peel_waste_percentage,
          yield_percentage: ing.yield_percentage,
          category: ing.category,
          supplier_name: ing.supplier_name,
        },
      };
      return normalized;
    });

    return NextResponse.json({ items });
  } catch (e: any) {
    return NextResponse.json(
      { error: 'Unexpected error', details: e?.message || String(e) },
      { status: 500 },
    );
  }
}
