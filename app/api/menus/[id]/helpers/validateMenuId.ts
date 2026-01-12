import { ApiErrorHandler } from '@/lib/api-error-handler';
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
      ApiErrorHandler.createError('Menu id is required', 'VALIDATION_ERROR', 400),
      { status: 400 },
    );
  }
  return null;
}
