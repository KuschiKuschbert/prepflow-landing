import { getAuthenticatedUser } from '@/lib/server/get-authenticated-user';
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
      console.error('Error fetching customer:', error);
      return NextResponse.json({ error: 'Failed to fetch customer' }, { status: 500 });
    }

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    return NextResponse.json(customer);
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error(`Error in GET /api/customers/[id]:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
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
      console.error('Error updating customer:', error);
      return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
    }

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    return NextResponse.json(customer);
  } catch (error) {
    if (error instanceof NextResponse) return error;
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: (error as z.ZodError).issues },
        { status: 400 },
      );
    }
    console.error(`Error in PATCH /api/customers/[id]:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { userId, supabase } = await getAuthenticatedUser(req);

    const { error } = await supabase.from('customers').delete().eq('id', id).eq('user_id', userId);

    if (error) {
      console.error('Error deleting customer:', error);
      return NextResponse.json({ error: 'Failed to delete customer' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error(`Error in DELETE /api/customers/[id]:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
