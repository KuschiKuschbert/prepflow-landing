import type { AIError } from '../types';
import { logger } from '@/lib/logger';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  shouldRetry: (error: AIError) => boolean,
  parseError: (error: Error) => AIError,
): Promise<{ result?: T; error?: AIError }> {
  let lastError: Error | null = null;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const result = await fn();
      return { result };
    } catch (error) {
      logger.error('[retryHandler.ts] Error in catch block:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

      lastError = error as Error;
      const aiError = parseError(error as Error);
      if (!shouldRetry(aiError) || attempt === MAX_RETRIES - 1) return { error: aiError };
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (attempt + 1)));
    }
  }
  return { error: parseError(lastError || new Error('Unknown error occurred')) };
}
