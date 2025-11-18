import { NextResponse } from 'next/server';

/**
 * Validate menu item request parameters.
 *
 * @param {string} menuId - Menu ID
 * @param {string} menuItemId - Menu item ID
 * @returns {NextResponse | null} Error response if validation fails, null if valid
 */
export function validateMenuItemRequest(menuId: string, menuItemId: string): NextResponse | null {
  if (!menuId || !menuItemId) {
    return NextResponse.json(
      {
        success: false,
        error: 'Missing menu id or item id',
        message: 'Both menu id and item id are required',
      },
      { status: 400 },
    );
  }
  return null;
}
