import { logger } from '@/lib/logger';
import { NextRequest } from 'next/server';

export async function safeParseBody(request: NextRequest) {
  try {
    return await request.json();
  } catch (err) {
    logger.warn('[Recipes API] Failed to parse request JSON:', {
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  }
}
