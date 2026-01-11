/**
 * Helper functions for CurbOS public token operations
 */

import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import crypto from 'crypto';

/**
 * Generate a secure public token for CurbOS display
 */
export function generatePublicToken(): string {
  return crypto.randomBytes(32).toString('hex'); // 64-character hex string
}

/**
 * Handle token fetch errors
 */
export function handleTokenFetchError(error: any, userEmail: string): void {
  logger.error('[CurbOS Public Token] Error fetching existing token:', {
    error: error.message,
    code: error.code,
    details: error.details,
    hint: error.hint,
    userEmail,
  });

  // Check if table doesn't exist (common error code)
  if (error.code === '42P01' || error.message?.includes('does not exist')) {
    logger.error(
      '[CurbOS Public Token] Table curbos_public_tokens does not exist. Please run migration: migrations/add-curbos-public-tokens.sql',
    );
  }
}

/**
 * Handle token insert errors
 */
export function handleTokenInsertError(error: any, userEmail: string): void {
  logger.error('[CurbOS Public Token] Error inserting new token:', {
    error: error.message,
    code: error.code,
    details: error.details,
    hint: error.hint,
    userEmail,
  });

  // Check for common errors
  if (error.code === '42P01' || error.message?.includes('does not exist')) {
    logger.error(
      '[CurbOS Public Token] Table curbos_public_tokens does not exist. Please run migration: migrations/add-curbos-public-tokens.sql',
    );
  } else if (error.code === '23505') {
    logger.error(
      '[CurbOS Public Token] Unique constraint violation. Token or email already exists.',
    );
  }
}
