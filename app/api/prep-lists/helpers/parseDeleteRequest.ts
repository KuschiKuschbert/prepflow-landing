import { NextRequest } from 'next/server';

/**
 * Parse delete request to extract prep list ID
 */
export function parseDeleteRequest(request: NextRequest): string | null {
  const { searchParams } = new URL(request.url);
  return searchParams.get('id');
}


