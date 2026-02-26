import { ApiErrorHandler } from '@/lib/api-error-handler';
import { getAuthenticatedUser } from '@/lib/server/get-authenticated-user';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { updateRunsheetItemSchema } from '../../../helpers/schemas';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> },
) {
  try {
    const { id, itemId } = await params;
    const { userId, supabase } = await getAuthenticatedUser(req);

    const { data: func, error: funcError } = await supabase
      .from('functions')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (funcError) {
      logger.error('Error fetching function for runsheet PATCH', { error: funcError });
      const apiError = ApiErrorHandler.fromSupabaseError(funcError, 500);
      return NextResponse.json(apiError, { status: apiError.status ?? 500 });
    }
    if (!func) {
      return NextResponse.json(
        ApiErrorHandler.createError('Function not found', 'NOT_FOUND', 404),
        { status: 404 },
      );
    }

    const body = await req.json();
    const validatedData = updateRunsheetItemSchema.parse(body);

    const { data: updatedItem, error } = await supabase
      .from('function_runsheet_items')
      .update(validatedData)
      .eq('id', itemId)
      .eq('function_id', id)
      .select(
        `
        *,
        menus ( id, menu_name, menu_type ),
        dishes ( id, dish_name, selling_price, is_vegetarian, is_vegan, allergens ),
        recipes ( id, recipe_name, is_vegetarian, is_vegan, allergens )
      `,
      )
      .single();

    if (error) {
      logger.error('Error updating runsheet item:', { error });
      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status ?? 500 });
    }

    if (!updatedItem) {
      return NextResponse.json(
        ApiErrorHandler.createError('Runsheet item not found', 'NOT_FOUND', 404),
        { status: 404 },
      );
    }

    return NextResponse.json(updatedItem);
  } catch (error) {
    if (error instanceof NextResponse) return error;
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: (error as z.ZodError).issues },
        { status: 400 },
      );
    }
    logger.error('Error in PATCH /api/functions/[id]/runsheet/[itemId]:', { error });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> },
) {
  try {
    const { id, itemId } = await params;
    const { userId, supabase } = await getAuthenticatedUser(req);

    const { data: func, error: funcError } = await supabase
      .from('functions')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (funcError) {
      logger.error('Error fetching function for runsheet DELETE', { error: funcError });
      const apiError = ApiErrorHandler.fromSupabaseError(funcError, 500);
      return NextResponse.json(apiError, { status: apiError.status ?? 500 });
    }
    if (!func) {
      return NextResponse.json(
        ApiErrorHandler.createError('Function not found', 'NOT_FOUND', 404),
        { status: 404 },
      );
    }

    const { error } = await supabase
      .from('function_runsheet_items')
      .delete()
      .eq('id', itemId)
      .eq('function_id', id);

    if (error) {
      logger.error('Error deleting runsheet item:', { error });
      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status ?? 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    logger.error('Error in DELETE /api/functions/[id]/runsheet/[itemId]:', { error });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
