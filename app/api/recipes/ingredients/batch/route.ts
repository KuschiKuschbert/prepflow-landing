import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { groupBy } from '@/lib/api/batch-utils';

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }

    const body = await request.json();
    const { recipeIds } = body;

    if (!Array.isArray(recipeIds) || recipeIds.length === 0) {
      return NextResponse.json({ error: 'recipeIds must be a non-empty array' }, { status: 400 });
    }

    // Normalize recipe IDs
    const normalizedIds = recipeIds.map(id => String(id).trim()).filter(Boolean);

    if (normalizedIds.length === 0) {
      return NextResponse.json({ items: [] });
    }

    // Fetch all recipe ingredients in a single query
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
          unit,
          cost_per_unit,
          trim_peel_waste_percentage,
          yield_percentage
        )
      `,
      )
      .in('recipe_id', normalizedIds);

    if (error) {
      console.error('[batch ingredients] Error fetching recipe ingredients:', error);
      return NextResponse.json(
        { error: 'Failed to fetch ingredients', details: error.message },
        { status: 500 },
      );
    }

    // If no data, return empty grouped results
    if (!data || data.length === 0) {
      const grouped: Record<string, any[]> = {};
      normalizedIds.forEach(id => {
        grouped[id] = [];
      });
      return NextResponse.json({ items: grouped });
    }

    // Server-side fallback: if nested ingredients join is missing/null for some rows,
    // do a bulk lookup from ingredients and merge to ensure uniform shape
    let rows: any[] = data;
    const missingNested = rows.some(r => !r.ingredients);
    if (missingNested) {
      const uniqueIds = Array.from(
        new Set(rows.map(r => r.ingredient_id).filter((v: any) => Boolean(v))),
      );
      if (uniqueIds.length > 0) {
        const { data: ingRows, error: ingError } = await supabaseAdmin
          .from('ingredients')
          .select(
            'id, ingredient_name, cost_per_unit, unit, trim_peel_waste_percentage, yield_percentage',
          )
          .in('id', uniqueIds);
        if (!ingError && ingRows) {
          const byId: Record<string, any> = {};
          ingRows.forEach(ir => {
            byId[ir.id] = ir;
          });
          rows = rows.map(r => ({ ...r, ingredients: r.ingredients || byId[r.ingredient_id] }));
        }
      }
    }

    // Normalize and format items
    const items = rows.map((row: any) => {
      const ing = row.ingredients || {};
      return {
        id: row.id,
        recipe_id: row.recipe_id,
        ingredient_id: row.ingredient_id,
        quantity: row.quantity,
        unit: row.unit,
        ingredients: {
          id: ing.id,
          // Use ingredient_name as the canonical field
          ingredient_name: ing.ingredient_name || 'Unknown',
          cost_per_unit: ing.cost_per_unit,
          unit: ing.unit || row.unit || null,
          trim_peel_waste_percentage: ing.trim_peel_waste_percentage,
          yield_percentage: ing.yield_percentage,
        },
      };
    });

    // Group by recipe_id
    const grouped = groupBy(items, item => item.recipe_id);

    // Ensure all requested recipe IDs are in the response (even if empty)
    normalizedIds.forEach(id => {
      if (!grouped[id]) {
        grouped[id] = [];
      }
    });

    return NextResponse.json({ items: grouped });
  } catch (e: any) {
    console.error('[batch ingredients] Unexpected error:', e);
    return NextResponse.json(
      { error: 'Unexpected error', details: e?.message || String(e) },
      { status: 500 },
    );
  }
}
