import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  // Guard: dev-only and admin key required
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Reset is disabled in production' }, { status: 403 });
  }

  const adminKeyHeader = request.headers.get('x-admin-key');
  const adminKeyEnv = process.env.SEED_ADMIN_KEY;
  if (!adminKeyEnv || adminKeyHeader !== adminKeyEnv) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const dryRun = request.nextUrl.searchParams.get('dry') === '1';

  const supabase = createSupabaseAdmin();

  // FK-safe delete order
  const tablesInOrder = [
    'sales_data',
    'menu_items',
    'menu_dishes',
    'dish_ingredients',
    'dish_recipes',
    'dishes',
    'menus',
    'recipe_ingredients',
    'recipes',
    'ingredients',
  ];

  if (dryRun) {
    return NextResponse.json({ success: true, dryRun: true, tables: tablesInOrder });
  }

  const results: { table: string; error?: string }[] = [];

  for (const table of tablesInOrder) {
    const { error } = await supabase.from(table).delete().neq('id', null);
    if (error) {
      results.push({ table, error: error.message });
      // Stop early if a dependent delete fails
      return NextResponse.json({ error: 'Reset failed', details: results }, { status: 500 });
    }
    results.push({ table });
  }

  return NextResponse.json({ success: true, tables: results });
}
