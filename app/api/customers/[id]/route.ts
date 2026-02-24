import { ApiErrorHandler } from '@/lib/api-error-handler';
import { getAuthenticatedUser } from '@/lib/server/get-authenticated-user';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { updateCustomerSchema } from '../helpers/schemas';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { userId, supabase } = await getAuthenticatedUser(req);

    const { data: customer, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      logger.error('[Customers API] Error fetching customer:', { error: error.message });
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to fetch customer', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    if (!customer) {
      return NextResponse.json(
        ApiErrorHandler.createError('Customer not found', 'NOT_FOUND', 404),
        { status: 404 },
      );
    }

    return NextResponse.json(customer);
  } catch (error) {
    if (error instanceof NextResponse) return error;
    logger.error('[Customers API] GET error:', { error });
    return NextResponse.json(
      ApiErrorHandler.createError('Internal Server Error', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { userId, supabase } = await getAuthenticatedUser(req);

    const body = await req.json();
    const validatedData = updateCustomerSchema.parse(body);

    const { data: customer, error } = await supabase
      .from('customers')
      .update(validatedData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      logger.error('[Customers API] Error updating customer:', { error: error.message });
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to update customer', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    if (!customer) {
      return NextResponse.json(
        ApiErrorHandler.createError('Customer not found', 'NOT_FOUND', 404),
        { status: 404 },
      );
    }

    return NextResponse.json(customer);
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
    logger.error('[Customers API] PATCH error:', { error });
    return NextResponse.json(
      ApiErrorHandler.createError('Internal Server Error', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { userId, supabase } = await getAuthenticatedUser(req);

    const { error } = await supabase.from('customers').delete().eq('id', id).eq('user_id', userId);

    if (error) {
      logger.error('[Customers API] Error deleting customer:', { error: error.message });
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to delete customer', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    logger.error('[Customers API] DELETE error:', { error });
    return NextResponse.json(
      ApiErrorHandler.createError('Internal Server Error', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}
