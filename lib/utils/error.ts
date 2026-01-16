export interface AppError {
  message: string;
  code?: string;
  status?: number;
  originalError: unknown;
}

/**
 * Safely extracts error information from an unknown error object.
 * Handles generic Errors, Supabase errors (PostgrestError), and simple strings.
 */
export function getAppError(error: unknown): AppError {
  if (error instanceof Error) {
    // Check for common properties like 'code' or 'status' that might be on extended Error objects
    const code = (error as any).code;
    const status = (error as any).status || (error as any).statusCode;

    return {
      message: error.message,
      code: typeof code === 'string' ? code : undefined,
      status: typeof status === 'number' ? status : undefined,
      originalError: error,
    };
  }

  if (typeof error === 'object' && error !== null) {
    // Handle Supabase/Postgrest style errors
    const message = (error as any).message || (error as any).details || 'Unknown error occurred';
    const code = (error as any).code;
    const status = (error as any).status;

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
    message: 'An unknown error occurred',
    originalError: error,
  };
}
