import { PostgrestError } from '@supabase/supabase-js';

export const SUPABASE_ERROR_CODES = {
  TABLE_NOT_FOUND: '42P01',
  COLUMN_NOT_FOUND: '42703',
  NOT_NULL_VIOLATION: '23502',
  UNIQUE_VIOLATION: '23505',
  FOREIGN_KEY_VIOLATION: '23503',
  CHECK_VIOLATION: '23514',
  ROW_NOT_FOUND: 'PGRST116',
} as const;

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: unknown;
  timestamp?: Date;
}

export function parseSupabaseError(
  error: PostgrestError | unknown,
  defaultStatus: number = 500,
): ApiError {
  const isPostgrestError = (err: unknown): err is PostgrestError => {
    return (
      typeof err === 'object' &&
      err !== null &&
      'message' in err &&
      typeof (err as PostgrestError).message === 'string'
    );
  };
  if (!isPostgrestError(error)) {
    return {
      message: "Something went wrong while saving your data. We're on it - try again in a moment.",
      code: 'DATABASE_ERROR',
      status: defaultStatus,
      details: error instanceof Error ? { message: error.message, stack: error.stack } : error,
      timestamp: new Date(),
    };
  }
  const errorCode = error.code;
  const errorMessage = error.message || 'Database error occurred';
  const errorDetails = error.details;
  const errorHint = error.hint;
  let userMessage = errorMessage;
  if (errorDetails && errorDetails !== errorMessage) userMessage += `: ${errorDetails}`;
  if (errorHint && errorHint !== errorDetails) userMessage += ` (${errorHint})`;
  switch (errorCode) {
    case SUPABASE_ERROR_CODES.TABLE_NOT_FOUND:
      return {
        message:
          "We couldn't find what we're looking for. This might be a setup issue - check your configuration.",
        code: 'TABLE_NOT_FOUND',
        status: 500,
        details:
          process.env.NODE_ENV === 'development'
            ? { hint: errorMessage, code: errorCode }
            : undefined,
        timestamp: new Date(),
      };
    case SUPABASE_ERROR_CODES.COLUMN_NOT_FOUND:
      return {
        message:
          "We couldn't find what we're looking for. This might be a setup issue - check your configuration.",
        code: 'COLUMN_NOT_FOUND',
        status: 500,
        details:
          process.env.NODE_ENV === 'development'
            ? { hint: errorMessage, code: errorCode }
            : undefined,
        timestamp: new Date(),
      };
    case SUPABASE_ERROR_CODES.NOT_NULL_VIOLATION:
      return {
        message: 'Required field is missing',
        code: 'NOT_NULL_VIOLATION',
        status: 400,
        details:
          process.env.NODE_ENV === 'development' ? { hint: errorHint, code: errorCode } : undefined,
        timestamp: new Date(),
      };
    case SUPABASE_ERROR_CODES.UNIQUE_VIOLATION:
      return {
        message: 'This record already exists',
        code: 'UNIQUE_VIOLATION',
        status: 409,
        details:
          process.env.NODE_ENV === 'development' ? { hint: errorHint, code: errorCode } : undefined,
        timestamp: new Date(),
      };
    case SUPABASE_ERROR_CODES.FOREIGN_KEY_VIOLATION:
      return {
        message: "Referenced record doesn't exist",
        code: 'FOREIGN_KEY_VIOLATION',
        status: 400,
        details:
          process.env.NODE_ENV === 'development' ? { hint: errorHint, code: errorCode } : undefined,
        timestamp: new Date(),
      };
    case SUPABASE_ERROR_CODES.CHECK_VIOLATION:
      return {
        message: 'Data validation failed',
        code: 'CHECK_VIOLATION',
        status: 400,
        details:
          process.env.NODE_ENV === 'development' ? { hint: errorHint, code: errorCode } : undefined,
        timestamp: new Date(),
      };
    case SUPABASE_ERROR_CODES.ROW_NOT_FOUND:
      return {
        message: 'Record not found',
        code: 'NOT_FOUND',
        status: 404,
        details: process.env.NODE_ENV === 'development' ? { code: errorCode } : undefined,
        timestamp: new Date(),
      };
    default:
      return {
        message: process.env.NODE_ENV === 'development' ? userMessage : 'Database error occurred',
        code: errorCode ? `DATABASE_ERROR_${errorCode}` : 'DATABASE_ERROR',
        status: defaultStatus,
        details:
          process.env.NODE_ENV === 'development'
            ? { message: errorMessage, details: errorDetails, hint: errorHint, code: errorCode }
            : undefined,
        timestamp: new Date(),
      };
  }
}
