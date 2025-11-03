import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { CANONICAL_RECIPES } from '@/lib/seed/recipes';
import { generateDeterministicId } from '@/lib/seed/helpers';

export async function GET(request: NextRequest) {
  try {
    const cookieDemo = request.cookies.get('pf_demo')?.value === '1';
    const demoMode =
      cookieDemo || process.env.NEXT_PUBLIC_DEMO_MODE === '1' || process.env.DEMO_MODE === '1';

    if (demoMode) {
      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get('page') || '1');
      const pageSize = Math.min(parseInt(searchParams.get('pageSize') || '50'), 100);
      const start = (page - 1) * pageSize;
      const end = start + pageSize;

      const mapped = CANONICAL_RECIPES.map(r => ({
        id: generateDeterministicId('recipe', r.key),
        name: r.name,
        description: r.description,
        yield: r.yield,
        yield_unit: r.yieldUnit,
        instructions: r.instructions,
        total_cost: null,
        cost_per_serving: null,
      }));
      const slice = mapped.slice(start, end);
      return NextResponse.json({
        success: true,
        recipes: slice,
        count: mapped.length,
        page,
        pageSize,
      });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') || '50'), 100);
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    const {
      data: recipes,
      error,
      count,
    } = await supabaseAdmin
      .from('recipes')
      .select('*', { count: 'exact' })
      .order('name')
      .range(start, end);

    if (error) {
      console.error('Error fetching recipes:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      recipes: recipes || [],
      count: count || 0,
      page,
      pageSize,
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
