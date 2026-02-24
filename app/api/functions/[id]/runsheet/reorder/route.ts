import { ApiErrorHandler } from '@/lib/api-error-handler';
import { getAuthenticatedUser } from '@/lib/server/get-authenticated-user';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { reorderRunsheetSchema } from '../../../helpers/schemas';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { userId, supabase } = await getAuthenticatedUser(req);

    const { data: func } = await supabase
      .from('functions')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (!func) {
      return NextResponse.json(
        ApiErrorHandler.createError('Function not found', 'NOT_FOUND', 404),
        { status: 404 },
      );
    }

    const body = await req.json();
    const { items } = reorderRunsheetSchema.parse(body);

    const updates = items.map(item =>
      supabase
        .from('function_runsheet_items')
        .update({ position: item.position })
        .eq('id', item.id)
        .eq('function_id', id),
    );

    const results = await Promise.all(updates);
    const errors = results.filter(r => r.error);

    if (errors.length > 0) {
      logger.error('Error reordering runsheet items:', { errors: errors.map(e => e.error) });
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to reorder some items', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Invalid data',
          'VALIDATION_ERROR',
          400,
          (error as z.ZodError).issues,
        ),
        { status: 400 },
      );
    }
    logger.error('Error in POST /api/functions/[id]/runsheet/reorder:', { error });
    return NextResponse.json(
      ApiErrorHandler.createError('Internal Server Error', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}
