import { ApiErrorHandler } from '@/lib/api-error-handler';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const supportRequestSchema = z.object({
  subject: z.string().min(1).max(200),
  message: z.string().min(10).max(5000),
  type: z.enum(['bug', 'feature', 'question', 'error', 'other']).optional(),
  related_error_id: z.string().uuid().optional(),
});

/**
 * Validate support request body
 */
export function validateRequest(body: any): { isValid: boolean; data?: any; error?: NextResponse } {
  const validationResult = supportRequestSchema.safeParse(body);
  if (!validationResult.success) {
    return {
      isValid: false,
      error: NextResponse.json(
        ApiErrorHandler.createError(
          'Invalid request data',
          'VALIDATION_ERROR',
          400,
          validationResult.error.issues,
        ),
        { status: 400 },
      ),
    };
  }

  return { isValid: true, data: validationResult.data };
}
