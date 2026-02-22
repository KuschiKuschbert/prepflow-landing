import { getAuthenticatedUser } from '@/lib/server/get-authenticated-user';
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
      console.error('Error fetching customers:', error);
      return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
    }

    return NextResponse.json(customers);
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error('Error in GET /api/customers:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
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
      console.error('Error creating customer:', error);
      return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
    }

    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: (error as z.ZodError).issues },
        { status: 400 },
      );
    }
    console.error('Error in POST /api/customers:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
