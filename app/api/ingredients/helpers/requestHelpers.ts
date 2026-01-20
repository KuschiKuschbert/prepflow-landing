import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { ZodSchema } from 'zod';

export async function parseAndValidateRequest<T>(
  request: NextRequest,
  schema: ZodSchema<T>,
  context: string,
): Promise<T | NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch (err) {
    logger.warn(`[${context}] Failed to parse request JSON:`, {
      error: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
      { status: 400 },
    );
  }

  const validationResult = schema.safeParse(body);
  if (!validationResult.success) {
    return NextResponse.json(
      ApiErrorHandler.createError(
        validationResult.error.issues[0]?.message || 'Invalid request body',
        'VALIDATION_ERROR',
        400,
      ),
      { status: 400 },
    );
  }

  return validationResult.data;
}
