import { normalizeIngredientData } from '@/lib/ingredients/normalizeIngredientDataMain';
import { createSupabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabaseAdmin = createSupabaseAdmin();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    const { data, error, count } = await supabaseAdmin
      .from('ingredients')
      .select('*', { count: 'exact' })
      .order('ingredient_name')
      .range(start, end);

    if (error) {
      console.error('Error fetching ingredients:', error);
      return NextResponse.json(
        {
          error: 'Failed to fetch ingredients',
          details: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        items: data || [],
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize),
      },
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = createSupabaseAdmin();
    const body = await request.json();

    // Normalize ingredient data
    const { normalized, error: normalizeError } = normalizeIngredientData(body);
    if (normalizeError) {
      return NextResponse.json(
        {
          error: 'Failed to normalize ingredient data',
          details: normalizeError,
        },
        { status: 400 },
      );
    }

    // Insert using admin client (bypasses RLS)
    const { data, error } = await supabaseAdmin
      .from('ingredients')
      .insert([normalized])
      .select();

    if (error) {
      console.error('Error inserting ingredient:', error);
      return NextResponse.json(
        {
          error: 'Failed to add ingredient',
          details: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: data?.[0] || null,
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabaseAdmin = createSupabaseAdmin();
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        {
          error: 'Ingredient ID is required',
        },
        { status: 400 },
      );
    }

    // Format text fields
    const formattedUpdates: any = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    if (updates.ingredient_name) {
      const { formatIngredientName } = await import('@/lib/text-utils');
      formattedUpdates.ingredient_name = formatIngredientName(updates.ingredient_name);
    }
    if (updates.brand) {
      const { formatBrandName } = await import('@/lib/text-utils');
      formattedUpdates.brand = formatBrandName(updates.brand);
    }
    if (updates.supplier) {
      const { formatSupplierName } = await import('@/lib/text-utils');
      formattedUpdates.supplier = formatSupplierName(updates.supplier);
    }
    if (updates.storage_location) {
      const { formatStorageLocation } = await import('@/lib/text-utils');
      formattedUpdates.storage_location = formatStorageLocation(updates.storage_location);
    }
    if (updates.product_code) {
      const { formatTextInput } = await import('@/lib/text-utils');
      formattedUpdates.product_code = formatTextInput(updates.product_code);
    }

    // Update using admin client (bypasses RLS)
    const { data, error } = await supabaseAdmin
      .from('ingredients')
      .update(formattedUpdates)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error updating ingredient:', error);
      return NextResponse.json(
        {
          error: 'Failed to update ingredient',
          details: error.message,
        },
        { status: 500 },
      );
    }

    if (!data) {
      return NextResponse.json(
        {
          error: 'Ingredient not found',
          details: 'The ingredient may have been deleted',
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabaseAdmin = createSupabaseAdmin();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        {
          error: 'Ingredient ID is required',
        },
        { status: 400 },
      );
    }

    // Delete using admin client (bypasses RLS)
    const { error } = await supabaseAdmin.from('ingredients').delete().eq('id', id);

    if (error) {
      console.error('Error deleting ingredient:', error);
      return NextResponse.json(
        {
          error: 'Failed to delete ingredient',
          details: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Ingredient deleted successfully',
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
