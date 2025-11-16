import { NextResponse } from 'next/server';

/**
 * Validate menu ID and return error response if invalid.
 *
 * @param {string | undefined} menuId - Menu ID to validate
 * @returns {NextResponse | null} Error response if invalid, null if valid
 */
export function validateMenuId(menuId: string | undefined): NextResponse | null {
  if (!menuId) {
    return NextResponse.json(
      {
        success: false,
        error: 'Missing menu id',
        message: 'Menu id is required',
      },
      { status: 400 },
    );
  }
  return null;
}
