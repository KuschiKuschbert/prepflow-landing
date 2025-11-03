import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }
  const adminKey = request.headers.get('x-admin-key');
  if (!adminKey || adminKey !== process.env.SEED_ADMIN_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
  }

  // Recipes without any recipe_ingredients
  const { data: recipes, error: recipesError } = await supabaseAdmin.from('recipes').select('id');
  if (recipesError) {
    return NextResponse.json({ error: recipesError.message }, { status: 500 });
  }

  const recipeIds = (recipes || []).map(r => r.id);
  let recipesWithNoLines = 0;
  if (recipeIds.length > 0) {
    const { data: counts, error: countErr } = await supabaseAdmin
      .from('recipe_ingredients')
      .select('recipe_id');
    if (countErr) {
      return NextResponse.json({ error: countErr.message }, { status: 500 });
    }
    const withLines = new Set((counts || []).map(r => r.recipe_id));
    recipesWithNoLines = recipeIds.filter(id => !withLines.has(id)).length;
  }

  // Recipe ingredient rows with missing ingredient reference
  const { data: riRows, error: riErr } = await supabaseAdmin
    .from('recipe_ingredients')
    .select('ingredient_id');
  if (riErr) {
    return NextResponse.json({ error: riErr.message }, { status: 500 });
  }
  const uniqueIngIds = Array.from(
    new Set((riRows || []).map(r => r.ingredient_id).filter(Boolean)),
  );
  let missingIngredientRefs = 0;
  if (uniqueIngIds.length > 0) {
    const { data: ingRows, error: ingErr } = await supabaseAdmin
      .from('ingredients')
      .select('id')
      .in('id', uniqueIngIds);
    if (ingErr) {
      return NextResponse.json({ error: ingErr.message }, { status: 500 });
    }
    const present = new Set((ingRows || []).map(r => r.id));
    missingIngredientRefs = uniqueIngIds.filter(id => !present.has(id)).length;
  }

  return NextResponse.json({
    success: true,
    stats: {
      totalRecipes: recipeIds.length,
      recipesWithNoLines,
      uniqueIngredientIdsInLines: uniqueIngIds.length,
      missingIngredientRefs,
    },
  });
}
