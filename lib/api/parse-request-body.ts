/**
 * Shared utility for safely parsing and validating API request bodies.
 *
 * Extracted from the duplicated `safeParseBody` pattern found across multiple
 * AI API routes (performance-tips, performance-insights, chat, prep-details).
 */

import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import type { ZodSchema, ZodError } from 'zod';
import { ApiErrorHandler } from '@/lib/api-error-handler';

/**
 * Safely parse a request body as JSON.
 * Returns `null` (and logs a warning) if the body is missing or malformed.
 *
 * @param request - Incoming Next.js request
 * @param context - Log prefix for the calling route (e.g. '[AI Chat API]')
 * @returns Parsed body or null on failure
 *
 * @example
 * ```typescript
 * const body = await safeParseBody(request, '[AI Chat]');
 * if (!body) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
 * ```
 */
export async function safeParseBody(
  request: NextRequest,
  context: string = '[API]',
): Promise<unknown> {
  try {
    return await request.json();
  } catch (err) {
    logger.warn(`${context} Failed to parse request body:`, {
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  }
}

/**
 * Parse and Zod-validate a request body in one step.
 * Returns either the validated data or a ready-to-send 400 NextResponse.
 *
 * @param request - Incoming Next.js request
 * @param schema - Zod schema to validate against
 * @param context - Log prefix for the calling route
 * @returns `{ ok: true, data: T }` or `{ ok: false, response: NextResponse }`
 *
 * @example
 * ```typescript
 * const parsed = await parseAndValidate(request, mySchema, '[AI Chat]');
 * if (!parsed.ok) return parsed.response;
 * const { data } = parsed;
 * ```
 */
export async function parseAndValidate<T>(
  request: NextRequest,
  schema: ZodSchema<T>,
  context: string = '[API]',
): Promise<{ ok: true; data: T } | { ok: false; response: NextResponse }> {
  const body = await safeParseBody(request, context);

  const result = schema.safeParse(body ?? {});
  if (!result.success) {
    const zodError = result.error as ZodError;
    const message = zodError.issues[0]?.message ?? 'Invalid request body';
    return {
      ok: false,
      response: NextResponse.json(ApiErrorHandler.createError(message, 'VALIDATION_ERROR', 400), {
        status: 400,
      }),
    };
  }

  return { ok: true, data: result.data };
}
