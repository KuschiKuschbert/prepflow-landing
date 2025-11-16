import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import {
  fetchPrepListsData,
  fetchRelatedData,
  fetchIngredientsBatch,
  combinePrepListData,
} from './helpers/fetchPrepLists';
import { createPrepList } from './helpers/createPrepList';
import { updatePrepList } from './helpers/updatePrepList';
import { deletePrepList } from './helpers/deletePrepList';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');

    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          error: 'Database connection not available',
        },
        { status: 500 },
      );
    }

    // Step 1: Fetch prep lists
    const { prepLists, count, empty } = await fetchPrepListsData({ userId, page, pageSize });

    // If empty or fallback case, return early
    if (empty) {
      const totalPages = Math.max(1, Math.ceil(count / pageSize));
      return NextResponse.json({
        success: true,
        data: {
          items: prepLists.map((list: any) => ({
            ...list,
            kitchen_section_id: list.kitchen_section_id || list.section_id,
            kitchen_sections: null,
            prep_list_items: [],
          })),
          total: count,
          page,
          pageSize,
          totalPages,
        },
      });
    }

    // Step 2: Fetch related data
    const { sectionsMap, itemsByPrepListId, prepListItems } = await fetchRelatedData(prepLists);

    // Step 3: Fetch ingredients in batch
    const ingredientIds = Array.from(
      new Set(prepListItems.map((item: any) => item.ingredient_id).filter(Boolean)),
    );
    const ingredientsMap = await fetchIngredientsBatch(ingredientIds);

    // Step 4: Combine all data
    const mappedData = combinePrepListData(
      prepLists,
      sectionsMap,
      itemsByPrepListId,
      ingredientsMap,
    );

    const totalPages = Math.max(1, Math.ceil(count / pageSize));

    return NextResponse.json({
      success: true,
      data: {
        items: mappedData,
        total: count,
        page,
        pageSize,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Prep lists API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, kitchenSectionId, name, notes, items } = body;

    if (!userId || !kitchenSectionId || !name) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          message: 'User ID, kitchen section ID, and name are required',
        },
        { status: 400 },
      );
    }

    const prepList = await createPrepList({ userId, kitchenSectionId, name, notes, items });

    return NextResponse.json({
      success: true,
      message: 'Prep list created successfully',
      data: prepList,
    });
  } catch (error) {
    console.error('Prep lists API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, kitchenSectionId, name, notes, status, items } = body;

    if (!id) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          message: 'Prep list ID is required',
        },
        { status: 400 },
      );
    }

    const data = await updatePrepList({ id, kitchenSectionId, name, notes, status, items });

    return NextResponse.json({
      success: true,
      message: 'Prep list updated successfully',
      data,
    });
  } catch (error) {
    console.error('Prep lists API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        {
          error: 'Missing ID',
          message: 'Prep list ID is required',
        },
        { status: 400 },
      );
    }

    await deletePrepList(id);

    return NextResponse.json({
      success: true,
      message: 'Prep list deleted successfully',
    });
  } catch (error) {
    console.error('Prep lists API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
      { status: 500 },
    );
  }
}
