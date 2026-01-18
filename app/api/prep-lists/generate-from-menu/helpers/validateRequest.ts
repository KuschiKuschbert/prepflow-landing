import { ApiErrorHandler } from '@/lib/api-error-handler';
import { NextResponse } from 'next/server';
import { generateFromMenuSchema } from '../../helpers/schemas';

/**
 * Validate request body for menu ID.
 *
 * @param {unknown} body - Request body
 * @returns {Promise<{menuId: string | null, userId?: string, error: NextResponse | null}>} Validated data and error if any
 */
export async function validateRequest(body: unknown) {
  const validation = generateFromMenuSchema.safeParse(body);

  if (!validation.success) {
    return {
      menuId: null,
      userId: undefined,
      error: NextResponse.json(
        ApiErrorHandler.createError(
          validation.error.issues[0]?.message || 'Invalid request parameters',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      ),
    };
  }

  return { ...validation.data, error: null };
}
