import { NextRequest, NextResponse } from 'next/server';

/**
 * Validate request body for menu ID.
 *
 * @param {any} body - Request body
 * @returns {Promise<{menuId: string, userId?: string, error: NextResponse | null}>} Validated data and error if any
 */
export async function validateRequest(body: any) {
  const { menuId, userId } = body;

  if (!menuId) {
    return {
      menuId: null,
      userId: undefined,
      error: NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          message: 'Menu ID is required',
        },
        { status: 400 },
      ),
    };
  }

  return { menuId, userId, error: null };
}
