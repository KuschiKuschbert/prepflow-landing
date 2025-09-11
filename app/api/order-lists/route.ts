import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ 
        error: 'User ID is required',
        message: 'Please provide a valid user ID'
      }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ 
        error: 'Database connection not available' 
      }, { status: 500 });
    }

    const { data, error } = await supabaseAdmin
      .from('order_lists')
      .select(`
        *,
        suppliers (
          id,
          name,
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
            name,
            unit,
            category
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching order lists:', error);
      return NextResponse.json({ 
        error: 'Failed to fetch order lists',
        message: 'Could not retrieve order list data'
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      data: data || []
    });

  } catch (error) {
    console.error('Order lists API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: 'An unexpected error occurred'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, supplierId, name, notes, items } = body;

    if (!userId || !supplierId || !name) {
      return NextResponse.json({ 
        error: 'Missing required fields',
        message: 'User ID, supplier ID, and name are required'
      }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ 
        error: 'Database connection not available' 
      }, { status: 500 });
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
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order list:', orderError);
      return NextResponse.json({ 
        error: 'Failed to create order list',
        message: 'Could not save order list data'
      }, { status: 500 });
    }

    // Add items if provided
    if (items && items.length > 0) {
      const orderItems = items.map((item: any) => ({
        order_list_id: orderList.id,
        ingredient_id: item.ingredientId,
        quantity: item.quantity,
        unit: item.unit,
        notes: item.notes
      }));

      const { error: itemsError } = await supabaseAdmin
        .from('order_list_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Error creating order list items:', itemsError);
        // Don't fail the entire request, just log the error
      }
    }

    return NextResponse.json({ 
      success: true,
      message: 'Order list created successfully',
      data: orderList
    });

  } catch (error) {
    console.error('Order lists API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: 'An unexpected error occurred'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, supplierId, name, notes, status, items } = body;

    if (!id) {
      return NextResponse.json({ 
        error: 'Missing required fields',
        message: 'Order list ID is required'
      }, { status: 400 });
    }

    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (supplierId !== undefined) updateData.supplier_id = supplierId;
    if (name !== undefined) updateData.name = name;
    if (notes !== undefined) updateData.notes = notes;
    if (status !== undefined) updateData.status = status;

    if (!supabaseAdmin) {
      return NextResponse.json({ 
        error: 'Database connection not available' 
      }, { status: 500 });
    }

    const { data, error } = await supabaseAdmin
      .from('order_lists')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating order list:', error);
      return NextResponse.json({ 
        error: 'Failed to update order list',
        message: 'Could not update order list data'
      }, { status: 500 });
    }

    // Update items if provided
    if (items !== undefined) {
      // Delete existing items
      await supabaseAdmin
        .from('order_list_items')
        .delete()
        .eq('order_list_id', id);

      // Add new items
      if (items.length > 0) {
        const orderItems = items.map((item: any) => ({
          order_list_id: id,
          ingredient_id: item.ingredientId,
          quantity: item.quantity,
          unit: item.unit,
          notes: item.notes
        }));

        await supabaseAdmin
          .from('order_list_items')
          .insert(orderItems);
      }
    }

    return NextResponse.json({ 
      success: true,
      message: 'Order list updated successfully',
      data
    });

  } catch (error) {
    console.error('Order lists API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: 'An unexpected error occurred'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ 
        error: 'Missing ID',
        message: 'Order list ID is required'
      }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ 
        error: 'Database connection not available' 
      }, { status: 500 });
    }

    // Delete order list items first (foreign key constraint)
    await supabaseAdmin
      .from('order_list_items')
      .delete()
      .eq('order_list_id', id);

    // Delete the order list
    const { error } = await supabaseAdmin
      .from('order_lists')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting order list:', error);
      return NextResponse.json({ 
        error: 'Failed to delete order list',
        message: 'Could not remove order list'
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Order list deleted successfully'
    });

  } catch (error) {
    console.error('Order lists API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: 'An unexpected error occurred'
    }, { status: 500 });
  }
}
