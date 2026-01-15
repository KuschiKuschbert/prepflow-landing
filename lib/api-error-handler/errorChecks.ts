import { PostgrestError } from '@supabase/supabase-js';
import { ApiError, SUPABASE_ERROR_CODES } from './supabaseErrorParser';

export function isNetworkError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) return false;
  const err = error as { code?: string; message?: string };
  return (
    err.code === 'NETWORK_ERROR' ||
    err.message?.includes('fetch') ||
    err.message?.includes('network') ||
    err.message?.includes('Failed to fetch') ||
    false
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
