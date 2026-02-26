import { ApiErrorHandler } from '@/lib/api-error-handler';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { updateSpecialDaySchema } from '../helpers/schemas';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await requireAuth(req as NextRequest);
    const supabaseUserId = user.sub;

    const body = await req.json();
    const validatedData = updateSpecialDaySchema.parse(body);

    const supabase = createSupabaseAdmin();
    const { data: updatedDay, error } = await supabase
      .from('special_days')
      .update(validatedData)
      .eq('id', id)
      .eq('user_id', supabaseUserId)
      .select()
      .single();

    if (error) {
      logger.error('Error updating special day:', error);
      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status ?? 500 });
    }

    if (!updatedDay) {
      return NextResponse.json(
        ApiErrorHandler.createError('Special day not found', 'NOT_FOUND', 404),
        { status: 404 },
      );
    }

    return NextResponse.json(updatedDay);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: (error as z.ZodError).issues },
        { status: 400 },
      );
    }
    logger.error(`Error in PATCH /api/special-days/${(await params).id}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await requireAuth(req as NextRequest);
    const supabaseUserId = user.sub;

    const supabase = createSupabaseAdmin();
    const { error } = await supabase
      .from('special_days')
      .delete()
      .eq('id', id)
      .eq('user_id', supabaseUserId);

    if (error) {
      logger.error('Error deleting special day:', error);
      const apiError = ApiErrorHandler.fromSupabaseError(error, 500);
      return NextResponse.json(apiError, { status: apiError.status ?? 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error(`Error in DELETE /api/special-days/${(await params).id}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
