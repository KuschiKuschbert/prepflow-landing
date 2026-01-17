import { logger } from '@/lib/logger';
import { NextRequest } from 'next/server';
import { prepDetailsSchema, ValidatedPrepDetailsRequest } from '../types';

export interface ValidationResult {
  success: boolean;
  data?: ValidatedPrepDetailsRequest;
  error?: string;
  statusCode?: number;
}

/**
 * Validates the prep details request body.
 */
export async function validateRequest(request: NextRequest): Promise<ValidationResult> {
  let body: unknown;
  try {
    body = await request.json();
  } catch (err) {
    logger.warn('[AI Prep Details] Failed to parse request body:', {
      error: err instanceof Error ? err.message : String(err),
    });
    return {
      success: false,
      error: 'Invalid request body',
      statusCode: 400,
    };
  }

  const result = prepDetailsSchema.safeParse(body);
  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0]?.message || 'Invalid request body',
      statusCode: 400,
    };
  }

  return {
    success: true,
    data: result.data as ValidatedPrepDetailsRequest,
  };
}
