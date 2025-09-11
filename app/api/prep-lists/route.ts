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
      .from('prep_lists')
      .select(`
        *,
        kitchen_sections (
          id,
          name,
          color
        ),
        prep_list_items (
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
      console.error('Error fetching prep lists:', error);
      return NextResponse.json({ 
        error: 'Failed to fetch prep lists',
        message: 'Could not retrieve prep list data'
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      data: data || []
    });

  } catch (error) {
    console.error('Prep lists API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: 'An unexpected error occurred'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, kitchenSectionId, name, notes, items } = body;

    if (!userId || !kitchenSectionId || !name) {
      return NextResponse.json({ 
        error: 'Missing required fields',
        message: 'User ID, kitchen section ID, and name are required'
      }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ 
        error: 'Database connection not available' 
      }, { status: 500 });
    }

    // Create the prep list
    const { data: prepList, error: prepError } = await supabaseAdmin
      .from('prep_lists')
      .insert({
        user_id: userId,
        kitchen_section_id: kitchenSectionId,
        name: name,
        notes: notes,
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (prepError) {
      console.error('Error creating prep list:', prepError);
      return NextResponse.json({ 
        error: 'Failed to create prep list',
        message: 'Could not save prep list data'
      }, { status: 500 });
    }

    // Add items if provided
    if (items && items.length > 0) {
      const prepItems = items.map((item: any) => ({
        prep_list_id: prepList.id,
        ingredient_id: item.ingredientId,
        quantity: item.quantity,
        unit: item.unit,
        notes: item.notes
      }));

      const { error: itemsError } = await supabaseAdmin
        .from('prep_list_items')
        .insert(prepItems);

      if (itemsError) {
        console.error('Error creating prep list items:', itemsError);
        // Don't fail the entire request, just log the error
      }
    }

    return NextResponse.json({ 
      success: true,
      message: 'Prep list created successfully',
      data: prepList
    });

  } catch (error) {
    console.error('Prep lists API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: 'An unexpected error occurred'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, kitchenSectionId, name, notes, status, items } = body;

    if (!id) {
      return NextResponse.json({ 
        error: 'Missing required fields',
        message: 'Prep list ID is required'
      }, { status: 400 });
    }

    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (kitchenSectionId !== undefined) updateData.kitchen_section_id = kitchenSectionId;
    if (name !== undefined) updateData.name = name;
    if (notes !== undefined) updateData.notes = notes;
    if (status !== undefined) updateData.status = status;

    if (!supabaseAdmin) {
      return NextResponse.json({ 
        error: 'Database connection not available' 
      }, { status: 500 });
    }

    const { data, error } = await supabaseAdmin
      .from('prep_lists')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating prep list:', error);
      return NextResponse.json({ 
        error: 'Failed to update prep list',
        message: 'Could not update prep list data'
      }, { status: 500 });
    }

    // Update items if provided
    if (items !== undefined) {
      // Delete existing items
      await supabaseAdmin
        .from('prep_list_items')
        .delete()
        .eq('prep_list_id', id);

      // Add new items
      if (items.length > 0) {
        const prepItems = items.map((item: any) => ({
          prep_list_id: id,
          ingredient_id: item.ingredientId,
          quantity: item.quantity,
          unit: item.unit,
          notes: item.notes
        }));

        await supabaseAdmin
          .from('prep_list_items')
          .insert(prepItems);
      }
    }

    return NextResponse.json({ 
      success: true,
      message: 'Prep list updated successfully',
      data
    });

  } catch (error) {
    console.error('Prep lists API error:', error);
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
        message: 'Prep list ID is required'
      }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ 
        error: 'Database connection not available' 
      }, { status: 500 });
    }

    // Delete prep list items first (foreign key constraint)
    await supabaseAdmin
      .from('prep_list_items')
      .delete()
      .eq('prep_list_id', id);

    // Delete the prep list
    const { error } = await supabaseAdmin
      .from('prep_lists')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting prep list:', error);
      return NextResponse.json({ 
        error: 'Failed to delete prep list',
        message: 'Could not remove prep list'
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Prep list deleted successfully'
    });

  } catch (error) {
    console.error('Prep lists API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: 'An unexpected error occurred'
    }, { status: 500 });
  }
}
