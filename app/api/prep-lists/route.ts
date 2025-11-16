import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { createPrepList } from './helpers/createPrepList';
import { deletePrepList } from './helpers/deletePrepList';
import {
  combinePrepListData,
  fetchIngredientsBatch,
  fetchPrepListsData,
  fetchRelatedData,
} from './helpers/fetchPrepLists';
import { handlePrepListError } from './helpers/handlePrepListError';
import { updatePrepList } from './helpers/updatePrepList';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
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
  } catch (err) {
    return handlePrepListError(err, 'GET');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, kitchenSectionId, name, notes, items } = body;

    if (!userId || !kitchenSectionId || !name) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'userId, kitchenSectionId, and name are required',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    const prepList = await createPrepList({ userId, kitchenSectionId, name, notes, items });

    return NextResponse.json({
      success: true,
      message: 'Prep list created successfully',
      data: prepList,
    });
  } catch (err: any) {
    if (err.status) {
      return NextResponse.json(err, { status: err.status });
    }
    return handlePrepListError(err, 'POST');
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, kitchenSectionId, name, notes, status, items } = body;

    if (!id) {
      return NextResponse.json(
        ApiErrorHandler.createError('Prep list ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const data = await updatePrepList({ id, kitchenSectionId, name, notes, status, items });

    return NextResponse.json({
      success: true,
      message: 'Prep list updated successfully',
      data,
    });
  } catch (err: any) {
    if (err.status) {
      return NextResponse.json(err, { status: err.status });
    }
    return handlePrepListError(err, 'PUT');
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        ApiErrorHandler.createError('Prep list ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    await deletePrepList(id);

    return NextResponse.json({
      success: true,
      message: 'Prep list deleted successfully',
    });
  } catch (err: any) {
    if (err.status) {
      return NextResponse.json(err, { status: err.status });
    }
    return handlePrepListError(err, 'DELETE');
  }
}
