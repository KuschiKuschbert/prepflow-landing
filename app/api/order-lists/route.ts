import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') || '50'), 100);
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    if (!userId) {
      return NextResponse.json(
        {
          error: 'User ID is required',
          message: 'Please provide a valid user ID',
        },
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          error: 'Database connection not available',
        },
        { status: 500 },
      );
    }

    const { data, error, count } = await supabaseAdmin
      .from('order_lists')
      .select(
        `
        *,
        suppliers (
          id,
          supplier_name,
          contact_person,
          phone,
          email
        ),
        order_list_items (
          id,
          ingredient_id,
          quantity,
          unit,
          notes,
          ingredients (
            id,
            ingredient_name,
            name,
            unit,
            category
          )
        )
      `,
        { count: 'exact' },
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(start, end);

    if (error) {
      console.error('Error fetching order lists:', error);
      return NextResponse.json(
        {
          error: 'Failed to fetch order lists',
          message: 'Could not retrieve order list data',
        },
        { status: 500 },
      );
    }

    // Normalize nested ingredient_name
    const items = (data || []).map((ol: any) => ({
      ...ol,
      suppliers: ol.suppliers
        ? { ...ol.suppliers, supplier_name: ol.suppliers.supplier_name || ol.suppliers.name }
        : null,
      order_list_items: (ol.order_list_items || []).map((it: any) => ({
        ...it,
        ingredients: it.ingredients
          ? {
              ...it.ingredients,
              ingredient_name: it.ingredients.ingredient_name || it.ingredients.name,
            }
          : null,
      })),
    }));

    return NextResponse.json({
      success: true,
      data: items,
      page,
      pageSize,
      total: count || 0,
    });
  } catch (error) {
    console.error('Order lists API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred',
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, supplierId, name, notes, items } = body;

    if (!userId || !supplierId || !name) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          message: 'User ID, supplier ID, and name are required',
        },
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          error: 'Database connection not available',
        },
        { status: 500 },
      );
    }

    // Create the order list
    const { data: orderList, error: orderError } = await supabaseAdmin
      .from('order_lists')
      .insert({
        user_id: userId,
        supplier_id: supplierId,
        name: name,
        notes: notes,
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order list:', orderError);
      return NextResponse.json(
        {
          error: 'Failed to create order list',
          message: 'Could not save order list data',
        },
        { status: 500 },
      );
    }

    // Add items if provided
    if (items && items.length > 0) {
      const orderItems = items.map((item: any) => ({
        order_list_id: orderList.id,
        ingredient_id: item.ingredientId,
        quantity: item.quantity,
        unit: item.unit,
        notes: item.notes,
      }));

      const { error: itemsError } = await supabaseAdmin.from('order_list_items').insert(orderItems);

      if (itemsError) {
        console.error('Error creating order list items:', itemsError);
        // Don't fail the entire request, just log the error
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Order list created successfully',
      data: orderList,
    });
  } catch (error) {
    console.error('Order lists API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred',
      },
      { status: 500 },
    );
  }
}

// PUT and DELETE moved to /api/order-lists/[id]
