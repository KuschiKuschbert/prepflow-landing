import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { createPrepList } from './helpers/createPrepList';
import { deletePrepList } from './helpers/deletePrepList';
import {
    combinePrepListData,
    fetchIngredientsBatch,
    fetchPrepListsData,
    fetchRelatedData,
} from './helpers/fetchPrepLists';
import { handlePrepListError } from './helpers/handlePrepListError';
import { parseDeleteRequest } from './helpers/parseDeleteRequest';
import { createPrepListSchema } from './helpers/schemas';
import { transformItems } from './helpers/transformItems';
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

    const { prepLists, count, empty } = await fetchPrepListsData({ userId, page, pageSize });

    if (empty) {
      const totalPages = Math.max(1, Math.ceil(count / pageSize));
      const mappedPrepLists = prepLists.map((list) => ({
        ...list,
        kitchen_section_id: list.kitchen_section_id || list.section_id,
        kitchen_sections: null,
        prep_list_items: [],
      }));
      return NextResponse.json({
        success: true,
        data: { items: mappedPrepLists, total: count, page, pageSize, totalPages },
      });
    }

    const { sectionsMap, itemsByPrepListId, prepListItems } = await fetchRelatedData(prepLists);
    const ingredientIds = Array.from(
      new Set(
        prepListItems
          .map((item) => item.ingredient_id)
          .filter((id): id is string => Boolean(id))
      ),
    );
    const ingredientsMap = await fetchIngredientsBatch(ingredientIds);
    const mappedData = combinePrepListData(
      prepLists,
      sectionsMap,
      itemsByPrepListId,
      ingredientsMap,
    );
    const totalPages = Math.max(1, Math.ceil(count / pageSize));

    return NextResponse.json({
      success: true,
      data: { items: mappedData, total: count, page, pageSize, totalPages },
    });
  } catch (err) {
    logger.error('[Prep Lists API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/prep-lists', method: 'GET' },
    });
    return handlePrepListError(err, 'GET');
  }
}

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch (err) {
      logger.warn('[Prep Lists API] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const validationResult = createPrepListSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          validationResult.error.issues[0]?.message || 'Invalid request body',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    const { userId, kitchenSectionId, name, notes, items } = validationResult.data;
    const prepList = await createPrepList({
      userId,
      kitchenSectionId,
      name,
      notes,
      items: transformItems(items),
    });

    return NextResponse.json({
      success: true,
      message: 'Prep list created successfully',
      data: prepList,
    });
  } catch (err: unknown) {
    logger.error('[Prep Lists API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/prep-lists', method: 'POST' },
    });
    if (typeof err === 'object' && err !== null && 'status' in err) {
       // @ts-ignore - Validated by runtime check
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
  } catch (err: unknown) {
    logger.error('[Prep Lists API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/prep-lists', method: 'PUT' },
    });
     if (typeof err === 'object' && err !== null && 'status' in err) {
       // @ts-ignore - Validated by runtime check
      return NextResponse.json(err, { status: err.status });
    }
    return handlePrepListError(err, 'PUT');
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = parseDeleteRequest(request);

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
  } catch (err: unknown) {
    logger.error('[Prep Lists API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      context: { endpoint: '/api/prep-lists', method: 'DELETE' },
    });
     if (typeof err === 'object' && err !== null && 'status' in err) {
       // @ts-ignore - Validated by runtime check
      return NextResponse.json(err, { status: err.status });
    }
    return handlePrepListError(err, 'DELETE');
  }
}
