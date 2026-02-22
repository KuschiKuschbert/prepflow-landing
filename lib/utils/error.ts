export interface AppError {
  message: string;
  code?: string;
  status?: number;
  originalError: unknown;
}

// Interface for extracting properties from unknown error objects
interface ErrorLike {
  message?: unknown;
  details?: unknown;
  code?: unknown;
  status?: unknown;
  statusCode?: unknown;
}

/**
 * Safely extracts error information from an unknown error object.
 * Handles generic Errors, Supabase errors (PostgrestError), and simple strings.
 */
export function getAppError(error: unknown): AppError {
  if (error instanceof Error) {
    // Check for common properties like 'code' or 'status' that might be on extended Error objects
    const errorObj = error as Error & ErrorLike;
    const code = errorObj.code;
    const status = errorObj.status || errorObj.statusCode;

    return {
      message: error.message,
      code: typeof code === 'string' ? code : undefined,
      status: typeof status === 'number' ? status : undefined,
      originalError: error,
    };
  }

  if (typeof error === 'object' && error !== null) {
    // Handle Supabase/Postgrest style errors
    const errorObj = error as ErrorLike;
    const message = errorObj.message || errorObj.details || 'Unknown error occurred';
    const code = errorObj.code;
    const status = errorObj.status;

    return {
      message: typeof message === 'string' ? message : JSON.stringify(message),
      code: typeof code === 'string' ? code : undefined,
      status: typeof status === 'number' ? status : undefined,
      originalError: error,
    };
  }

  if (typeof error === 'string') {
    return {
      message: error,
      originalError: error,
    };
  }

  return {
    message: 'Something unexpected happened. Try again?',
    originalError: error,
  };
}
