/**
 * Helper to validate batch cost calculation request.
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { NextResponse } from 'next/server';

/**
 * Validate request body contains dishIds array.
 */
export function validateRequest(body: unknown): { dishIds: string[] } | { error: NextResponse } {
  const { dishIds } = body as { dishIds: string[] };

  if (!Array.isArray(dishIds) || dishIds.length === 0) {
    return {
      error: NextResponse.json(
        ApiErrorHandler.createError('dishIds array is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      ),
    };
  }

  return { dishIds };
}
