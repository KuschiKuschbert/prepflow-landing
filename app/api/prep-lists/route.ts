import { ApiErrorHandler } from '@/lib/api-error-handler';
import { getAuthenticatedUserByEmail } from '@/lib/api-helpers/getAuthenticatedUserByEmail';
import { logger } from '@/lib/logger';
import { parseAndValidate } from '@/lib/api/parse-request-body';
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
    logger.error('[Prep Lists API] GET failed', { error: err });
    return catchPrepListHandler(err, 'GET');
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId: authUserId } = await getAuthenticatedUserByEmail(request);

    const parsed = await parseAndValidate(request, createPrepListSchema, '[Prep Lists API]');
    if (!parsed.ok) return parsed.response;

    const { kitchenSectionId, name, notes, items } = parsed.data;

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

    const parsed = await parseAndValidate(request, updatePrepListSchema, '[Prep Lists API]');
    if (!parsed.ok) return parsed.response;

    const data = await updatePrepList(parsed.data, authUserId);

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
