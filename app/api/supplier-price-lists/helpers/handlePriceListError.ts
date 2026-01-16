import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';

/**
 * Handle supplier price list API errors consistently.
 *
 * @param {Error | any} error - Error object
 * @param {string} operation - Operation name (GET, POST, PUT, DELETE)
 * @returns {NextResponse} Error response
 */
export function handlePriceListError(error: Error | unknown, operation: string): NextResponse {
  logger.error(`[Supplier Price Lists API] ${operation} error:`, {
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    context: { endpoint: '/api/supplier-price-lists', operation },
  });

  return NextResponse.json(
    {
      error: `Failed to ${operation.toLowerCase()} supplier price list`,
      message: error instanceof Error ? error.message : 'Unknown error',
    },
    { status: 500 },
  );
}
