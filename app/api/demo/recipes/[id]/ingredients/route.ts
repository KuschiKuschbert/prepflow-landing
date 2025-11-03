import { NextRequest, NextResponse } from 'next/server';
import { CANONICAL_RECIPES } from '@/lib/seed/recipes';
import { generateDeterministicId, normalizeIngredientName } from '@/lib/seed/helpers';

// Demo-only endpoint: deterministic ingredients for a demo recipe ID
export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const isDev = process.env.NODE_ENV !== 'production';
  const allowHeader = _req.headers.get('x-allow-demo') === '1';
  if (!isDev && !allowHeader) {
    return NextResponse.json({ error: 'Demo API not available' }, { status: 403 });
  }

  const { id } = await context.params;
  const recipeId = id;
  if (!recipeId) {
    return NextResponse.json({ error: 'Missing recipe id' }, { status: 400 });
  }

  const recipe = CANONICAL_RECIPES.find(r => generateDeterministicId('recipe', r.key) === recipeId);
  if (!recipe) {
    return NextResponse.json({ items: [] });
  }

  const items = recipe.lines.map((l, idx) => {
    const ingredientName = normalizeIngredientName(l.ingredientName);
    const ingId = generateDeterministicId('ingredient', ingredientName.toLowerCase());
    const rowId = generateDeterministicId('ri', `${recipe.key}:${idx}`);
    return {
      id: rowId,
      recipe_id: recipeId,
      ingredient_id: ingId,
      quantity: l.quantity,
      unit: l.unit,
      ingredients: {
        id: ingId,
        ingredient_name: ingredientName,
        cost_per_unit: 0.01,
        unit: l.unit === 'PC' ? 'PC' : l.unit,
        trim_peel_waste_percentage: 0,
        yield_percentage: 100,
        category: null,
        supplier_name: null,
      },
    };
  });
  return NextResponse.json({ items });
}
