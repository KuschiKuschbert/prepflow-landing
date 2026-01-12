import { NextResponse } from 'next/server';

/**
 * Validate request body for menu ID.
 *
 * @param {any} body - Request body
 * @returns {Promise<{menuId: string, userId?: string, error: NextResponse | null}>} Validated data and error if any
 */
export async function validateRequest(body: unknown) {
  // Use a type guard or safe access
  const safeBody = body as { menuId?: string; userId?: string } | null;
  const menuId = safeBody?.menuId;
  const userId = safeBody?.userId;

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
