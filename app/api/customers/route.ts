import { ApiErrorHandler } from '@/lib/api-error-handler';
import { getAuthenticatedUser } from '@/lib/server/get-authenticated-user';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createCustomerSchema } from './helpers/schemas';

export async function GET(req: NextRequest) {
  try {
    const { userId, supabase } = await getAuthenticatedUser(req);

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');

    let query = supabase
      .from('customers')
      .select('*')
      .eq('user_id', userId)
      .order('first_name', { ascending: true });

    if (search) {
      query = query.or(
        `first_name.ilike.%${search}%,last_name.ilike.%${search}%,company.ilike.%${search}%`,
      );
    }

    const { data: customers, error } = await query;

    if (error) {
      logger.error('[Customers API] Error fetching customers:', { error: error.message });
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to fetch customers', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    return NextResponse.json(customers);
  } catch (error) {
    if (error instanceof NextResponse) return error;
    logger.error('[Customers API] GET error:', { error });
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
    const validatedData = createCustomerSchema.parse(body);

    const { data: customer, error } = await supabase
      .from('customers')
      .insert([
        {
          ...validatedData,
          user_id: userId,
        },
      ])
      .select()
      .single();

    if (error) {
      logger.error('[Customers API] Error creating customer:', { error: error.message });
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to create customer', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    return NextResponse.json(customer, { status: 201 });
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
    logger.error('[Customers API] POST error:', { error });
    return NextResponse.json(
      ApiErrorHandler.createError('Internal Server Error', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}
