import { ApiErrorHandler } from '@/lib/api-error-handler';
import { getAuthenticatedUser } from '@/lib/server/get-authenticated-user';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createRunsheetItemSchema } from '../../helpers/schemas';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const { searchParams } = new URL(req.url);
    const dayNumber = searchParams.get('day');

    let query = supabase
      .from('function_runsheet_items')
      .select(
        `
        *,
        menus ( id, menu_name, menu_type ),
        dishes ( id, dish_name, selling_price, is_vegetarian, is_vegan, allergens ),
        recipes ( id, recipe_name, is_vegetarian, is_vegan, allergens )
      `,
      )
      .eq('function_id', id)
      .order('day_number', { ascending: true })
      .order('position', { ascending: true });

    if (dayNumber) {
      query = query.eq('day_number', parseInt(dayNumber));
    }

    const { data: items, error } = await query;

    if (error) {
      logger.error('[Functions Runsheet] Error fetching items:', { error });
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to fetch runsheet items', 'FETCH_ERROR', 500),
        { status: 500 },
      );
    }

    return NextResponse.json(items);
  } catch (error) {
    if (error instanceof NextResponse) return error;
    logger.error('[Functions Runsheet] GET error:', { error });
    return NextResponse.json(
      ApiErrorHandler.createError('Internal Server Error', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}

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
    const validatedData = createRunsheetItemSchema.parse(body);

    const { data: newItem, error } = await supabase
      .from('function_runsheet_items')
      .insert([{ ...validatedData, function_id: id }])
      .select(
        `
        *,
        menus ( id, menu_name, menu_type ),
        dishes ( id, dish_name, selling_price, is_vegetarian, is_vegan, allergens ),
        recipes ( id, recipe_name, is_vegetarian, is_vegan, allergens )
      `,
      )
      .single();

    if (error || !newItem) {
      logger.error('[Functions Runsheet] Error creating item:', { error });
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to create runsheet item', 'CREATE_ERROR', 500),
        { status: 500 },
      );
    }

    return NextResponse.json(newItem, { status: 201 });
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
    logger.error('[Functions Runsheet] POST error:', { error });
    return NextResponse.json(
      ApiErrorHandler.createError('Internal Server Error', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}
