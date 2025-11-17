import { ApiError, SUPABASE_ERROR_CODES } from './supabaseErrorParser';

interface PostgrestError {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}

export function isNetworkError(error: any): boolean {
  return (
    error.code === 'NETWORK_ERROR' ||
    error.message?.includes('fetch') ||
    error.message?.includes('network') ||
    error.message?.includes('Failed to fetch')
  );
}

export function isServerError(error: ApiError): boolean {
  return error.status ? error.status >= 500 : false;
}

export function isClientError(error: ApiError): boolean {
  return error.status ? error.status >= 400 && error.status < 500 : false;
}

export function isTableNotFoundError(error: PostgrestError | unknown): boolean {
  if (typeof error !== 'object' || error === null) return false;
  const err = error as PostgrestError;
  return (
    err.code === SUPABASE_ERROR_CODES.TABLE_NOT_FOUND ||
    err.message?.includes('does not exist') ||
    (err.message?.includes('relation') && err.message?.includes('does not exist'))
  );
}

export function isRowNotFoundError(error: PostgrestError | unknown): boolean {
  if (typeof error !== 'object' || error === null) return false;
  const err = error as PostgrestError;
  return err.code === SUPABASE_ERROR_CODES.ROW_NOT_FOUND;
}
