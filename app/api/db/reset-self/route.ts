import { requireAuth } from '@/lib/auth0-api-helpers';
import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { deleteByUser } from './helpers/deleteByUser';
import { getUserTableIds } from './helpers/getUserTableIds';
import { handleGlobalWipe } from './helpers/handleGlobalWipe';
import { performDeleteIn } from './helpers/performDeleteIn';

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { getAppError } from '@/lib/utils/error';
import { z } from 'zod';

const resetSelfSchema = z.object({
  userId: z.string().optional(),
  all: z.boolean().optional(),
});
type DeleteSummary = {
  dryRun: boolean;
  reseeded: boolean;
  deletedCountsByTable: Record<string, number>;
};

export async function POST(request: NextRequest) {
  try {
    const _user = await requireAuth(request);
  } catch (error) {
    logger.error('[route.ts] Error in catch block:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    if (error instanceof NextResponse) {
      return error;
    }
    return NextResponse.json(ApiErrorHandler.createError('Unauthorized', 'UNAUTHORIZED', 401), {
      status: 401,
    });
  }

  const user = await requireAuth(request);

  const supabase = createSupabaseAdmin();

  const dryRun = request.nextUrl.searchParams.get('dry') === '1';
  let body: unknown = {};
  try {
    body = await request.json();
  } catch (err) {
    logger.warn('[DB Reset Self] Failed to parse request body:', {
      error: err instanceof Error ? err.message : String(err),
    });
    // Continue with empty body - dry run can proceed
  }

  const validationResult = resetSelfSchema.safeParse(body);
  if (!validationResult.success && Object.keys(body as Record<string, unknown>).length > 0) {
    return NextResponse.json(
      ApiErrorHandler.createError(
        validationResult.error.issues[0]?.message || 'Invalid request body',
        'VALIDATION_ERROR',
        400,
      ),
      { status: 400 },
    );
  }

  const validatedBody = validationResult.success ? validationResult.data : {};
  const userId = (validatedBody.userId as string) || '';
  const wipeAll = validatedBody.all === true;

  logger.info('Reset request:', { userId, wipeAll, dryRun, hasUser: !!user });

  if (!wipeAll && !userId) {
    return NextResponse.json(
      { error: 'Missing userId', message: 'userId is required in body' },
      { status: 400 },
    );
  }

  // If wiping everything, delegate to centralized cleaner (FK-safe order across domain tables)
  if (!dryRun && wipeAll) {
    try {
      const payload = await handleGlobalWipe(supabase);
      return NextResponse.json({ success: true, ...payload });
    } catch (e: unknown) {
      const appError = getAppError(e);
      logger.error('❌ Global reset failed:', {
        error: appError.message,
        stack: appError.originalError instanceof Error ? appError.originalError.stack : undefined,
      });
      return NextResponse.json(
        { error: 'Global reset failed', message: appError.message },
        { status: 500 },
      );
    }
  }

  // Determine counts for dry-run
  const deletedCountsByTable: Record<string, number> = {};

  // Parent tables with user_id
  const parentTables = ['order_lists', 'prep_lists', 'recipe_shares', 'ai_specials_ingredients'];
  // Child tables referencing parents (no user_id on child rows)
  const _childSpecs: Array<{
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
  const orderListIds = await getUserTableIds(supabase, 'order_lists', 'id', userId);
  const prepListIds = await getUserTableIds(supabase, 'prep_lists', 'id', userId);

  try {
    // Child tables first
    const childPlans: Array<Promise<number>> = [];
    childPlans.push(
      performDeleteIn(supabase, 'order_list_items', 'order_list_id', orderListIds, dryRun),
    );
    childPlans.push(
      performDeleteIn(supabase, 'prep_list_items', 'prep_list_id', prepListIds, dryRun),
    );
    const childResults = await Promise.all(childPlans);
    deletedCountsByTable['order_list_items'] = childResults[0] || 0;
    deletedCountsByTable['prep_list_items'] = childResults[1] || 0;

    // Parent tables
    for (const t of parentTables) {
      await deleteByUser(supabase, t, userId, dryRun, deletedCountsByTable);
    }

    const payload: DeleteSummary = {
      dryRun,
      reseeded: false,
      deletedCountsByTable,
    };

    return NextResponse.json({ success: true, ...payload });
  } catch (err) {
    logger.error('[Reset Self API] Reset failed:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/db/reset-self', userId },
    });
    return NextResponse.json(
      { error: 'Reset failed', message: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
