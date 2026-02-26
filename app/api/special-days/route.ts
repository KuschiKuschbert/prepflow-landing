import { ApiErrorHandler } from '@/lib/api-error-handler';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createSpecialDaySchema } from './helpers/schemas';

export async function GET(req: Request) {
  try {
    const user = await requireAuth(req as NextRequest);
    const supabaseUserId = user.sub;

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('start');
    const endDate = searchParams.get('end');

    const supabase = createSupabaseAdmin();
    let query = supabase
      .from('special_days')
      .select('*')
      .eq('user_id', supabaseUserId)
      .order('date', { ascending: true });

    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }

    const { data: specialDays, error } = await query;

    if (error) {
      logger.error('[Special Days] Error fetching:', { error });
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to fetch special days', 'FETCH_ERROR', 500),
        { status: 500 },
      );
    }

    return NextResponse.json(specialDays);
  } catch (error) {
    logger.error('[Special Days] GET error:', { error });
    return NextResponse.json(
      ApiErrorHandler.createError('Internal Server Error', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireAuth(req as NextRequest);
    const supabaseUserId = user.sub;

    const body = await req.json();
    const validatedData = createSpecialDaySchema.parse(body);

    const supabase = createSupabaseAdmin();
    const { data: specialDay, error } = await supabase
      .from('special_days')
      .insert([
        {
          ...validatedData,
          user_id: supabaseUserId,
        },
      ])
      .select()
      .single();

    if (error) {
      logger.error('[Special Days] Error creating:', { error });
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to create special day', 'CREATE_ERROR', 500),
        { status: 500 },
      );
    }

    return NextResponse.json(specialDay, { status: 201 });
  } catch (error) {
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
    logger.error('[Special Days] POST error:', { error });
    return NextResponse.json(
      ApiErrorHandler.createError('Internal Server Error', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}
