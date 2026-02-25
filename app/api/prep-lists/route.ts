import { ApiErrorHandler } from '@/lib/api-error-handler';
import { getAuthenticatedUserByEmail } from '@/lib/api-helpers/getAuthenticatedUserByEmail';
import { NextRequest, NextResponse } from 'next/server';
import { createPrepList } from './helpers/createPrepList';
import { deletePrepList } from './helpers/deletePrepList';
import { fetchAllPrepListData } from './helpers/fetchPrepLists';
import { catchPrepListHandler } from './helpers/handlePrepListError';
import { parseDeleteRequest } from './helpers/parseDeleteRequest';
import { createPrepListSchema, getPrepListsSchema, updatePrepListSchema } from './helpers/schemas';
import { transformItems } from './helpers/transformItems';
import { updatePrepList } from './helpers/updatePrepList';

export async function GET(request: NextRequest) {
  try {
    const { userId: authUserId } = await getAuthenticatedUserByEmail(request);

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

    const { page, pageSize } = validation.data;

    // Use authUserId to ensure security
    const data = await fetchAllPrepListData({
      userId: authUserId,
      page,
      pageSize,
    });

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err) {
    return catchPrepListHandler(err, 'GET');
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId: authUserId } = await getAuthenticatedUserByEmail(request);

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

    const { kitchenSectionId, name, notes, items } = validation.data;

    // Overwrite userId with authenticated user ID
    const prepList = await createPrepList({
      userId: authUserId,
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
    return catchPrepListHandler(err, 'POST');
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId: authUserId } = await getAuthenticatedUserByEmail(request);

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

    const data = await updatePrepList(validation.data, authUserId);

    return NextResponse.json({
      success: true,
      message: 'Prep list updated successfully',
      data,
    });
  } catch (err: unknown) {
    return catchPrepListHandler(err, 'PUT');
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId: authUserId } = await getAuthenticatedUserByEmail(request);

    const id = parseDeleteRequest(request);

    if (!id) {
      return NextResponse.json(
        ApiErrorHandler.createError('Prep list ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    await deletePrepList(id, authUserId);

    return NextResponse.json({
      success: true,
      message: 'Prep list deleted successfully',
    });
  } catch (err: unknown) {
    return catchPrepListHandler(err, 'DELETE');
  }
}
