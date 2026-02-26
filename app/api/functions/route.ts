import { ApiErrorHandler } from '@/lib/api-error-handler';
import { getAuthenticatedUser } from '@/lib/server/get-authenticated-user';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createFunctionSchema } from './helpers/schemas';

export async function GET(req: NextRequest) {
  try {
    const { userId, supabase } = await getAuthenticatedUser(req);

    const { searchParams } = new URL(req.url);
    const start_date_from = searchParams.get('start_date_from');

    let query = supabase
      .from('functions')
      .select(
        `
        *,
        customers (
          first_name,
          last_name,
          company
        )
      `,
      )
      .eq('user_id', userId)
      .order('start_date', { ascending: true });

    if (start_date_from) {
      query = query.gte('start_date', start_date_from);
    }

    const { data: functions, error } = await query;

    if (error) {
      logger.error('[Functions] Error fetching functions:', { error });
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to fetch functions', 'FETCH_ERROR', 500),
        { status: 500 },
      );
    }

    return NextResponse.json(functions);
  } catch (error) {
    if (error instanceof NextResponse) return error;
    logger.error('[Functions] GET error:', { error });
    return NextResponse.json(
      ApiErrorHandler.createError('Internal Server Error', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, supabase } = await getAuthenticatedUser(req);

    const body = await req.json();
    const validatedData = createFunctionSchema.parse(body);

    const insertData: Record<string, unknown> = {
      ...validatedData,
      user_id: userId,
    };

    if (validatedData.same_day) {
      insertData.end_date = validatedData.start_date;
    }

    const { data: newFunction, error: funcError } = await supabase
      .from('functions')
      .insert([insertData])
      .select()
      .single();

    if (funcError || !newFunction) {
      logger.error('[Functions] Error creating function:', { error: funcError });
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to create function', 'CREATE_ERROR', 500),
        { status: 500 },
      );
    }

    return NextResponse.json(newFunction, { status: 201 });
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
    logger.error('[Functions] POST error:', { error });
    return NextResponse.json(
      ApiErrorHandler.createError('Internal Server Error', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}
