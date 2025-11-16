import { NextResponse } from 'next/server';

/**
 * Format error response for menu API.
 *
 * @param {any} err - Error object with status, error, and message
 * @returns {NextResponse} Formatted error response
 */
export function formatErrorResponse(err: any): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: err.error || 'Error',
      message: err.message || 'An error occurred',
    },
    { status: err.status },
  );
}
