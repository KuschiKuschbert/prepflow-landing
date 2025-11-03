import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { createSupabaseAdmin } from '@/lib/supabase';

type DeleteSummary = {
  dryRun: boolean;
  reseeded: boolean;
  deletedCountsByTable: Record<string, number>;
};

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createSupabaseAdmin();

  const dryRun = request.nextUrl.searchParams.get('dry') === '1';
  let body: any = {};
  try {
    body = await request.json();
  } catch {}

  const userId = (body?.userId as string) || '';
  const reseed = body?.reseed !== false; // default true
  const password = (body?.password as string) || '';

  if (!userId) {
    return NextResponse.json(
      { error: 'Missing userId', message: 'userId is required in body' },
      { status: 400 },
    );
  }

  // Minimal password check (Auth0 re-auth is not available in this setup)
  if (!password || password.trim().length < 4) {
    return NextResponse.json(
      { error: 'Invalid password', message: 'Please enter your account password to confirm' },
      { status: 400 },
    );
  }

  // Collect IDs for child tables dependent on parent scoped by user_id
  const getIds = async (table: string, idColumn: string) => {
    const { data, error } = await supabase.from(table).select(`${idColumn}`).eq('user_id', userId);
    if (error) return [] as string[];
    return (data || []).map((r: any) => r[idColumn]) as string[];
  };

  // Determine counts for dry-run
  const deletedCountsByTable: Record<string, number> = {};

  // Parent tables with user_id
  const parentTables = ['order_lists', 'prep_lists', 'recipe_shares', 'ai_specials_ingredients'];
  // Child tables referencing parents (no user_id on child rows)
  const childSpecs: Array<{
    table: string;
    fk: string;
    parentTable: string;
    parentIdColumn: string;
  }> = [
    {
      table: 'order_list_items',
      fk: 'order_list_id',
      parentTable: 'order_lists',
      parentIdColumn: 'id',
    },
    {
      table: 'prep_list_items',
      fk: 'prep_list_id',
      parentTable: 'prep_lists',
      parentIdColumn: 'id',
    },
  ];

  // Compute parent IDs
  const orderListIds = await getIds('order_lists', 'id');
  const prepListIds = await getIds('prep_lists', 'id');

  // Count child deletions (dry-run) or execute
  const performDeleteIn = async (table: string, idColumn: string, ids: string[]) => {
    if (ids.length === 0) {
      return 0;
    }
    if (dryRun) {
      // Count matching rows
      const { count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
        .in(idColumn, ids);
      return count || 0;
    }
    const { error } = await supabase.from(table).delete().in(idColumn, ids);
    if (error) throw new Error(error.message);
    return ids.length; // best-effort summary (items count not returned precisely)
  };

  try {
    // Child tables first
    const childPlans: Array<Promise<number>> = [];
    childPlans.push(performDeleteIn('order_list_items', 'order_list_id', orderListIds));
    childPlans.push(performDeleteIn('prep_list_items', 'prep_list_id', prepListIds));
    const childResults = await Promise.all(childPlans);
    deletedCountsByTable['order_list_items'] = childResults[0] || 0;
    deletedCountsByTable['prep_list_items'] = childResults[1] || 0;

    // Parent tables and other user-owned tables
    const deleteByUser = async (table: string) => {
      if (dryRun) {
        const { count } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);
        deletedCountsByTable[table] = count || 0;
        return;
      }
      const { error } = await supabase.from(table).delete().eq('user_id', userId);
      if (error) throw new Error(error.message);
      // Count unknown after delete; set to 0 to indicate success without count
      deletedCountsByTable[table] = deletedCountsByTable[table] || 0;
    };

    // Parents
    for (const t of parentTables) {
      await deleteByUser(t);
    }

    // Optionally reseed minimal per-user samples
    let reseeded = false;
    if (!dryRun && reseed) {
      // Insert a tiny deterministic sample for this user in user-owned tables
      const now = new Date().toISOString();
      // Sample order list
      const { data: ol, error: olErr } = await supabase
        .from('order_lists')
        .insert({
          user_id: userId,
          supplier_id: null,
          name: 'Sample Order List',
          notes: 'Auto-seeded',
          status: 'draft',
          created_at: now,
          updated_at: now,
        })
        .select()
        .single();
      if (!olErr && ol?.id) {
        await supabase
          .from('order_list_items')
          .insert({
            order_list_id: ol.id,
            ingredient_id: null,
            quantity: 1,
            unit: 'EA',
            notes: 'Example item',
          });
      }

      // Sample prep list
      const { data: pl, error: plErr } = await supabase
        .from('prep_lists')
        .insert({
          user_id: userId,
          kitchen_section_id: null,
          name: 'Sample Prep List',
          notes: 'Auto-seeded',
          status: 'draft',
          created_at: now,
          updated_at: now,
        })
        .select()
        .single();
      if (!plErr && pl?.id) {
        await supabase
          .from('prep_list_items')
          .insert({
            prep_list_id: pl.id,
            ingredient_id: null,
            quantity: 1,
            unit: 'EA',
            notes: 'Example item',
          });
      }

      reseeded = true;
    }

    const payload: DeleteSummary = {
      dryRun,
      reseeded,
      deletedCountsByTable,
    };

    return NextResponse.json({ success: true, ...payload });
  } catch (err) {
    return NextResponse.json(
      { error: 'Reset failed', message: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
