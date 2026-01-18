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
import { createPrepListSchema, getPrepListsSchema, updatePrepListSchema } from './helpers/schemas';
import { transformItems } from './helpers/transformItems';
import { updatePrepList } from './helpers/updatePrepList';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());

    const validation = getPrepListsSchema.safeParse(params);
    if (!validation.success) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          validation.error.issues[0]?.message || 'Invalid query parameters',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    const { userId, page, pageSize } = validation.data;

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const { prepLists, count, empty } = await fetchPrepListsData({
      userId: userId || null,
      page,
      pageSize,
    });

    if (empty) {
      const totalPages = Math.max(1, Math.ceil(count / pageSize));
      const mappedPrepLists = prepLists.map(list => ({
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
        prepListItems.map(item => item.ingredient_id).filter((id): id is string => Boolean(id)),
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
    } catch (_err) {
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid JSON body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const validation = createPrepListSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          validation.error.issues[0]?.message || 'Invalid request body',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    const { userId, kitchenSectionId, name, notes, items } = validation.data;
    const prepList = await createPrepList({
      userId,
      kitchenSectionId,
      name,
      notes,
      items: transformItems(items || []),
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
    return handlePrepListError(err, 'POST');
  }
}

export async function PUT(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch (_err) {
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid JSON body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const validation = updatePrepListSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          validation.error.issues[0]?.message || 'Invalid request body',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    const data = await updatePrepList(validation.data);

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
    return handlePrepListError(err, 'DELETE');
  }
}
