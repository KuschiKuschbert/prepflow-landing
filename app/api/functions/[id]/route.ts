import { ApiErrorHandler } from '@/lib/api-error-handler';
import { getAuthenticatedUser } from '@/lib/server/get-authenticated-user';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { updateFunctionSchema } from '../helpers/schemas';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { userId, supabase } = await getAuthenticatedUser(req);

    const { data: appFunction, error } = await supabase
      .from('functions')
      .select(
        `
        *,
        customers (
          first_name,
          last_name,
          company,
          phone,
          email
        ),
        function_runsheet_items (
           id,
           day_number,
           item_time,
           description,
           item_type,
           menu_id,
           dish_id,
           recipe_id,
           position,
           menus ( id, menu_name, menu_type ),
           dishes ( id, dish_name, selling_price, is_vegetarian, is_vegan, allergens ),
           recipes ( id, recipe_name, is_vegetarian, is_vegan, allergens )
        )
      `,
      )
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      logger.error('Error fetching function:', { error });
      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status ?? 500 });
    }

    if (!appFunction) {
      return NextResponse.json(
        ApiErrorHandler.createError('Function not found', 'NOT_FOUND', 404),
        { status: 404 },
      );
    }

    const runsheetItems = (appFunction.function_runsheet_items || []).sort(
      (a: { day_number: number; position: number }, b: { day_number: number; position: number }) =>
        a.day_number - b.day_number || a.position - b.position,
    );

    const effectiveEnd = appFunction.end_date || appFunction.start_date;
    const effectiveStart = appFunction.start_date;

    const { count: conflictingCount, error: conflictError } = await supabase
      .from('functions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .neq('id', id)
      .lte('start_date', effectiveEnd)
      .gte('end_date', effectiveStart);

    if (conflictError) {
      logger.warn('Failed to count conflicting functions', { error: conflictError });
    }

    return NextResponse.json({
      function: appFunction,
      runsheetItems,
      conflictingCount: typeof conflictingCount === 'number' ? conflictingCount : 0,
    });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    logger.error(`Error in GET /api/functions/[id]:`, { error });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { userId, supabase } = await getAuthenticatedUser(req);

    const body = await req.json();
    const result = updateFunctionSchema.safeParse(body);
    if (!result.success) {
      const issues = result.error.issues;
      logger.warn('Function PATCH validation failed', {
        body: JSON.stringify(body),
        issues: issues.map(i => ({ path: i.path.join('.'), message: i.message })),
      });
      return NextResponse.json(
        {
          error: 'Invalid data',
          details: issues,
          hint: issues[0]
            ? `${issues[0].path.join('.')}: ${issues[0].message}`
            : 'Check the details array for validation errors',
        },
        { status: 400 },
      );
    }
    const validatedData = result.data;

    const updateData: Record<string, unknown> = { ...validatedData };
    if (validatedData.same_day && validatedData.start_date) {
      updateData.end_date = validatedData.start_date;
    }

    const { data: updatedFunction, error } = await supabase
      .from('functions')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      logger.error('Error updating function:', { error });
      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status ?? 500 });
    }

    if (!updatedFunction) {
      return NextResponse.json(
        ApiErrorHandler.createError('Function not found', 'NOT_FOUND', 404),
        { status: 404 },
      );
    }

    return NextResponse.json(updatedFunction);
  } catch (error) {
    if (error instanceof NextResponse) return error;
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: (error as z.ZodError).issues },
        { status: 400 },
      );
    }
    logger.error(`Error in PATCH /api/functions/[id]:`, { error });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { userId, supabase } = await getAuthenticatedUser(req);

    const { error } = await supabase.from('functions').delete().eq('id', id).eq('user_id', userId);

    if (error) {
      logger.error('Error deleting function:', { error });
      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status ?? 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    logger.error(`Error in DELETE /api/functions/[id]:`, { error });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
