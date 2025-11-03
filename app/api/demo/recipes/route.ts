import { NextRequest, NextResponse } from 'next/server';
import { CANONICAL_RECIPES } from '@/lib/seed/recipes';
import { generateDeterministicId } from '@/lib/seed/helpers';

// Demo-only endpoint: intended for local testing. Returns deterministic recipes.
export async function GET(request: NextRequest) {
  // Only allow in development or when explicitly enabled via header to avoid prod exposure
  const isDev = process.env.NODE_ENV !== 'production';
  const allowHeader = request.headers.get('x-allow-demo') === '1';
  if (!isDev && !allowHeader) {
    return NextResponse.json({ error: 'Demo API not available' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = Math.min(parseInt(searchParams.get('pageSize') || '50'), 100);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const seen = new Set<string>();
  const mapped = CANONICAL_RECIPES.filter(r => {
    const k = r.name.toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  }).map(r => ({
    id: generateDeterministicId('recipe', r.key),
    name: r.name,
    description: r.description,
    yield: r.yield,
    yield_unit: r.yieldUnit,
    instructions: r.instructions,
    selling_price: r.sellingPrice ?? null,
    total_cost: null,
    cost_per_serving: null,
  }));
  const slice = mapped.slice(start, end);
  return NextResponse.json({ success: true, recipes: slice, count: mapped.length, page, pageSize });
}
